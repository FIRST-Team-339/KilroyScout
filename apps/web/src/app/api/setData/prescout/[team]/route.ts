import { getEventData, updateEventData } from "@/app/actions";
import { teamDataSchema } from "@/lib/eventDataSchemas";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ team: string }> },
) {
	const teamNumber = (await params).team;
	const body = await request.json();

	if (!body) {
		return Response.json({ error: "No request body" }, { status: 400 });
	}

	const eventData = await getEventData();

	if (!eventData) {
		return Response.json(
			{ error: "No event data found. Please initialize an event first" },
			{ status: 500 },
		);
	}

	const parsedBody = teamDataSchema.safeParse(body);
	if (!parsedBody.success)
		return Response.json({ error: parsedBody.error }, { status: 400 });

	updateEventData({
		...eventData,
		teams: eventData.teams.map((team) => {
			if (team.teamNumber === Number.parseInt(teamNumber))
				return {
					...team,
					scouting: parsedBody.data.scouting,
				};

			return team;
		}),
	});

	return new Response("OK", { status: 200 });
}
