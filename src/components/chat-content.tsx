'use client';

import { useEffect, useRef, useState } from 'react';
import ChatInput from '@components/chat-input';

import { convertFileToBase64 } from '@lib/utils';
import { Message } from './message';
import { MessageData, MessageRoles } from '@/types/types';
import { useChatStore } from '@/store/chat';
import { continueConversation } from '@/app/actions';
import { useAiStore } from '@/store/ai';
import { toast } from '@/hooks/useToast';
import { CoreMessage, UserContent } from 'ai';
import { MB_IN_BYTES } from '@/constants/constants';

export default function ChatContent() {
  const [isLoading, setIsLoading] = useState(false);
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const apiKey = useAiStore((state) => state.apiKey);
  const messagesRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      behavior: 'smooth',
      top: messagesRef.current?.scrollHeight
    });
  }, [messages]);

  const handleSubmit = async (value: string, file?: File) => {
    if (!apiKey) {
      toast({
        title: 'Error',
        content: 'Please enter your API key',
        variant: 'destructive'
      });
      return;
    }

    if (!value.trim()) {
      return;
    }

    if (file && file.size > MB_IN_BYTES) {
      toast({
        title: 'Error',
        description: 'File size too large',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    let img;
    if (file) {
      img = await convertFileToBase64(file);
    }

    const newMessageData: MessageData = {
      id: crypto.randomUUID(),
      content: value,
      role: MessageRoles.USER,
      img
    };

    const newMessages = [...messages, newMessageData];

    addMessage(newMessageData);

    const response = await continueConversation(
      apiKey,
      newMessages.map(({ content, img, role }) => {
        const messageContent: UserContent = [{ type: 'text', text: content }];

        if (img && messageContent.length) {
          messageContent.push({
            type: 'image',
            image: img
          });
        }

        return { role: role, content: messageContent };
      }) as CoreMessage[]
    );

    if (!response) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive'
      });
      return;
    }

    addMessage({
      id: crypto.randomUUID(),
      role: MessageRoles.ASSISTANT,
      content: response
    });
    setIsLoading(false);
  };

  return (
    <div className="pt-24">
      <ol
        className="max-w-4xl mx-auto w-[90%] flex flex-col max-h-[70dvh] overflow-y-auto pr-3 gap-8"
        ref={messagesRef}>
        {messages.map(({ id, content, img, role }) => (
          <Message key={id} content={content} img={img} role={role} />
        ))}
      </ol>
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
