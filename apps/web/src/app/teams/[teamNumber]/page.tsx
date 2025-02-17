"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { MatchScoutingData } from "@/lib/eventDataSchemas";
import {
	calculatePoints,
	calculateRanks,
	calculateScoutingPointsAverage,
} from "@/lib/calculate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEventData } from "@/app/context/EventDataContext";

export default function Team({
	params: { teamNumber },
}: { params: { teamNumber: string } }) {
	const { eventData } = useEventData();
	const teamData = eventData?.teams.find(
		(team) => team.teamNumber === Number.parseInt(teamNumber),
	);
	const teamMatches = eventData?.matches.filter(
		(match) =>
			match.blueAllianceTeams.includes(Number.parseInt(teamNumber)) ||
			match.redAllianceTeams.includes(Number.parseInt(teamNumber)),
	)!;
	const calculatedTeamMatches = eventData?.matches.filter(
		(match) =>
			(match.rankMatchData &&
				match.blueAllianceTeams.includes(Number.parseInt(teamNumber))) ||
			match.redAllianceTeams.includes(Number.parseInt(teamNumber)),
	);
	const matchesScoutingData = calculatedTeamMatches?.map((teamMatch) => {
		const blueIndex = teamMatch.blueAllianceTeams.findIndex(
			(team) => team === Number.parseInt(teamNumber),
		);
		const redIndex = teamMatch.redAllianceTeams.findIndex(
			(team) => team === Number.parseInt(teamNumber),
		);

		return blueIndex !== -1
			? teamMatch.scouting.blue[blueIndex]
			: teamMatch.scouting.red[redIndex];
	})!;
	const router = useRouter();

	function getAccuracy(
		matchesScoutingData: Array<MatchScoutingData>,
		teleop: true,
		key: keyof MatchScoutingData["teleop"],
	): number;
	function getAccuracy(
		matchesScoutingData: Array<MatchScoutingData>,
		teleop: false,
		key: keyof MatchScoutingData["auto"],
	): number;
	function getAccuracy(
		matchesScoutingData: Array<MatchScoutingData>,
		teleop: boolean,
		key: string,
	): number {
		let timesTrue = 0;
		let matches = 0;

		matchesScoutingData.forEach((matchScoutingData) => {
			if (teleop) {
				const teleopKey = key as keyof MatchScoutingData["teleop"];

				if (matchScoutingData.teleop[teleopKey]) timesTrue++;
			} else {
				const autoKey = key as keyof MatchScoutingData["auto"];

				if (matchScoutingData.auto[autoKey]) timesTrue++;
			}

			matches++;
		});

		return timesTrue / matches;
	}

	function getAverage(
		matchesScoutingData: Array<MatchScoutingData>,
		teleop: true,
		key: keyof MatchScoutingData["teleop"],
	): number;
	function getAverage(
		matchesScoutingData: Array<MatchScoutingData>,
		teleop: false,
		key: keyof MatchScoutingData["auto"],
	): number;
	function getAverage(
		matchesScoutingData: Array<MatchScoutingData>,
		other: "reliability",
	): number;
	function getAverage(
		matchesScoutingData: Array<MatchScoutingData>,
		teleop: boolean | "reliability",
		key?: string,
	): number {
		let amount = 0;
		let matches = 0;

		matchesScoutingData?.forEach((matchScoutingData) => {
			if (teleop === "reliability") {
				if (!matchScoutingData.brokeDown) amount++;
			} else if (teleop) {
				const teleopKey = key as keyof MatchScoutingData["teleop"];

				amount +=
					typeof matchScoutingData.teleop[teleopKey] === "number"
						? (matchScoutingData.teleop[teleopKey] as number)
						: 1;
			} else {
				const autoKey = key as keyof MatchScoutingData["auto"];

				amount +=
					typeof matchScoutingData.auto[autoKey] === "number"
						? (matchScoutingData.auto[autoKey] as number)
						: 1;
			}

			matches++;
		});

		return amount / matches;
	}

	const drivetrainOptions = [
		{
			label: "Swerve",
			value: "swerve",
		},
		{
			label: "Mecanum",
			value: "mecanum",
		},
		{
			label: "Tank",
			value: "tank",
		},
		{
			label: "Other",
			value: "other",
		},
	];

	const programmingLanguageOptions = [
		{
			label: "Java",
			value: "java",
		},
		{
			label: "Kotlin (Java based)",
			value: "kotlin",
		},
		{
			label: "C++",
			value: "cpp",
		},
		{
			label: "Python",
			value: "python",
		},
	];

	return (
		<>
			{(!eventData || !teamData) && (
				<span className="text-gray-950 dark:text-gray-50 text-2xl w-full text-center font-bold">
					No Event Data to Pull From or Invalid Team #
				</span>
			)}
			{eventData && teamData && (
				<div className="flex flex-col w-full">
					<section className="flex flex-col">
						<span className="text-2xl font-semibold text-gray-950 dark:text-gray-50">
							{teamData.teamNumber} &#x2022; {teamData.name}
						</span>
						<span className="text-lg text-gray-700 dark:text-gray-300">
							Robot Name:{" "}
							<span className="font-medium">
								{teamData.robotName !== "" ? teamData.robotName : "N/A"}
							</span>{" "}
							&#x2022; Rookie Year:{" "}
							<span className="font-medium">{teamData.rookieYear}</span>
						</span>
					</section>
					<section className="flex flex-col py-2">
						<Button
							type="button"
							onClick={() => router.push(`/teams/${teamNumber}/edit`)}
						>
							Edit Team Data
						</Button>
					</section>
					<section className="flex flex-col">
						<span className="text-xl font-semibold text-gray-950 dark:text-gray-50">
							Scouting Overview
						</span>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell>Rank</TableCell>
									<TableCell>
										<span className="font-medium">
											#
											{calculateRanks(eventData.matches).findIndex(
												(team) => team === Number.parseInt(teamNumber),
											) + 1}
										</span>{" "}
										of {eventData.teams.length}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Scouting Points Average</TableCell>
									<TableCell>
										{calculateScoutingPointsAverage(
											matchesScoutingData,
										).toFixed(3)}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Reliability</TableCell>
									<TableCell>
										{(
											getAverage(matchesScoutingData, "reliability") * 100
										).toFixed(2)}
										%
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Climb Accuracy</TableCell>
									<TableCell>
										{(
											(getAccuracy(
												matchesScoutingData,
												true,
												"shallowCageClimbed",
											) +
												getAccuracy(
													matchesScoutingData,
													true,
													"deepCageClimbed",
												)) *
											100
										).toFixed(2)}
										%
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<span className="font-medium">Auto</span> Coral Average
									</TableCell>
									<TableCell>
										{(
											(getAverage(matchesScoutingData, false, "coralL1") +
												getAverage(matchesScoutingData, false, "coralL2") +
												getAverage(matchesScoutingData, false, "coralL3") +
												getAverage(matchesScoutingData, false, "coralL4")) /
											matchesScoutingData.length
										).toFixed(2)}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<span className="font-medium">Auto</span> Algae Average
									</TableCell>
									<TableCell>
										{getAverage(
											matchesScoutingData,
											false,
											"algaeProcessor",
										).toFixed(2)}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<span className="font-medium">Teleop</span> Coral Notes
										Average
									</TableCell>
									<TableCell>
										{(
											(getAverage(matchesScoutingData, true, "coralL1") +
												getAverage(matchesScoutingData, true, "coralL2") +
												getAverage(matchesScoutingData, true, "coralL3") +
												getAverage(matchesScoutingData, true, "coralL4")) /
											matchesScoutingData.length
										).toFixed(2)}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<span className="font-medium">Teleop</span> Algae Average
										[Processor]
									</TableCell>
									<TableCell>
										{getAverage(
											matchesScoutingData,
											true,
											"algaeProcessor",
										).toFixed(2)}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<span className="font-medium">Teleop</span> Algae Average
										[Net]
									</TableCell>
									<TableCell>
										{getAverage(matchesScoutingData, true, "algaeNet").toFixed(
											2,
										)}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</section>
					<section className="flex flex-col">
						<span className="text-xl font-semibold text-gray-950 dark:text-gray-50">
							Pre-Scouting Data
						</span>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell>Drivetrain</TableCell>
									<TableCell>
										{drivetrainOptions.find(
											(d) => d.value === teamData.scouting.drivetrain,
										)?.label ?? ""}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Programming Language</TableCell>
									<TableCell>
										{programmingLanguageOptions.find(
											(p) => p.value === teamData.scouting.programmingLanguage,
										)?.label ?? ""}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Can Score Coral?</TableCell>
									<TableCell>
										<Checkbox
											className="pointer-events-none"
											checked={teamData.scouting.canScoreCoral}
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Can Score Algae?</TableCell>
									<TableCell>
										<Checkbox
											className="pointer-events-none"
											checked={teamData.scouting.canScoreAlgae}
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Average Coral Cycled</TableCell>
									<TableCell>{teamData.scouting.averageCoralCycled}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Most Coral Cycled</TableCell>
									<TableCell>{teamData.scouting.mostCoralCycled}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Max Coral Scored in Auto</TableCell>
									<TableCell>
										{teamData.scouting.maxCoralScoredInAuto}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Can Score Coral in Auto?</TableCell>
									<TableCell>
										<Checkbox
											className="pointer-events-none"
											checked={teamData.scouting.canScoreCoralInAuto}
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Can Score Algae in Auto?</TableCell>
									<TableCell>
										<Checkbox
											className="pointer-events-none"
											checked={teamData.scouting.canScoreAlgaeInAuto}
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Can Leave in Auto?</TableCell>
									<TableCell>
										<Checkbox
											className="pointer-events-none"
											checked={teamData.scouting.canLeaveInAuto}
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Can Shallow Cage Climb?</TableCell>
									<TableCell>
										<Checkbox
											className="pointer-events-none"
											checked={teamData.scouting.canShallowCageClimb}
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Can Deep Cage Climb?</TableCell>
									<TableCell>
										<Checkbox
											className="pointer-events-none"
											checked={teamData.scouting.canDeepCageClimb}
										/>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</section>
					<section className="flex flex-col">
						<span className="text-xl font-semibold text-gray-950 dark:text-gray-50">
							Comments
						</span>
						<span className="border border-gray-300 rounded-md p-2 min-h-10 min-w-96">
							{teamData.scouting.comments}
						</span>
					</section>
					<section>
						<span className="text-xl font-semibold text-gray-950 dark:text-gray-50">
							Matches
						</span>
						<Table>
							<TableCaption>
								Match Schedule for team{" "}
								<span className="font-semibold">{teamNumber}</span> @{" "}
								<span className="font-semibold">
									{eventData.event.eventCode.toUpperCase()}
								</span>
							</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">#</TableHead>
									<TableHead>Est. Start Time</TableHead>
									<TableHead>Blue 1</TableHead>
									<TableHead>Blue 2</TableHead>
									<TableHead>Blue 3</TableHead>
									<TableHead>Red 1</TableHead>
									<TableHead>Red 2</TableHead>
									<TableHead>Red 3</TableHead>
									<TableHead>Scouting Points</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{teamMatches.map((match) => {
									let alliance: "blue" | "red" = "blue";
									let teamIndex = match.blueAllianceTeams.findIndex(
										(team) => team === Number.parseInt(teamNumber),
									);
									if (teamIndex === -1) {
										alliance = "red";
										teamIndex = match.redAllianceTeams.findIndex(
											(team) => team === Number.parseInt(teamNumber),
										);
									}

									const teamPoints =
										teamIndex === -1
											? 0
											: calculatePoints(match.scouting[alliance][teamIndex]);

									return (
										<TableRow key={match.matchNumber}>
											<TableCell className="font-medium">
												<Link href={`/matches/${match.matchNumber}`}>
													{match.matchNumber}
												</Link>
											</TableCell>
											<TableCell>
												{new Date(match.startTime).toLocaleTimeString(
													undefined,
													{
														month: "long",
														day: "2-digit",
														hourCycle: "h12",
														hour: "2-digit",
														minute: "2-digit",
														year: "numeric",
													},
												)}
											</TableCell>
											<TableCell
												className={`text-blue-800 dark:text-blue-400 ${match.blueAllianceTeams[0] === Number.parseInt(teamNumber) ? "font-extrabold underline" : "font-medium"}`}
											>
												<Link
													href={`/matches/${match.matchNumber}#team${match.blueAllianceTeams[0]}`}
												>
													{match.blueAllianceTeams[0]}
												</Link>
											</TableCell>
											<TableCell
												className={`text-blue-800 dark:text-blue-400 ${match.blueAllianceTeams[1] === Number.parseInt(teamNumber) ? "font-extrabold underline" : "font-medium"}`}
											>
												<Link
													href={`/matches/${match.matchNumber}#team${match.blueAllianceTeams[1]}`}
												>
													{match.blueAllianceTeams[1]}
												</Link>
											</TableCell>
											<TableCell
												className={`text-blue-800 dark:text-blue-400 ${match.blueAllianceTeams[2] === Number.parseInt(teamNumber) ? "font-extrabold underline" : "font-medium"}`}
											>
												<Link
													href={`/matches/${match.matchNumber}#team${match.blueAllianceTeams[2]}`}
												>
													{match.blueAllianceTeams[2]}
												</Link>
											</TableCell>
											<TableCell
												className={`text-red-800 dark:text-red-400 ${match.redAllianceTeams[0] === Number.parseInt(teamNumber) ? "font-extrabold underline" : "font-medium"}`}
											>
												<Link
													href={`/matches/${match.matchNumber}#team${match.redAllianceTeams[0]}`}
												>
													{match.redAllianceTeams[0]}
												</Link>
											</TableCell>
											<TableCell
												className={`text-red-800 dark:text-red-400 ${match.redAllianceTeams[1] === Number.parseInt(teamNumber) ? "font-extrabold underline" : "font-medium"}`}
											>
												<Link
													href={`/matches/${match.matchNumber}#team${match.redAllianceTeams[1]}`}
												>
													{match.redAllianceTeams[1]}
												</Link>
											</TableCell>
											<TableCell
												className={`text-red-800 dark:text-red-400 ${match.redAllianceTeams[2] === Number.parseInt(teamNumber) ? "font-extrabold underline" : "font-medium"}`}
											>
												<Link
													href={`/matches/${match.matchNumber}#team${match.redAllianceTeams[2]}`}
												>
													{match.redAllianceTeams[2]}
												</Link>
											</TableCell>
											<TableCell className="font-medium">
												{teamPoints}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</section>
				</div>
			)}
		</>
	);
}
