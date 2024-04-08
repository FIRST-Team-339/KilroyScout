"use client";
import Savebar from "@/components/savebar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { MatchData, MatchAlliancesData, useEventData, MatchScoutingData } from "@/hooks/useEventData";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function MatchDetails({ params: { matchNumber } }: { params: { matchNumber: string } }) {
  const [eventData, setEventData] = useEventData();
  const matchData = eventData?.matches.find(match => match.matchNumber === parseInt(matchNumber));

  const [showSaveBar, setShowSaveBar] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [matchAllianceDataState, setMatchAllianceDataState] = useState<MatchData["alliances"]>(matchData?.alliances ?? ({} as unknown as MatchData["alliances"]));
  const [matchDataState, setMatchDataState] = useState<MatchData["scouting"]>(structuredClone(matchData?.scouting) ?? ({} as unknown as MatchData["scouting"]));

  const cancelSaveCallback = () => {
        setMatchDataState(matchData!.scouting);
        location.reload();
    };

    const saveCallback = () => {
        setEventData({
            ...eventData!,
            matches: eventData!.matches.map(match => {
                if (match.matchNumber === parseInt(matchNumber)) return {
                    ...match,
                    alliances: matchAllianceDataState,
                    scouting: matchDataState
                };
                
                return match;
            })
        })
        location.reload();
    }

    useEffect(() => {
        let valueModified = false;

        matchDataState.blue.forEach((blueMatchDataState, index) => {
            Object.keys(blueMatchDataState.auto).forEach(key => {
                if (blueMatchDataState.auto[key as keyof MatchScoutingData["auto"]] !== matchData?.scouting.blue[index].auto[key as keyof MatchScoutingData["auto"]]) valueModified = true;
            })

            Object.keys(blueMatchDataState.teleop).forEach(key => {
                if (blueMatchDataState.teleop[key as keyof MatchScoutingData["teleop"]] !== matchData?.scouting.blue[index].teleop[key as keyof MatchScoutingData["teleop"]]) valueModified = true;
            })

            if (blueMatchDataState.brokeDown !== matchData?.scouting.blue[index].brokeDown) valueModified = true;

            if (blueMatchDataState.comments !== matchData?.scouting.blue[index].comments) valueModified = true;
        });

        matchDataState.red.forEach((redMatchDataState, index) => {
            Object.keys(redMatchDataState.auto).forEach(key => {
                if (redMatchDataState.auto[key as keyof MatchScoutingData["auto"]] !== matchData?.scouting.red[index].auto[key as keyof MatchScoutingData["auto"]]) valueModified = true;
            })

            Object.keys(redMatchDataState.teleop).forEach(key => {
                if (redMatchDataState.teleop[key as keyof MatchScoutingData["teleop"]] !== matchData?.scouting.red[index].teleop[key as keyof MatchScoutingData["teleop"]]) valueModified = true;
            })

            if (redMatchDataState.brokeDown !== matchData?.scouting.red[index].brokeDown) valueModified = true;

            if (redMatchDataState.comments !== matchData?.scouting.red[index].comments) valueModified = true;
        });

        Object.keys(matchAllianceDataState.blue).forEach(key => {
            if (matchAllianceDataState.blue[key as keyof MatchAlliancesData] !== matchData!.alliances.blue[key as keyof MatchAlliancesData]) valueModified = true;
        });

        Object.keys(matchAllianceDataState.red).forEach(key => {
            if (matchAllianceDataState.red[key as keyof MatchAlliancesData] !== matchData!.alliances.red[key as keyof MatchAlliancesData]) valueModified = true;
        });

        setShowSaveBar(valueModified);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDataState, matchAllianceDataState])

    type DeepPartial<T> = T extends object ? {
        [P in keyof T]?: DeepPartial<T[P]>;
    } : T;

    const mergeMatchData = (array: [MatchScoutingData, MatchScoutingData, MatchScoutingData], dataToMerge: DeepPartial<MatchScoutingData>, index: number): [MatchScoutingData, MatchScoutingData, MatchScoutingData] => {
        const original = array[index];

        array[index] = {
            auto: {
                passedStartLine: dataToMerge.auto?.passedStartLine ?? original.auto.passedStartLine,
                speakerNotesScored: dataToMerge.auto?.speakerNotesScored ?? original.auto.speakerNotesScored,
                ampNotesScored: dataToMerge.auto?.ampNotesScored ?? original.auto.ampNotesScored
            },
            teleop: {
                speakerNotesScored: dataToMerge.teleop?.speakerNotesScored ?? original.teleop.speakerNotesScored,
                amplifiedSpeakerNotesScored: dataToMerge.teleop?.amplifiedSpeakerNotesScored ?? original.teleop.amplifiedSpeakerNotesScored,
                ampNotesScored: dataToMerge.teleop?.ampNotesScored ?? original.teleop.ampNotesScored,
                parked: dataToMerge.teleop?.parked ?? original.teleop.parked,
                climbed: dataToMerge.teleop?.climbed ?? original.teleop.climbed,
                spotlit: dataToMerge.teleop?.spotlit ?? original.teleop.spotlit,
                harmonizing: dataToMerge.teleop?.harmonizing ?? original.teleop.harmonizing,
                scoredTrap: dataToMerge.teleop?.scoredTrap ?? original.teleop.scoredTrap,
                defense: dataToMerge.teleop?.defense ?? original.teleop.defense,
            },
            brokeDown: dataToMerge.brokeDown ?? original.brokeDown,
            comments: dataToMerge.comments ?? original.comments
        }

        return array;
    }

  return (
    <>
      {(!eventData || !matchData) && <span className="text-gray-950 text-2xl w-full text-center font-bold">No Event Data to Pull From or Invalid Match #</span>}
      {(eventData && matchData) && 
        <div className="flex flex-col w-full">
            <section className="flex flex-col py-2">
                <span className="font-bold text-3xl text-center">Match {matchNumber}</span>
            </section>
            <div className="flex w-full mb-16 gap-x-24">
                <section id="blue-alliance" className="flex w-full flex-col text-gray-950 dark:text-gray-50 space-y-2">
                    <span className="text-2xl font-semibold text-blue-700">Blue Alliance</span>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Did Coopertition</TableCell>
                                <TableCell><Checkbox defaultChecked={matchData.alliances.blue.didCoopertition} onCheckedChange={(checked) => setMatchAllianceDataState({ ...matchAllianceDataState, blue: { ...matchAllianceDataState.blue, didCoopertition: !!checked } })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Melody Bonus</TableCell>
                                <TableCell><Checkbox defaultChecked={matchData.alliances.blue.melody} onCheckedChange={(checked) => setMatchAllianceDataState({ ...matchAllianceDataState, blue: { ...matchAllianceDataState.blue, melody: !!checked } })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Ensemble Bonus</TableCell>
                                <TableCell><Checkbox defaultChecked={matchData.alliances.blue.ensemble} onCheckedChange={(checked) => setMatchAllianceDataState({ ...matchAllianceDataState, blue: { ...matchAllianceDataState.blue, ensemble: !!checked } })}/></TableCell>
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
                                <TableCell><Checkbox defaultChecked={matchData.alliances.red.didCoopertition} onCheckedChange={(checked) => setMatchAllianceDataState({ ...matchAllianceDataState, red: { ...matchAllianceDataState.red, didCoopertition: !!checked } })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Melody Bonus</TableCell>
                                <TableCell><Checkbox defaultChecked={matchData.alliances.red.melody} onCheckedChange={(checked) => setMatchAllianceDataState({ ...matchAllianceDataState, red: { ...matchAllianceDataState.red, melody: !!checked } })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Ensemble Bonus</TableCell>
                                <TableCell><Checkbox defaultChecked={matchData.alliances.red.ensemble} onCheckedChange={(checked) => setMatchAllianceDataState({ ...matchAllianceDataState, red: { ...matchAllianceDataState.red, ensemble: !!checked } })}/></TableCell>
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
                                <span className="text-xl font-medium">Autonomous</span>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Passed Start Line</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.auto.passedStartLine} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { auto: { passedStartLine: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Speaker Notes Scored</TableCell>
                                            <TableCell><Input type="number" className="w-min" min={0} defaultValue={data.auto.speakerNotesScored} onChange={(e) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { auto: { speakerNotesScored: e.target.valueAsNumber } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amp Notes Scored</TableCell>
                                            <TableCell><Input type="number" className="w-min" min={0} defaultValue={data.auto.ampNotesScored} onChange={(e) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { auto: { ampNotesScored: e.target.valueAsNumber } }, index) })}/></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <span className="text-xl font-medium">Teleop</span>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Speaker Notes Scored</TableCell>
                                            <TableCell><Input type="number" className="w-min" min={0} defaultValue={data.teleop.speakerNotesScored} onChange={(e) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { teleop: { speakerNotesScored: e.target.valueAsNumber } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amplified Speaker Notes Scored</TableCell>
                                            <TableCell><Input type="number" className="w-min" min={0} defaultValue={data.teleop.amplifiedSpeakerNotesScored} onChange={(e) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { teleop: { amplifiedSpeakerNotesScored: e.target.valueAsNumber } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amp Notes Scored</TableCell>
                                            <TableCell><Input type="number" className="w-min" min={0} defaultValue={data.teleop.ampNotesScored} onChange={(e) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { teleop: { ampNotesScored: e.target.valueAsNumber } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Parked</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.teleop.parked} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { teleop: { parked: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Climbed</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.teleop.climbed} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { teleop: { climbed: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Spotlit</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.teleop.spotlit} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { teleop: { spotlit: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Harmonizing</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.teleop.harmonizing} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { teleop: { harmonizing: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Scored Trap</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.teleop.scoredTrap} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { teleop: { scoredTrap: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Defense (0-5)</TableCell>
                                            <TableCell className="flex flex-row items-center">
                                            <Input type="number" className="w-min" min={0} max={5} defaultValue={data.teleop.defense} onChange={(e) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { teleop: { defense: e.target.valueAsNumber } }, index) })}/>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <span className="text-xl font-medium">Comments</span>
                                <Textarea defaultValue={data.comments} className="resize-y min-h-10 max-h-40" onChange={(e) => setMatchDataState({ ...matchDataState, blue: mergeMatchData(matchDataState.blue, { comments: e.target.value }, index) })}/>
                            </section>
                        )
                    })}
                </div>
                <div className="w-full grid grid-rows-3 gap-16">
                    {matchData.scouting.red.map((data, index) => {
                        const teamNumber = matchData.alliances.red.teams[index];

                        return (
                            <section key={teamNumber} className={`flex flex-col text-gray-950 dark:text-gray-50 space-y-2`}>
                                <Link className="text-2xl font-semibold text-red-700" href={`/teams/${teamNumber}`}>{teamNumber}</Link>
                                <span className="text-xl font-medium">Autonomous</span>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Passed Start Line</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.auto.passedStartLine} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { auto: { passedStartLine: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Speaker Notes Scored</TableCell>
                                            <TableCell><Input type="number" className="w-min" min={0} defaultValue={data.auto.speakerNotesScored} onChange={(e) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { auto: { speakerNotesScored: e.target.valueAsNumber } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amp Notes Scored</TableCell>
                                            <TableCell><Input type="number" className="w-min" min={0} defaultValue={data.auto.ampNotesScored} onChange={(e) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { auto: { ampNotesScored: e.target.valueAsNumber } }, index) })}/></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <span className="text-xl font-medium">Teleop</span>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Speaker Notes Scored</TableCell>
                                            <TableCell><Input type="number" className="w-min" min={0} defaultValue={data.teleop.speakerNotesScored} onChange={(e) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { teleop: { speakerNotesScored: e.target.valueAsNumber } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amplified Speaker Notes Scored</TableCell>
                                            <TableCell><Input type="number" className="w-min" min={0} defaultValue={data.teleop.amplifiedSpeakerNotesScored} onChange={(e) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { teleop: { amplifiedSpeakerNotesScored: e.target.valueAsNumber } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amp Notes Scored</TableCell>
                                            <TableCell><Input type="number" className="w-min" min={0} defaultValue={data.teleop.ampNotesScored} onChange={(e) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { teleop: { ampNotesScored: e.target.valueAsNumber } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Parked</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.teleop.parked} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { teleop: { parked: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Climbed</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.teleop.climbed} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { teleop: { climbed: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Spotlit</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.teleop.spotlit} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { teleop: { spotlit: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Harmonizing</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.teleop.harmonizing} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { teleop: { harmonizing: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Scored Trap</TableCell>
                                            <TableCell><Checkbox defaultChecked={data.teleop.scoredTrap} onCheckedChange={(checked) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { teleop: { scoredTrap: !!checked } }, index) })}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Defense (0-5)</TableCell>
                                            <TableCell className="flex flex-row items-center">
                                            <Input type="number" className="w-min" min={0} max={5} defaultValue={data.teleop.defense} onChange={(e) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { teleop: { defense: e.target.valueAsNumber } }, index) })}/>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <span className="text-xl font-medium">Comments</span>
                                <Textarea defaultValue={data.comments} className="resize-y min-h-10 max-h-40" onChange={(e) => setMatchDataState({ ...matchDataState, red: mergeMatchData(matchDataState.red, { comments: e.target.value }, index) })}/>
                            </section>
                        )
                    })}
                </div>
            </div>
            <Savebar showing={showSaveBar} setShowing={setShowSaveBar} saveCallback={() => setConfirmSave(true)} resetCallback={cancelSaveCallback}/>
            <AlertDialog open={confirmSave}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will save over any and all current team data as it is shown to you currently. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => {cancelSaveCallback(); setConfirmSave(false)}}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {saveCallback(); toast(`Saved Match Data for match ${matchNumber}`); setConfirmSave(false)}}>Continue</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      }
    </>
  )
}