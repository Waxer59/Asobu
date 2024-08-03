import NextAuth from 'next-auth/next';
import { type NextAuthOptions } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

const options: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      authorization:
        'https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private,playlist-read-private,playlist-modify-private,playlist-modify-public,streaming,user-read-playback-state,user-modify-playback-state',
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || ''
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        token
      };
    }
  }
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
