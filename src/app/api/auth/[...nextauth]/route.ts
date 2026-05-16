import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const ALLOWED_EMAILS = process.env.ALLOWED_ADMIN_EMAILS
  ? process.env.ALLOWED_ADMIN_EMAILS.split(',')
    : [];

export const authOptions: NextAuthOptions = {
    providers: [
          GoogleProvider({
                  clientId: process.env.GOOGLE_CLIENT_ID!,
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ],
    callbacks: {
          async signIn({ user }) {
                  if (ALLOWED_EMAILS.length === 0) return true;
                  return ALLOWED_EMAILS.includes(user.email ?? '');
          },
          async session({ session, token }) {
                  return session;
          },
    },
    pages: {
          signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
