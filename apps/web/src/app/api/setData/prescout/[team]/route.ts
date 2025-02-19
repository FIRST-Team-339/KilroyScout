import { getEventData, updateEventData } from "@/app/actions";
import { teamPrescoutingDataSchema } from "@/lib/eventDataSchemas";
import { NextResponse } from "next/server";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ team: string }> },
) {
	const teamNumber = (await params).team;
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

	const parsedBody = teamPrescoutingDataSchema.safeParse(body);
	if (!parsedBody.success)
		return NextResponse.json({ message: parsedBody.error }, { status: 400 });

	await updateEventData({
		...eventData,
		teams: eventData.teams.map((team) => {
			if (team.teamNumber === Number.parseInt(teamNumber))
				return {
					...team,
					scouting: parsedBody.data,
				};

			return team;
		}),
	});

	return NextResponse.json({ message: "OK" }, { status: 200 });
}
