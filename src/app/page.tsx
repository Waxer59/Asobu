import { Card, CardContent, CardHeader } from '@/components/shadcn/card';
import Link from 'next/link';
import { cn } from '@lib/utils';
import { FEATURES } from '@/constants/constants';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/shadcn/button';

export default function Page() {
  return (
    <main className="w-full flex flex-col p-10 gap-y-10">
      {/* Hero */}
      <section className="relative flex h-hero w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-background md:shadow-xl">
        <div className="flex flex-col justify-center items-center gap-y-6">
          <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#22C55D] to-[#14532D] bg-clip-text text-center text-3xl md:text-7xl font-bold leading-none tracking-tighter text-transparent">
            Asobu powered by AI
          </span>
          <p className="w-10/12 md:w-1/2">
            An app that showcases the versatility of AI by combining music,
            navigation, translation, education, note-taking, chat, image
            recognition, and voice commands into a single platform.
          </p>
          <Button asChild>
            <Link href="/ai">Get Started</Link>
          </Button>
        </div>
        {/* Grid */}
        <div className="pointer-events-none absolute h-full w-full overflow-hidden opacity-50 [perspective:200px]">
          <div className="absolute inset-0 [transform:rotateX(35deg)]">
            <div
              className={cn(
                'animate-grid',

                '[background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]',

                // Light Styles
                '[background-image:linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_0)]',

                // Dark styles
                'dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)]'
              )}
            />
          </div>

          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-100% dark:from-black" />
        </div>
      </section>
      {/* Features */}
      <section className="flex flex-col justify-center gap-y-10">
        <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#22C55D] to-[#14532D] bg-clip-text text-center text-3xl md:text-7xl font-bold leading-none tracking-tighter text-transparent">
          Features
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {FEATURES.map(({ header, content }) => (
            <Card className="border-slate-700">
              <div>
                <CardHeader className="font-bold text-green-500 flex flex-row gap-x-4">
                  <Sparkles />
                  {header}
                </CardHeader>
              </div>
              <CardContent>{content}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
