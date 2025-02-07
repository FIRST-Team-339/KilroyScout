"use client";
import {
	Table,
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import {
	calculateRanks,
	calculateScoutingPointsAverage,
} from "@/lib/calculate";
import Link from "next/link";
import { useEventData } from "../context/EventDataContext";

export default function Rankings() {
	const { eventData } = useEventData();
	const ranks = eventData ? calculateRanks(eventData.matches) : [];

	return (
		<>
			{!eventData && (
				<span className="text-gray-950 text-2xl w-full text-center font-bold">
					No Event Data to Pull From
				</span>
			)}
			{eventData && (
				<Table id="teams">
					<TableCaption>Teams Attending</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Rank</TableHead>
							<TableHead>Scouting Points Average</TableHead>
							<TableHead>#</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Robot Name</TableHead>
							<TableHead>Rookie Year</TableHead>
							<TableHead>Location</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{eventData.teams
							.sort(
								(a, b) =>
									ranks.findIndex((rank) => rank === a.teamNumber) -
									ranks.findIndex((rank) => rank === b.teamNumber),
							)
							.map((team) => {
								const calculatedTeamMatches = eventData?.matches.filter(
									(match) => {
										return (
											match.rankMatchData &&
											(match.alliances.blue.teams.includes(team.teamNumber) ||
												match.alliances.red.teams.includes(team.teamNumber))
										);
									},
								);

								const matchesScoutingData = calculatedTeamMatches?.map(
									(teamMatch) => {
										const blueIndex = teamMatch.alliances.blue.teams.findIndex(
											(nTeam) => nTeam === team.teamNumber,
										);
										const redIndex = teamMatch.alliances.red.teams.findIndex(
											(nTeam) => nTeam === team.teamNumber,
										);

										return blueIndex !== -1
											? teamMatch.scouting.blue[blueIndex]
											: teamMatch.scouting.red[redIndex];
									},
								);

								const average =
									calculateScoutingPointsAverage(matchesScoutingData);

								return (
									<TableRow key={team.teamNumber}>
										<TableCell className="font-medium">
											{ranks.findIndex(
												(rankTeamNumber) => rankTeamNumber === team.teamNumber,
											) + 1}
										</TableCell>
										<TableCell className="font-medium">
											{!Number.isNaN(average)
												? average.toFixed(3)
												: (0).toFixed(3)}
										</TableCell>
										<TableCell>
											<Link href={`/teams/${team.teamNumber}`}>
												{team.teamNumber}
											</Link>
										</TableCell>
										<TableCell>{team.name}</TableCell>
										<TableCell>{team.robotName}</TableCell>
										<TableCell>{team.rookieYear}</TableCell>
										<TableCell>{team.location}</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			)}
		</>
	);
}
