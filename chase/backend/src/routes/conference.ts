import {t, Elysia} from 'elysia'
import {auth} from '../plugins/auth'
import {db} from "../../prisma/db";

export default (app: Elysia) => app
    .use(auth)
    .group("conference", app => app.get('/list', async () => {
        return db.conference.findMany();
    }).post("create", async ({body, auth}) => {
        // run this in a transaction, so if setting the permission fails, the conference is not created
        return db.$transaction(async tx => {
            const newConference = await tx.conference.create({
                data: {
                    name: body.name,
                }
            });

            await auth?.permissions.setConferenceAdmin(newConference.id);

            return newConference;
        });

    }, {
        body: t.Object({
            name: t.String({minLength: 3}),
        })
    }));