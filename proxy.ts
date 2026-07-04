import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for static assets and auth pages
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|monitoring).*)",
  ],
};
