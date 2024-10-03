import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "@/lib/mongoose"
import User from "@/models/User"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }
  
          try {
            await connectDB()
            
            const user = await User.findOne({ email: credentials.email })
            
            if (!user) {
              return null
            }
  
            const isValid = await bcrypt.compare(
              credentials.password, 
              user.password
            )
            
            if (!isValid) {
              return null
            }
  
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name || '',
              role: user.role || 'user'
            }
          } catch (error) {
            console.error("Auth error:", error)
            return null
          }
        }
      })
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role || 'user'
          token.id = user.id
        }
        return token
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.role = token.role as string
          session.user.id = token.id as string
        }
        return session
      }
    },
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: '/auth/signin',
    },
}