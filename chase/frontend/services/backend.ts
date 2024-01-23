import { edenTreaty } from "@elysiajs/eden";
import { App } from "../../backend/src/main";

//@ts-ignore
export const backend = edenTreaty<App>("http://localhost:3001"); //TODO replace with real value