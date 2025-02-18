import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type CommentGetOneOutput =
	inferRouterOutputs<AppRouter>["comments"]["create"];
