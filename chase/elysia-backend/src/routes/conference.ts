import {t, Elysia} from 'elysia'

export default (app: Elysia) => app
    .post('/sign-in', () => "hello")