import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getCharacters } from "rickmortyapi";
import { z } from "zod";

export const ricknmortyRouter = createTRPCRouter({
  getCharacters: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { name } = input;
      const res = await getCharacters({
        name: name ?? "",
      });

      return res.data;
    }),
});
