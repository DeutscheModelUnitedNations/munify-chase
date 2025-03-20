// import { yogaInstance } from '$api/http';
import { schemaBuilder } from '$api/rumble';
import { makeHooks } from 'graphql-ws/use/crossws';

// export { yogaInstance as GET, yogaInstance as POST };
// /mnt/codingssd/Coding/graphql-ws/dist
// yogaInstance.

//TODO https://github.com/sveltejs/kit/pull/12973
export const socket = makeHooks({
	schema: schemaBuilder.toSchema(),
})