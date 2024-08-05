import { Button } from './shadcn/button';
import { Bot } from 'lucide-react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background py-6">
      <div className="flex justify-between px-10">
        <div className="flex items-center justify-center gap-x-4">
          <Bot />
          Asobu
        </div>
        <Button
          className="relative text-center cursor-pointer flex justify-center items-center rounded-lg text-white dark:text-green-900 bg-green-500 dark:bg-green-500 px-4 py-2"
          asChild>
          <Link href="/ai">
            <div className="relative z-10 font-bold">Go to the app</div>
            <div className="absolute top-1/2 left-1/2 size-full rounded-lg bg-inherit animate-pulse -translate-x-1/2 -translate-y-1/2" />
          </Link>
        </Button>
      </div>
    </header>
  );
};
