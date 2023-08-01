import conference from './routes/conference';
import {Elysia} from 'elysia'

const app = new Elysia()
  .use(conference)
  .listen(process.env.PORT ?? "3001");

export type App = typeof app