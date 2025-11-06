import { abilityBuilder } from "$api/rumble";
import { isDMUNEmail } from "$api/services/isDMUNEmail";
import { basics } from "./basics";

const { arg, ref, pubsub, table } = basics("representation");

abilityBuilder.representation
	.allow(["read", "update"])
	.when(({ mustBeLoggedIn }) => {
		const user = mustBeLoggedIn();
		if (user?.email && isDMUNEmail(user.email)) {
			return "allow";
		}
	});
