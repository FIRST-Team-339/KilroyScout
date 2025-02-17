import FRC from "first-events-api";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			FRC_EVENTS_USER: string;
			FRC_EVENTS_AUTH: string;
			FRC_SEASON: number;
		}
	}
}

export const frc = FRC({
	username: process.env.FRC_EVENTS_USER,
	auth: process.env.FRC_EVENTS_AUTH,
	season: process.env.FRC_SEASON,
});
