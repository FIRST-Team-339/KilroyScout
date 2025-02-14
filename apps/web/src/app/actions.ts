"use server";

import type { EventData, MatchScoutingData } from "@/lib/eventDataSchemas";
import { frc } from "@/lib/frc";
import fs from "node:fs/promises";
import path from "node:path";

const filePath = path.join(process.cwd(), "eventData.json");

// Function to read the current event data
export async function getEventData(): Promise<EventData | null> {
	try {
		const data = await fs.readFile(filePath, "utf-8");
		return JSON.parse(data);
	} catch {
		return null; // Return null if the file doesn't exist
	}
}

// Function to update the event data
export async function updateEventData(newData: EventData) {
	await fs.writeFile(filePath, JSON.stringify(newData, null, 2), "utf-8");
	return newData;
}

const defaultMatchScoutingData: MatchScoutingData = {
	auto: {
		leave: false,
		coralL1: 0,
		coralL2: 0,
		coralL3: 0,
		coralL4: 0,
		algaeProcessor: 0,
		allianceGotAutoRP: false,
	},
	teleop: {
		coralL1: 0,
		coralL2: 0,
		coralL3: 0,
		coralL4: 0,
		algaeProcessor: 0,
		algaeNet: 0,
		parked: false,
		shallowCageClimbed: false,
		deepCageClimbed: false,
		allianceGotCoralRP: false,
		allianceGotBargeRP: false,
		drivingSkill: 0,
	},
	brokeDown: false,
	comments: "",
};

export async function initEvent(
	_: EventData | null, // unused previous state
	formData: FormData,
): Promise<EventData | null> {
	try {
		const eventCode = formData.get("eventCode")!.toString();

		const _eventInfo = await frc.season.getEventListings(eventCode);
		if (_eventInfo.statusCode !== 200) return null;
		const eventInfo = _eventInfo.data.Events[0];

		const teamListings = await frc.season.getTeamListings(undefined, eventCode);
		if (teamListings.statusCode !== 200) return null;

		const matches = await frc.schedule.getEventSchedule(eventCode, "qual");
		if (matches.statusCode !== 200) return null;

		return {
			event: {
				eventCode: eventCode,
				weekNumber: eventInfo.weekNumber,
				name: eventInfo.name,
				venue: eventInfo.venue,
				location: `${eventInfo.city}, ${eventInfo.stateprov}, ${eventInfo.country}`,
				dateStart: eventInfo.dateStart.toString(),
				dateEnd: eventInfo.dateEnd.toString(),
			},
			teams: teamListings.data.teams.map((team) => {
				return {
					teamNumber: team.teamNumber,
					name: team.nameShort,
					location: `${team.city}, ${team.stateProv}, ${team.country}`,
					rookieYear: team.rookieYear,
					robotName: team.robotName,
					scouting: {
						drivetrain: "",
						programmingLanguage: "",
						canScoreCoral: false,
						canScoreAlgae: false,
						averageCoralCycled: 0,
						mostCoralCycled: 0,
						maxCoralScoredInAuto: 0,
						canLeaveInAuto: false,
						canScoreCoralInAuto: false,
						canScoreAlgaeInAuto: false,
						canShallowCageClimb: false,
						canDeepCageClimb: false,
						comments: "",
					},
				};
			}),
			matches: matches.data.Schedule.map((match) => {
				return {
					matchNumber: match.matchNumber,
					startTime: match.startTime.toString(),
					rankMatchData: false,
					alliances: {
						red: {
							teams: [
								match.teams[0].teamNumber,
								match.teams[1].teamNumber,
								match.teams[2].teamNumber,
							],
							didCoopertition: false,
							autoRP: false,
							coralRP: false,
							bargeRP: false,
						},
						blue: {
							teams: [
								match.teams[3].teamNumber,
								match.teams[4].teamNumber,
								match.teams[5].teamNumber,
							],
							didCoopertition: false,
							autoRP: false,
							coralRP: false,
							bargeRP: false,
						},
					},
					scouting: {
						blue: [
							defaultMatchScoutingData,
							defaultMatchScoutingData,
							defaultMatchScoutingData,
						],
						red: [
							defaultMatchScoutingData,
							defaultMatchScoutingData,
							defaultMatchScoutingData,
						],
					},
				};
			}),
		};
	} catch (error) {
		console.log(error);
		return null;
	}
}
