import { Button } from '@components/shadcn/button';
import { Github } from 'lucide-react';
import { Section, Container } from '@components/craft';
import Link from 'next/link';

export function Footer() {
  return (
    <footer>
      <Section>
        <Container className="not-prose flex flex-col justify-between gap-6 border-t border-slate-700 md:flex-row md:items-center md:gap-2 max-w-full">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-slate-700">
              <Link href="https://github.com/Waxer59/Asobu">
                <Github />
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground">
            Built with Next.js and Vercel's AI SDK
          </p>
        </Container>
      </Section>
    </footer>
  );
}
