"use server";

import { EventData, MatchScoutingData } from "@/hooks/useEventData";
import { frc } from "@/lib/frc";

const defaultMatchScoutingData: MatchScoutingData = {
  auto: {
    passedStartLine: false,
    speakerNotesScored: 0,
    ampNotesScored: 0,
  },
  teleop: {
    speakerNotesScored: 0,
    amplifiedSpeakerNotesScored: 0,
    ampNotesScored: 0,
    parked: false,
    climbed: false,
    spotlit: false,
    harmonizing: false,
    scoredTrap: false,
    defense: 0,
  },
  brokeDown: false,
  comments: "",
};

export async function initEvent(
  prevState: any,
  formData: FormData
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
        dateStart: eventInfo.dateStart,
        dateEnd: eventInfo.dateEnd,
      },
      teams: teamListings.data.teams.map((team) => {
        return {
          teamNumber: team.teamNumber,
          name: team.nameShort,
          location: `${team.city}, ${team.stateProv}, ${team.country}`,
          rookieYear: team.rookieYear,
          robotName: team.robotName,
          scouting: {
            drivetrain: "" as "other",
            programmingLanguage: "" as "java",
            canScoreSpeaker: false,
            canScoreAmp: false,
            estimatedTeleopNoteCycle: 0,
            canScoreSpeakerAuto: false,
            speakerAutoNotes: 0,
            canScoreAmpAuto: false,
            canPassStartLineAuto: false,
            canClimb: false,
            canTrap: false,
            comments: "",
          },
        };
      }),
      matches: matches.data.Schedule.map((match) => {
        return {
          matchNumber: match.matchNumber,
          startTime: match.startTime,
          rankMatchData: false,
          alliances: {
            red: {
              teams: [
                match.teams[0].teamNumber,
                match.teams[1].teamNumber,
                match.teams[2].teamNumber,
              ],
              didCoopertition: false,
              melody: false,
              ensemble: false,
            },
            blue: {
              teams: [
                match.teams[3].teamNumber,
                match.teams[4].teamNumber,
                match.teams[5].teamNumber,
              ],
              didCoopertition: false,
              melody: false,
              ensemble: false,
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
