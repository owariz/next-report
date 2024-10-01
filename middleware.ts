import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === "user" || token?.role === "admin",
  },
})

export const config = {
  matcher: [
    "/((?!auth/signin|auth/signup|home|api).*)", // ยกเว้น /auth/signin, /auth/signup และ /home
  ],
}