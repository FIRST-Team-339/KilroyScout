import { getEventData, updateEventData } from "@/app/actions";
import { matchScoutingDataSchema } from "@/lib/eventDataSchemas";
import { NextResponse } from "next/server";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ match: string; team: string }> },
) {
	const { match: matchNumber, team: teamNumber } = await params;
	const body = await request.json();

	if (!body) {
		return NextResponse.json({ message: "No request body" }, { status: 400 });
	}

	const eventData = await getEventData();

	if (!eventData) {
		return NextResponse.json(
			{ message: "No event data found. Please initialize an event first" },
			{ status: 500 },
		);
	}

	const parsedBody = matchScoutingDataSchema.safeParse(body);
	if (!parsedBody.success)
		return NextResponse.json({ message: parsedBody.error }, { status: 400 });

	await updateEventData({
		...eventData,
		matches: eventData.matches.map((match) => {
			if (match.matchNumber === Number.parseInt(matchNumber)) {
				const blue = match.blueAllianceTeams.includes(
					Number.parseInt(teamNumber),
				);

				const teamIndex = blue
					? match.blueAllianceTeams.indexOf(Number.parseInt(teamNumber))
					: match.redAllianceTeams.indexOf(Number.parseInt(teamNumber));

				if (teamIndex === -1) throw new Error("Team not found in alliance");

				return {
					...match,
					scouting: {
						blue: match.scouting.blue.map((existingData, index) => {
							if (blue && index === teamIndex) return parsedBody.data;

							return existingData;
						}) as typeof match.scouting.blue,
						red: match.scouting.red.map((existingData, index) => {
							if (!blue && index === teamIndex) return parsedBody.data;

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
