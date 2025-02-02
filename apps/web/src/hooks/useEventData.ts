import { z } from "zod";
import { useLocalStorage } from "./useLocalStorage";

export const teamDataSchema = z.object({
  teamNumber: z.number().int().nonnegative(),
  name: z.string(),
  location: z.string(),
  rookieYear: z
    .number()
    .int()
    .nonnegative()
    .gte(1989, "Must be a year greater than or equal to 1989"),
  robotName: z.string(),
  scouting: z.object({
    drivetrain: z.enum(["swerve", "mecanum", "tank", "other", ""]),
    programmingLanguage: z.enum(["java", "kotlin", "cpp", "python", ""]),
    canScoreCoral: z.boolean(),
    canScoreAlgae: z.boolean(),
    averageCoralCycled: z.number().int().nonnegative(),
    mostCoralCycled: z.number().int().nonnegative(),
    maxCoralScoredInAuto: z.number().int().nonnegative(),
    canLeaveInAuto: z.boolean(),
    canScoreCoralInAuto: z.boolean(),
    canScoreAlgaeInAuto: z.boolean(),
    canShallowCageClimb: z.boolean(),
    canDeepCageClimb: z.boolean(),
    comments: z.string(),
  }),
});
export type TeamData = z.TypeOf<typeof teamDataSchema>;

export const matchAlliancesDataSchema = z.object({
  teams: z.tuple([z.number(), z.number(), z.number()]),
  didCoopertition: z.boolean(),
  autoRP: z.boolean(),
  coralRP: z.boolean(),
  bargeRP: z.boolean(),
});
export type MatchAlliancesData = z.TypeOf<typeof matchAlliancesDataSchema>;

export const matchScoutingDataSchema = z.object({
  auto: z.object({
    leave: z.boolean(),
    coralL1: z.number().int().nonnegative(),
    coralL2: z.number().int().nonnegative(),
    coralL3: z.number().int().nonnegative(),
    coralL4: z.number().int().nonnegative(),
    algaeProcessor: z.number().int().nonnegative(),
    allianceGotAutoRP: z.boolean(),
  }),
  teleop: z.object({
    coralL1: z.number().int().nonnegative(),
    coralL2: z.number().int().nonnegative(),
    coralL3: z.number().int().nonnegative(),
    coralL4: z.number().int().nonnegative(),
    algaeProcessor: z.number().int().nonnegative(),
    algaeNet: z.number().int().nonnegative(),
    parked: z.boolean(),
    shallowCageClimbed: z.boolean(),
    deepCageClimbed: z.boolean(),
    allianceGotCoralRP: z.boolean(),
    allianceGotBargeRP: z.boolean(),
    defense: z.number().int().gte(0).lte(5),
  }),
  brokeDown: z.boolean(),
  comments: z.string(),
});
export type MatchScoutingData = z.TypeOf<typeof matchScoutingDataSchema>;

export const matchDataSchema = z.object({
  matchNumber: z.number(),
  startTime: z.string(),
  rankMatchData: z.boolean(),
  alliances: z.object({
    blue: matchAlliancesDataSchema,
    red: matchAlliancesDataSchema,
  }),
  scouting: z.object({
    blue: z.tuple([
      matchScoutingDataSchema,
      matchScoutingDataSchema,
      matchScoutingDataSchema,
    ]),
    red: z.tuple([
      matchScoutingDataSchema,
      matchScoutingDataSchema,
      matchScoutingDataSchema,
    ]),
  }),
});
export type MatchData = z.TypeOf<typeof matchDataSchema>;

export const eventSchema = z.object({
  eventCode: z.string().min(3),
  weekNumber: z.number().int(),
  name: z.string(),
  venue: z.string(),
  location: z.string(),
  dateStart: z.string(),
  dateEnd: z.string(),
});
export type Event = z.TypeOf<typeof eventSchema>;

export const eventDataSchema = z.object({
  event: eventSchema,
  teams: teamDataSchema.array(),
  matches: matchDataSchema.array(),
});
export type EventData = z.TypeOf<typeof eventDataSchema>;

export const useEventData = (): [
  EventData | null,
  (value: EventData | null) => void
] => {
  const [eventData, setEventData] = useLocalStorage<EventData | null>(
    "eventData",
    null
  );

  return [eventData, setEventData];
};
