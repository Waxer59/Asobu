'use client';

import { ApiKeyDialog } from '@/components/api-key-dialog';
import { DockBar } from '@/components/dockBar';
import { Tools } from '@/components/tools';
import { Card } from '@shadcn/index';
import dynamic from 'next/dynamic';
import Head from 'next/head';
const ExcalidrawWithClientOnly = dynamic(
  async () => (await import('@components/excalidraw-wrapper')).default,
  {
    ssr: false
  }
);

export default function Page() {
  return (
    <>
      <Head>
        <title>Asobu | Teach Mode</title>
      </Head>
      <div className="flex justify-center items-center pt-6">
        <Card className="max-w-[1500px] w-[90%] h-[800px] p-3">
          <ExcalidrawWithClientOnly />
        </Card>
      </div>
      <DockBar />
      <ApiKeyDialog />
      <Tools />
    </>
  );
}
