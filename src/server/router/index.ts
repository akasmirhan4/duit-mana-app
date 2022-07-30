// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { transactionRouter } from "./transaction";

export const appRouter = createRouter().transformer(superjson).merge("auth.", authRouter).merge("transaction.", transactionRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
