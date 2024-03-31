"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MatchScoutingData, useEventData } from "@/hooks/useEventData"
import { calculateAverage, calculatePoints, calculateRanks } from "@/lib/calculate";
import Link from "next/link";

export default function Team({ params: { teamNumber } }: { params: { teamNumber: string } }) {
    const [eventData] = useEventData();
    const teamData = eventData?.teams.find(team => team.teamNumber === parseInt(teamNumber));
    const teamMatches = eventData?.matches.filter(match => match.alliances.blue.teams.includes(parseInt(teamNumber)) || match.alliances.red.teams.includes(parseInt(teamNumber)));
    const calculatedTeamMatches = eventData?.matches.filter(match => match.rankMatchData && match.alliances.blue.teams.includes(parseInt(teamNumber)) || match.alliances.red.teams.includes(parseInt(teamNumber)));
    const matchesScoutingData = calculatedTeamMatches?.map(teamMatch => {
        const blueIndex = teamMatch.alliances.blue.teams.findIndex((team) => team === parseInt(teamNumber));
        const redIndex = teamMatch.alliances.red.teams.findIndex((team) => team === parseInt(teamNumber));

        return blueIndex !== -1 ? teamMatch.scouting.blue[blueIndex]: teamMatch.scouting.red[redIndex];
    })

    function getAccuracy(matchesScoutingData: Array<MatchScoutingData>, teleop: true, key: keyof MatchScoutingData["teleop"]): number;
    function getAccuracy(matchesScoutingData: Array<MatchScoutingData>, teleop: false, key: keyof MatchScoutingData["auto"]): number;
    function getAccuracy(matchesScoutingData: Array<MatchScoutingData>, teleop: boolean, key: string): number {
        let timesTrue = 0;
        let matches = 0;

        matchesScoutingData.forEach(matchScoutingData => {
            if (teleop) {
                const teleopKey = key as keyof MatchScoutingData["teleop"];

                if (matchScoutingData.teleop[teleopKey]) timesTrue++;
            } else {
                const autoKey = key as keyof MatchScoutingData["auto"];

                if (matchScoutingData.auto[autoKey]) timesTrue++;
            }

            matches++;
        })

        return timesTrue/matches;
    }

    function getAverage(matchesScoutingData: Array<MatchScoutingData>, teleop: true, key: keyof MatchScoutingData["teleop"]): number;
    function getAverage(matchesScoutingData: Array<MatchScoutingData>, teleop: false, key: keyof MatchScoutingData["auto"]): number;
    function getAverage(matchesScoutingData: Array<MatchScoutingData>, other: "reliability"): number;
    function getAverage(matchesScoutingData: Array<MatchScoutingData>, teleop: boolean | "reliability", key?: string): number {
        let amount = 0;
        let matches = 0;

        matchesScoutingData.forEach(matchScoutingData => {
            if (teleop === "reliability") {
                if (!matchScoutingData.brokeDown) amount++;
            } else if (teleop) {
                const teleopKey = key as keyof MatchScoutingData["teleop"];

                amount += typeof matchScoutingData.teleop[teleopKey] === "number" ? matchScoutingData.teleop[teleopKey] as number : 1;
            } else {
                const autoKey = key as keyof MatchScoutingData["auto"];

                amount += typeof matchScoutingData.auto[autoKey] === "number" ? matchScoutingData.auto[autoKey] as number : 1;
            }

            matches++;
        })

        return amount/matches;
    }

    return (
        <>
            {(!eventData || !teamData) && <span className="text-gray-950 text-2xl w-full text-center font-bold">No Event Data to Pull From or Invalid Team #</span>}
            {(eventData && teamData && teamMatches && matchesScoutingData && teamMatches.length > 0) &&
            <div className="flex flex-col w-full">
                <section className="flex flex-col">
                    <span className="text-2xl font-semibold text-gray-950">{teamData.teamNumber} &#x2022; {teamData.name}</span>
                    <span className="text-lg text-gray-700">Robot Name: <span className="font-medium">{teamData.robotName !== "" ? teamData.robotName : "N/A"}</span></span>
                </section>
                <section className="flex flex-col">
                    <span className="text-xl font-semibold text-gray-950">Scouting</span>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Rank</TableCell>
                                <TableCell><span className="font-medium">#{calculateRanks(eventData.matches).findIndex(team => team === parseInt(teamNumber)) + 1}</span> of {eventData.teams.length}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Scouting Points Average</TableCell>
                                <TableCell>{calculateAverage(matchesScoutingData)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Reliability</TableCell>
                                <TableCell>{getAverage(matchesScoutingData, "reliability") * 100}%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Climb Accuracy</TableCell>
                                <TableCell>{getAccuracy(matchesScoutingData, true, "climbed") * 100}%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><span className="font-medium">Auto</span> Amplified Speaker Notes Average</TableCell>
                                <TableCell>{getAverage(matchesScoutingData, false, "speakerNotesScored")}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><span className="font-medium">Auto</span> Amp Speaker Notes Average</TableCell>
                                <TableCell>{getAverage(matchesScoutingData, false, "ampNotesScored")}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><span className="font-medium">Teleop</span> Speaker Notes Average (includes non-amplified <span className="font-bold">and</span> amplified)</TableCell>
                                <TableCell>{((getAverage(matchesScoutingData, true, "speakerNotesScored") * matchesScoutingData.length) + (getAverage(matchesScoutingData, true, "amplifiedSpeakerNotesScored") * matchesScoutingData.length)) / matchesScoutingData.length}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><span className="font-medium">Teleop</span> Amplified Speaker Notes Average</TableCell>
                                <TableCell>{getAverage(matchesScoutingData, true, "speakerNotesScored")}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><span className="font-medium">Teleop</span> Amp Speaker Notes Average</TableCell>
                                <TableCell>{getAverage(matchesScoutingData, true, "ampNotesScored")}</TableCell>
                            </TableRow>
                            {/* <TableRow>
                                <TableCell>Rank</TableCell>
                                <TableCell><Checkbox className="pointer-events-none" checked={true}/></TableCell>
                            </TableRow> */}
                        </TableBody>
                    </Table>
                </section>
                <section>
                    <span className="text-xl font-semibold text-gray-950">Matches</span>
                    <Table>
                        <TableCaption>Match Schedule for team <span className="font-semibold">{teamNumber}</span> @ <span className="font-semibold">{eventData.event.eventCode.toUpperCase()}</span></TableCaption>
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
                                <TableHead>Scouting Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamMatches.map(match => (
                                <TableRow key={match.matchNumber}>
                                    <TableCell className="font-medium"><Link href={`/matches/${match.matchNumber}`}>{match.matchNumber}</Link></TableCell>
                                    <TableCell>{new Date(match.startTime).toLocaleTimeString(undefined, {
                                        month: "long",
                                        day: "2-digit",
                                        hourCycle: "h12",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        year: "numeric"
                                    })}</TableCell>
                                    <TableCell className={`text-blue-800 ${match.alliances.blue.teams[0] === parseInt(teamNumber) ? "font-extrabold" : "font-medium"}`}><Link href={`/matches/${match.matchNumber}#team${match.alliances.blue.teams[0]}`}>{match.alliances.blue.teams[0]}</Link></TableCell>
                                    <TableCell className={`text-blue-800 ${match.alliances.blue.teams[1] === parseInt(teamNumber) ? "font-extrabold" : "font-medium"}`}><Link href={`/matches/${match.matchNumber}#team${match.alliances.blue.teams[1]}`}>{match.alliances.blue.teams[1]}</Link></TableCell>
                                    <TableCell className={`text-blue-800 ${match.alliances.blue.teams[2] === parseInt(teamNumber) ? "font-extrabold" : "font-medium"}`}><Link href={`/matches/${match.matchNumber}#team${match.alliances.blue.teams[2]}`}>{match.alliances.blue.teams[2]}</Link></TableCell>
                                    <TableCell className={`text-red-800 ${match.alliances.red.teams[0] === parseInt(teamNumber) ? "font-extrabold" : "font-medium"}`}><Link href={`/matches/${match.matchNumber}#team${match.alliances.red.teams[0]}`}>{match.alliances.red.teams[0]}</Link></TableCell>
                                    <TableCell className={`text-red-800 ${match.alliances.red.teams[1] === parseInt(teamNumber) ? "font-extrabold" : "font-medium"}`}><Link href={`/matches/${match.matchNumber}#team${match.alliances.red.teams[1]}`}>{match.alliances.red.teams[1]}</Link></TableCell>
                                    <TableCell className={`text-red-800 ${match.alliances.red.teams[2] === parseInt(teamNumber) ? "font-extrabold" : "font-medium"}`}><Link href={`/matches/${match.matchNumber}#team${match.alliances.red.teams[2]}`}>{match.alliances.red.teams[2]}</Link></TableCell>
                                    <TableCell className="font-medium">{calculatePoints(match.scouting.blue.find(matchScoutingData => match.alliances.blue.teams.findIndex(team => team === parseInt(teamNumber)) !== -1) || match.scouting.red.find(matchScoutingData => match.alliances.red.teams.findIndex(team => team === parseInt(teamNumber)) !== -1)!)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> 
                </section>
            </div>
            }
        </>
    )
}