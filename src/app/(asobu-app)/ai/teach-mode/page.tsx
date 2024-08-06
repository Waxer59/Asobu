import { Metadata } from 'next';
import { TeachMode } from '@components/teach-mode';

export const metadata: Metadata = {
  title: 'Asobu | Teach Mode',
  description: 'Teach Mode for Asobu'
};

export default function Page() {
  return <TeachMode />;
}
