import { MessageRoles } from '@/types/types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus as dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  role: MessageRoles;
  content: string;
  img?: string;
}

export const Message: React.FC<Props> = ({ content, img, role }) => {
  return (
    <li
      className={`flex flex-col gap-2 ${role === MessageRoles.USER ? 'items-end' : ''}`}>
      {img && <img src={img} className="w-96 rounded-md shadow-md max-w-96" />}
      <div
        className={`flex gap-4 items-center rounded w-1/2 p-3 relative shadow-zinc-700/20 shadow-xl ${role === MessageRoles.USER ? 'bg-zinc-800' : 'bg-zinc-900'}`}>
        <Markdown
          className="markdown prose"
          remarkPlugins={[remarkGfm]}
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  PreTag="div"
                  className="rounded-lg w-full overflow-auto"
                  // eslint-disable-next-line
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  style={dark}
                  wrapLines={true}
                  wrapLongLines={true}
                />
              ) : (
                <code {...rest} className={className}>
                  {content}
                </code>
              );
            }
          }}>
          {content}
        </Markdown>
      </div>
    </li>
  );
};
