"use client";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useEventData } from "../context/EventDataContext";

export default function Matches() {
	const { eventData } = useEventData();

	return (
		<>
			{!eventData && (
				<span className="text-gray-950 text-2xl w-full text-center font-bold">
					No Event Data to Pull From
				</span>
			)}
			{eventData && (
				<Table>
					<TableCaption>
						Match Schedule for{" "}
						<span className="font-semibold">
							{eventData.event.eventCode.toUpperCase()}
						</span>
					</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">#</TableHead>
							<TableHead>Start Time</TableHead>
							<TableHead>Blue 1</TableHead>
							<TableHead>Blue 2</TableHead>
							<TableHead>Blue 3</TableHead>
							<TableHead>Red 1</TableHead>
							<TableHead>Red 2</TableHead>
							<TableHead>Red 3</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{eventData.matches.map((match) => (
							<TableRow key={match.matchNumber}>
								<TableCell className="font-medium">
									<Link href={`/matches/${match.matchNumber}`}>
										{match.matchNumber}
									</Link>
								</TableCell>
								<TableCell>
									{new Date(match.startTime).toLocaleTimeString(undefined, {
										month: "long",
										day: "2-digit",
										hourCycle: "h12",
										hour: "2-digit",
										minute: "2-digit",
										year: "numeric",
									})}
								</TableCell>
								<TableCell className="text-blue-800 dark:text-blue-400 font-medium">
									<Link
										href={`/matches/${match.matchNumber}#team${match.alliances.blue.teams[0]}`}
									>
										{match.alliances.blue.teams[0]}
									</Link>
								</TableCell>
								<TableCell className="text-blue-800 dark:text-blue-400 font-medium">
									<Link
										href={`/matches/${match.matchNumber}#team${match.alliances.blue.teams[1]}`}
									>
										{match.alliances.blue.teams[1]}
									</Link>
								</TableCell>
								<TableCell className="text-blue-800 dark:text-blue-400 font-medium">
									<Link
										href={`/matches/${match.matchNumber}#team${match.alliances.blue.teams[2]}`}
									>
										{match.alliances.blue.teams[2]}
									</Link>
								</TableCell>
								<TableCell className="text-red-800 dark:text-red-400 font-medium">
									<Link
										href={`/matches/${match.matchNumber}#team${match.alliances.red.teams[0]}`}
									>
										{match.alliances.red.teams[0]}
									</Link>
								</TableCell>
								<TableCell className="text-red-800 dark:text-red-400 font-medium">
									<Link
										href={`/matches/${match.matchNumber}#team${match.alliances.red.teams[1]}`}
									>
										{match.alliances.red.teams[1]}
									</Link>
								</TableCell>
								<TableCell className="text-red-800 dark:text-red-400 font-medium">
									<Link
										href={`/matches/${match.matchNumber}#team${match.alliances.red.teams[2]}`}
									>
										{match.alliances.red.teams[2]}
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
}
