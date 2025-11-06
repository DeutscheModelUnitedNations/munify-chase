<script lang="ts">
import { m } from "$lib/paraglide/messages";
</script>

<div class="absolute right-0 top-0">
	<svg width="5rem" height="5rem" viewBox="0 0 100 100">
		<title>Coming Soon Ribbon</title>
		<polygon fill="#3d7dd2" points="0,0 50,0 100,50 100,100" />
		<text
			x="70%"
			y="-15%"
			fill="white"
			text-anchor="middle"
			alignment-baseline="middle"
			font-size="13"
			font-weight="700"
			transform="rotate(45)"
			class="font-serif"
		>
			{m.comingSoon()}
		</text>
	</svg>
</div>
