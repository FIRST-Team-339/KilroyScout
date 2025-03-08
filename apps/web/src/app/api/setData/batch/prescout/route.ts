import { getEventData, updateEventData } from "@/app/actions";
import { teamPrescoutingDataSchema } from "@/lib/eventDataSchemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
	const body = await request.json();

	if (!body) {
		return NextResponse.json({ message: "No request body" }, { status: 400 });
	}

	const eventData = await getEventData();

	if (!eventData)
		return NextResponse.json(
			{ message: "No event data found. Please initialize an event first" },
			{ status: 500 },
		);

	const parsedBody = z
		.array(
			z.object({
				teamNumber: z.number().int().nonnegative(),
				scouting: teamPrescoutingDataSchema,
			}),
		)
		.safeParse(body);

	if (!parsedBody.success) {
		console.log(parsedBody.error);
		return NextResponse.json({ message: parsedBody.error }, { status: 400 });
	}

	await updateEventData({
		...eventData,
		teams: eventData.teams.map((team) => {
			const updatedTeam = parsedBody.data.find(
				(teamData) => teamData.teamNumber === team.teamNumber,
			);
			if (updatedTeam)
				return {
					...team,
					scouting: updatedTeam.scouting,
				};

			return team;
		}),
	});

	return NextResponse.json({ message: "OK" }, { status: 200 });
}
