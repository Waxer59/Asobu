import { Card } from '@/components/shadcn/card';
import dynamic from 'next/dynamic';
const ExcalidrawWithClientOnly = dynamic(
  async () => (await import('@components/excalidraw-wrapper')).default,
  {
    ssr: false
  }
);

export const metadata = {
  title: 'Asobu | Teach Mode',
  description: 'Teach Mode for Asobu'
};

export default function Page() {
  return (
    <div className="flex justify-center items-center pt-6">
      <Card className="max-w-[1500px] w-[90%] h-[85dvh] p-3">
        <ExcalidrawWithClientOnly />
      </Card>
    </div>
  );
}
