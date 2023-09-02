import {t, Elysia} from 'elysia'
import {auth} from '../plugins/auth'

export default (app: Elysia) => app
    .use(auth)
    .post('/sign-in', async ({auth}) => {
        return "got it"
    })