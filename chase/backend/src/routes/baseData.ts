import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";

export default new Elysia()
.get(
    "/baseData/countries",
    async () => {
        return db.countryBaseData.findMany({
            select: { alpha3Code: true }
        })
    }
)
.get(
    "/baseData/nonStateActors",
    async () => {
        return db.nonStateActorBaseData.findMany({
            select: { id: true }
        })
    }
)
.get(
    "/baseData/specialPersons",
    async () => {
        return db.specialPersonBaseData.findMany({
            select: { id: true }
        })
    }
)