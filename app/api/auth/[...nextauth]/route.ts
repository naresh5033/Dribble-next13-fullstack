import NextAuth from "next-auth";

import { authOptions } from "@/lib/session";

const handler = NextAuth(authOptions);

// allow us to make get and post requests using the next auth
export { handler as GET, handler as POST };
