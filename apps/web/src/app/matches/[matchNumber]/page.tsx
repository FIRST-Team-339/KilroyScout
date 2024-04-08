"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { useEventData } from "@/hooks/useEventData";
import { calculatePoints } from "@/lib/calculate";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MatchDetails({ params: { matchNumber } }: { params: { matchNumber: string } }) {
  const [eventData] = useEventData();
  const matchData = eventData?.matches.find(match => match.matchNumber === parseInt(matchNumber))

  const router = useRouter();

  return (
    <>
      {(!eventData || !matchData) && <span className="text-gray-950 text-2xl w-full text-center font-bold">No Event Data to Pull From or Invalid Match #</span>}
      {(eventData && matchData) && 
        <div className="flex flex-col w-full">
            <section className="flex flex-col py-2 space-y-2">
                <span className="font-bold text-3xl text-center">Match {matchNumber}</span>
                <Button type="button" onClick={() => router.push(`/matches/${matchNumber}/edit`)}>Edit Match Data</Button>
            </section>
            <div className="flex w-full mb-16 gap-x-24">
                <section id="blue-alliance" className="flex w-full flex-col text-gray-950 dark:text-gray-50 space-y-2">
                    <span className="text-2xl font-semibold text-blue-700">Blue Alliance</span>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Did Coopertition</TableCell>
                                <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.blue.didCoopertition}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Melody Bonus</TableCell>
                                <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.blue.melody}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Ensemble Bonus</TableCell>
                                <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.blue.ensemble}/></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </section>
                <section id="red-alliance" className="flex w-full flex-col text-gray-950 dark:text-gray-50 space-y-2">
                    <span className="text-2xl font-semibold text-red-700">Red Alliance</span>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Did Coopertition</TableCell>
                                <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.red.didCoopertition}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Melody Bonus</TableCell>
                                <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.blue.melody}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Ensemble Bonus</TableCell>
                                <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.blue.ensemble}/></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </section>
            </div>
            <div className="w-full grid grid-cols-2 gap-x-24">
                <div className="w-full grid grid-rows-3 gap-y-16">
                    {matchData.scouting.blue.map((data, index) => {
                        const teamNumber = matchData.alliances.blue.teams[index];

                        return (
                            <section key={teamNumber} className={`flex flex-col text-gray-950 dark:text-gray-50 space-y-2`}>
                                <Link className="text-2xl font-semibold text-blue-700" href={`/teams/${teamNumber}`}>{teamNumber}</Link>
                                <span className="text-xl font-medium">Scouting Points: <span className="font-normal">{calculatePoints(data)}</span></span>
                                <span className="text-xl font-medium">Autonomous</span>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Passed Start Line</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.auto.passedStartLine}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Speaker Notes Scored</TableCell>
                                            <TableCell>{data.auto.speakerNotesScored}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amp Notes Scored</TableCell>
                                            <TableCell>{data.auto.ampNotesScored}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <span className="text-xl font-medium">Teleop</span>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Speaker Notes Scored</TableCell>
                                            <TableCell>{data.teleop.speakerNotesScored}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amplified Speaker Notes Scored</TableCell>
                                            <TableCell>{data.teleop.amplifiedSpeakerNotesScored}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amp Notes Scored</TableCell>
                                            <TableCell>{data.teleop.ampNotesScored}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Parked</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.parked}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Climbed</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.climbed}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Spotlit</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.spotlit}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Harmonizing</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.harmonizing}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Scored Trap</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.scoredTrap}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Defense</TableCell>
                                            <TableCell className="flex flex-row items-center">
                                                <span className="text-md pr-2">{data.teleop.defense }<span className="font-bold">/5</span></span>
                                                <Progress value={(data.teleop.defense / 5) * 100} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <span className="text-xl font-medium">Comments</span>
                                <span className="border border-gray-300 rounded-md p-2 min-h-10 min-w-96">{data.comments}</span>
                            </section>
                        )
                    })}
                </div>
                <div className="w-full grid grid-rows-3 gap-16">
                    {matchData.scouting.red.map((data, index) => {
                        const teamNumber = matchData.alliances.red.teams[index];

                        return (
                            <section key={teamNumber} id={`team${teamNumber}`} className={`flex flex-col text-gray-950 dark:text-gray-50 space-y-2`}>
                                <Link className="text-2xl font-semibold text-red-700" href={`/teams/${teamNumber}`}>{teamNumber}</Link>
                                <span className="text-xl font-medium">Scouting Points: <span className="font-normal">{calculatePoints(data)}</span></span>
                                <span className="text-xl font-medium">Autonomous</span>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Passed Start Line</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.auto.passedStartLine}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Speaker Notes Scored</TableCell>
                                            <TableCell>{data.auto.speakerNotesScored}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amp Notes Scored</TableCell>
                                            <TableCell>{data.auto.ampNotesScored}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <span className="text-xl font-medium">Teleop</span>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Speaker Notes Scored</TableCell>
                                            <TableCell>{data.teleop.speakerNotesScored}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amplified Speaker Notes Scored</TableCell>
                                            <TableCell>{data.teleop.amplifiedSpeakerNotesScored}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amp Notes Scored</TableCell>
                                            <TableCell>{data.teleop.ampNotesScored}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Parked</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.parked}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Climbed</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.climbed}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Spotlit</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.spotlit}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Harmonizing</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.harmonizing}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Scored Trap</TableCell>
                                            <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.scoredTrap}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Defense</TableCell>
                                            <TableCell className="flex flex-row items-center">
                                                <span className="text-md pr-2">{data.teleop.defense }<span className="font-bold">/5</span></span>
                                                <Progress value={(data.teleop.defense / 5) * 100} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <span className="text-xl font-medium">Comments</span>
                                <span className="border border-gray-300 rounded-md p-2 min-h-10 min-w-96">{data.comments}</span>
                            </section>
                        )
                    })}
                </div>
            </div>
        </div>
      }
    </>
  )
}