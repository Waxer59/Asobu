'use client';

import { Card } from '@shadcn/index';
import dynamic from 'next/dynamic';
const ExcalidrawWithClientOnly = dynamic(
  async () => (await import('@components/excalidraw-wrapper')).default,
  {
    ssr: false
  }
);

export default function Page() {
  return (
    <div className="flex justify-center items-center pt-6">
      <Card className="max-w-[1500px] w-[90%] h-[800px] p-3">
        <ExcalidrawWithClientOnly />
      </Card>
    </div>
  );
}
