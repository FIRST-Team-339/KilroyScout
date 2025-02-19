import { getEventData } from "@/app/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const result = await getEventData();
		if (result == null) throw new Error("No Data");

		return NextResponse.json(result);
	} catch (err) {
		return NextResponse.json(
			{ error: "No Data" },
			{
				status: 500,
			},
		);
	}
}
