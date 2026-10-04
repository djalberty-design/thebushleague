import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyze-DpuimXjH.js
var analyzeDecision_createServerFn_handler = createServerRpc({
	id: "2c4a5daae470e9f69d839ff1fc1842a475dc8d0ae656e44f0de8a56d10cc87df",
	name: "analyzeDecision",
	filename: "src/lib/server/analyze.ts"
}, (opts) => analyzeDecision.__executeServer(opts));
var analyzeDecision = createServerFn({ method: "POST" }).validator((input) => input).handler(analyzeDecision_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "OS Brief is unavailable in this environment."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 320,
			messages: [{
				role: "system",
				content: `You are Bush League OS, the desk for ESPN league 1014874 (The Bush League). 10 teams, H2H points, OP (soft superflex), K start 0, inverse-standings waivers (NOT FAAB), 2 keepers one extra year only, colliding keeper rounds burn the next unused round. Scoring pays targets (0.2), first downs, rush attempts, completions; taxes incompletions, sacks, INTs. Never recommend kickers. Never use FAAB. Never add multi-year residual. Be decisive. No emojis. 120-180 words: verdict line, 3 bullets, one flip condition. Use supplied numbers as ground truth.`
			}, {
				role: "user",
				content: `Kind: ${data.kind}\n\n${data.prompt}`
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Desk error ${res.status}`
	};
	return {
		ok: true,
		text: (await res.json()).choices[0]?.message.content ?? ""
	};
});
//#endregion
export { analyzeDecision_createServerFn_handler };
