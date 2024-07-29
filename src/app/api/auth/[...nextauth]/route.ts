import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify";

export const OPTIONS = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.sub
      return session
    }
  }
}

const handler = NextAuth({
  ...OPTIONS
})

export { handler as GET, handler as POST }