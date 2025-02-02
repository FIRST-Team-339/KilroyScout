import {
	EventData,
	MatchScoutingData,
	matchScoutingDataSchema,
} from "@/hooks/useEventData";

/**
 * @see https://firstfrc.blob.core.windows.net/frc2025/Manual/2025GameManual.pdf#page=49
 *
 * MODIFIED POINT VALUES - NOT ENTIRELY THE SAME
 */
export const pointValues = {
	auto: {
		leave: 1,
		coralL1: 3,
		coralL2: 4,
		coralL3: 5,
		coralL4: 7,
		algaeProcessor: 4,
		allianceGotAutoRP: 10,
	  },
	  teleop: {
		coralL1: 1,
		coralL2: 2,
		coralL3: 3,
		coralL4: 5,
		algaeProcessor: 2,
		algaeNet: 4,
		parked: 1,
		shallowCageClimbed: 3,
		deepCageClimbed: 5,
		allianceGotCoralRP: 10,
		allianceGotBargeRP: 10,
	  },
} as const;

export function calculatePoints(matchScoutingData: MatchScoutingData) {
	let points = 0;

	// Auto
	points += +matchScoutingData.auto.leave * pointValues.auto.leave;
	points += matchScoutingData.auto.coralL1 * pointValues.auto.coralL1;
	points += matchScoutingData.auto.coralL2 * pointValues.auto.coralL2;
	points += matchScoutingData.auto.coralL3 * pointValues.auto.coralL3;
	points += matchScoutingData.auto.coralL4 * pointValues.auto.coralL4;
	points += matchScoutingData.auto.algaeProcessor * pointValues.auto.algaeProcessor;
	points += +matchScoutingData.auto.allianceGotAutoRP * pointValues.auto.allianceGotAutoRP;

	// Teleop
	points += matchScoutingData.teleop.coralL1 * pointValues.teleop.coralL1;
	points += matchScoutingData.teleop.coralL2 * pointValues.teleop.coralL2;
	points += matchScoutingData.teleop.coralL3 * pointValues.teleop.coralL3;
	points += matchScoutingData.teleop.coralL4 * pointValues.teleop.coralL4;
	points += matchScoutingData.teleop.algaeProcessor * pointValues.teleop.algaeProcessor;
	points += matchScoutingData.teleop.algaeNet * pointValues.teleop.algaeNet;
	points += +matchScoutingData.teleop.allianceGotCoralRP * pointValues.teleop.allianceGotCoralRP;
	points += +matchScoutingData.teleop.allianceGotBargeRP * pointValues.teleop.allianceGotBargeRP;
	
	// Endgame
	points += +matchScoutingData.teleop.parked * pointValues.teleop.parked;
	points += +matchScoutingData.teleop.shallowCageClimbed * pointValues.teleop.shallowCageClimbed;
	points += +matchScoutingData.teleop.deepCageClimbed * pointValues.teleop.deepCageClimbed;

	return points;
}

export function calculateAverage(
	matchesScoutingData: Array<MatchScoutingData>,
) {
	let points = 0;
	let matches = 0;

	matchesScoutingData.forEach((matchScoutingData) => {
		points += calculatePoints(matchScoutingData);
		matches++;
	});

	return points / matches;
}

export function calculateRanks(matches: EventData["matches"]): Array<number> {
	const teamMatchesMap = new Map<
		number,
		{ totalPoints: number; matches: number }
	>();

	matches.forEach((match) => {
		match.scouting.blue.forEach((blueScoutingData, index) => {
			const teamNumber = match.alliances.blue.teams[index];
			const points = calculatePoints(blueScoutingData);

			const current = teamMatchesMap.get(teamNumber);
			if (current) {
				teamMatchesMap.set(teamNumber, {
					totalPoints: current.totalPoints + points,
					matches: current.matches + 1,
				});
			} else {
				teamMatchesMap.set(teamNumber, { totalPoints: points, matches: 1 });
			}
		});
	});

	return Array.from(teamMatchesMap)
		.sort(
			(team1, team2) =>
				team1[1].totalPoints / team1[1].matches -
				team2[1].totalPoints / team2[1].matches,
		)
		.map((team) => team[0]);
}
