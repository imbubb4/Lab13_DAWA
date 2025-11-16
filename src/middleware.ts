import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Debe coincidir con lo que pusimos en authOptions
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: ["/dashboard", "/profile"],
};
