import conference from './routes/conference';
import {Elysia} from 'elysia'
import {swagger} from '@elysiajs/swagger'
import {cors} from '@elysiajs/cors'

const app = new Elysia()
  .use(swagger({
    path: "/documentation"
  }))
  .use(cors({origin: process.env.ORIGIN ?? "http://localhost:3000"}))
  .use(conference)
  .listen(process.env.PORT ?? "3001");

export type App = typeof app