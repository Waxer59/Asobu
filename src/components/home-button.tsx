'use client';

import { PATHNAMES } from '@constants';
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger
} from '@shadcn/tooltip';
import { Home } from 'lucide-react';
import { buttonVariants } from '@shadcn/button';
import Link from 'next/link';

export const HomeButton = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={PATHNAMES.INDEX}
            className={`${buttonVariants({ variant: 'ghost', size: 'icon' })} absolute top-6 left-6`}>
            <Home />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Go to home page</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
