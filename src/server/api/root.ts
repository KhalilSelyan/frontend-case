import { createTRPCRouter } from "@/server/api/trpc";
import { ricknmortyRouter } from "./routers/ricknmorty";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // Rick and Morty API
  ricknmorty: ricknmortyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
