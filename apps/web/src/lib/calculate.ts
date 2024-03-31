import {
  EventData,
  MatchScoutingData,
  matchScoutingDataSchema,
} from "@/hooks/useEventData";

/**
 * @see https://firstfrc.blob.core.windows.net/frc2024/Manual/2024GameManual.pdf p. 48
 *
 * MODIFIED POINT VALUES - NOT ENTIRELY THE SAME
 */
export const pointValues = {
  auto: {
    passStartLine: 2,
    ampNote: 4,
    speakerNote: 5,
  },
  teleop: {
    ampNote: 2,
    speakerNote: 2,
    amplifiedSpeakerNote: 5,
    park: 1,
    onStage: 3,
    alsoSpotlit: 1,
    harmony: 2,
    trapNote: 5,
  },
} as const;

export function calculatePoints(matchScoutingData: MatchScoutingData) {
  const autoPoints =
    (matchScoutingData.auto.passedStartLine
      ? pointValues.auto.passStartLine
      : 0) +
    matchScoutingData.auto.speakerNotesScored * pointValues.auto.speakerNote;
  matchScoutingData.auto.ampNotesScored * pointValues.auto.ampNote;

  const teleopPoints =
    matchScoutingData.teleop.speakerNotesScored *
      pointValues.teleop.speakerNote +
    matchScoutingData.teleop.amplifiedSpeakerNotesScored *
      pointValues.teleop.amplifiedSpeakerNote +
    matchScoutingData.teleop.ampNotesScored * pointValues.teleop.ampNote;

  const endGamePoints =
    (matchScoutingData.teleop.parked && !matchScoutingData.teleop.climbed
      ? pointValues.teleop.park
      : 0) +
    (matchScoutingData.teleop.climbed ? pointValues.teleop.onStage : 0) +
    (matchScoutingData.teleop.climbed && matchScoutingData.teleop.spotlit
      ? pointValues.teleop.alsoSpotlit
      : 0) +
    (matchScoutingData.teleop.harmonizing ? pointValues.teleop.harmony : 0) +
    (matchScoutingData.teleop.scoredTrap ? pointValues.teleop.trapNote : 0) +
    matchScoutingData.teleop.defense;

  return autoPoints + teleopPoints + endGamePoints;
}

export function calculateAverage(
  matchesScoutingData: Array<MatchScoutingData>
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
        team2[1].totalPoints / team2[1].matches
    )
    .map((team) => team[0]);
}
