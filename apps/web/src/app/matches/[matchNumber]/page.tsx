"use client";
import { useEventData } from "@/app/context/EventDataContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { calculatePoints } from "@/lib/calculate";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MatchDetails({ params: { matchNumber } }: { params: { matchNumber: string } }) {
    const { eventData } = useEventData();
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
                                        <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.blue.didCoopertition} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Auto RP</TableCell>
                                        <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.blue.autoRP} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Coral RP</TableCell>
                                        <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.blue.coralRP} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Barge RP</TableCell>
                                        <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.blue.bargeRP} /></TableCell>
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
                                        <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.red.didCoopertition} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Auto RP</TableCell>
                                        <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.red.autoRP} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Coral RP</TableCell>
                                        <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.red.coralRP} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Barge RP</TableCell>
                                        <TableCell><Checkbox className="pointer-events-none" checked={matchData.alliances.red.bargeRP} /></TableCell>
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
                                    <section key={teamNumber} id={`team${teamNumber}`} className={`flex flex-col text-gray-950 dark:text-gray-50 space-y-2`}>
                                        <Link className="text-2xl font-semibold text-blue-700" href={`/teams/${teamNumber}`}>{teamNumber}</Link>
                                        <span className="text-xl font-medium">Scouting Points: <span className="font-normal">{calculatePoints(data)}</span></span>
                                        <span className="text-xl font-medium">Autonomous</span>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Leave</TableCell>
                                                    <TableCell><Checkbox className="pointer-events-none" checked={data.auto.leave} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L1 Coral Scored</TableCell>
                                                    <TableCell>{data.auto.coralL1}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L2 Coral Scored</TableCell>
                                                    <TableCell>{data.auto.coralL2}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L3 Coral Scored</TableCell>
                                                    <TableCell>{data.auto.coralL3}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L4 Coral Scored</TableCell>
                                                    <TableCell>{data.auto.coralL4}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Algae Scored</TableCell>
                                                    <TableCell>{data.auto.algaeProcessor}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                        <span className="text-xl font-medium">Teleop</span>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>L1 Coral Scored</TableCell>
                                                    <TableCell>{data.teleop.coralL1}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L2 Coral Scored</TableCell>
                                                    <TableCell>{data.teleop.coralL2}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L3 Coral Scored</TableCell>
                                                    <TableCell>{data.teleop.coralL3}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L4 Coral Scored</TableCell>
                                                    <TableCell>{data.teleop.coralL4}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Algae Scored [Processor]</TableCell>
                                                    <TableCell>{data.teleop.algaeProcessor}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Algae Scored [Net]</TableCell>
                                                    <TableCell>{data.teleop.algaeNet}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Parked</TableCell>
                                                    <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.parked} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Shallow Cage Climbed</TableCell>
                                                    <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.shallowCageClimbed} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Deep Cage Climbed</TableCell>
                                                    <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.deepCageClimbed} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Defense</TableCell>
                                                    <TableCell className="flex flex-row items-center">
                                                        <span className="text-md pr-2">{data.teleop.defense}<span className="font-bold">/5</span></span>
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
                                                    <TableCell>Leave</TableCell>
                                                    <TableCell><Checkbox className="pointer-events-none" checked={data.auto.leave} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L1 Coral Scored</TableCell>
                                                    <TableCell>{data.auto.coralL1}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L2 Coral Scored</TableCell>
                                                    <TableCell>{data.auto.coralL2}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L3 Coral Scored</TableCell>
                                                    <TableCell>{data.auto.coralL3}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L4 Coral Scored</TableCell>
                                                    <TableCell>{data.auto.coralL4}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Algae Scored</TableCell>
                                                    <TableCell>{data.auto.algaeProcessor}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                        <span className="text-xl font-medium">Teleop</span>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>L1 Coral Scored</TableCell>
                                                    <TableCell>{data.teleop.coralL1}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L2 Coral Scored</TableCell>
                                                    <TableCell>{data.teleop.coralL2}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L3 Coral Scored</TableCell>
                                                    <TableCell>{data.teleop.coralL3}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>L4 Coral Scored</TableCell>
                                                    <TableCell>{data.teleop.coralL4}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Algae Scored [Processor]</TableCell>
                                                    <TableCell>{data.teleop.algaeProcessor}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Algae Scored [Net]</TableCell>
                                                    <TableCell>{data.teleop.algaeNet}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Parked</TableCell>
                                                    <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.parked} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Shallow Cage Climbed</TableCell>
                                                    <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.shallowCageClimbed} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Deep Cage Climbed</TableCell>
                                                    <TableCell><Checkbox className="pointer-events-none" checked={data.teleop.deepCageClimbed} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Defense</TableCell>
                                                    <TableCell className="flex flex-row items-center">
                                                        <span className="text-md pr-2">{data.teleop.defense}<span className="font-bold">/5</span></span>
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