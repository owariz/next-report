import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name?: string
    role?: string
  }

  interface Student {
    id: string
    std_id: string
    prefix: string
    name: string
    surname: string
    nickname: string
    grade: string
    classroom: string
    score: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
  }
}