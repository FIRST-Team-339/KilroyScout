import { getEventData, updateEventData } from "@/app/actions";
import { matchScoutingDataSchema } from "@/lib/eventDataSchemas";
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
			{ message: "No event data found. Please initialize an event first." },
			{ status: 500 },
		);

	const parsedBody = z
		.array(
			z.object({
				matchNumber: z.number().int().nonnegative(),
				teamNumber: z.number().int().nonnegative(),
				scouting: matchScoutingDataSchema,
			}),
		)
		.safeParse(body);
	if (!parsedBody.success) {
		console.log(parsedBody.error);
		return NextResponse.json({ message: parsedBody.error }, { status: 400 });
	}

	await updateEventData({
		...eventData,
		matches: eventData.matches.map((match) => {
			const updatedMatchData = parsedBody.data.filter(
				(matchData) => matchData.matchNumber === match.matchNumber,
			);

			if (updatedMatchData.length > 0) {
				return {
					...match,
					scouting: {
						blue: match.scouting.blue.map((existingData, index) => {
							const teamNumber = match.blueAllianceTeams[index];

							const updatedTeamData = updatedMatchData.find(
								(matchData) => matchData.teamNumber === teamNumber,
							);

							if (updatedTeamData) return updatedTeamData.scouting;

							return existingData;
						}) as typeof match.scouting.blue,
						red: match.scouting.red.map((existingData, index) => {
							const teamNumber = match.redAllianceTeams[index];

							const updatedTeamData = updatedMatchData.find(
								(matchData) => matchData.teamNumber === teamNumber,
							);
							if (updatedTeamData) return updatedTeamData.scouting;

							return existingData;
						}) as typeof match.scouting.red,
					},
				};
			}

			return match;
		}),
	});

	return NextResponse.json({ message: "OK" }, { status: 200 });
}
