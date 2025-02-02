"use client";
import { useEventData } from "@/app/context/EventDataContext";
import Loading from "@/components/loading";
import Savebar from "@/components/savebar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TeamData } from "@/lib/eventDataSchemas"
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Team({ params: { teamNumber } }: { params: { teamNumber: string } }) {
    const { eventData, updateData } = useEventData();

    const teamData = eventData?.teams.find(team => team.teamNumber === parseInt(teamNumber));

    const [showSaveBar, setShowSaveBar] = useState(false);
    const [confirmSave, setConfirmSave] = useState(false);
    const [teamDataState, setTeamDataState] = useState<TeamData["scouting"] | null>(null);

    useEffect(() => {
        if (eventData && teamData) {
            setTeamDataState(teamData.scouting);
        }
    }, [eventData, teamData]);

    const cancelSaveCallback = () => {
        setTeamDataState(teamData!.scouting);
        location.reload();
    };

    const saveCallback = () => {
        updateData({
            ...eventData!,
            teams: eventData!.teams.map(team => {
                if (team.teamNumber === parseInt(teamNumber)) return {
                    ...team,
                    scouting: teamDataState!
                };

                return team;
            })
        })
    }

    useEffect(() => {
        if (!teamDataState) return;
        let valueModified = false;
        Object.keys(teamDataState).forEach(key => {
            if (teamDataState![key as keyof TeamData["scouting"]] !== teamData!.scouting[key as keyof TeamData["scouting"]]) valueModified = true;
        });

        setShowSaveBar(valueModified);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamDataState])

    const drivetrainOptions = [
        {
            label: "Swerve",
            value: "swerve"
        },
        {
            label: "Mecanum",
            value: "mecanum"
        },
        {
            label: "Tank",
            value: "tank"
        },
        {
            label: "Other",
            value: "other"
        }
    ];

    const programmingLanguageOptions = [
        {
            label: "Java",
            value: "java"
        },
        {
            label: "Kotlin (Java based)",
            value: "kotlin"
        },
        {
            label: "C++",
            value: "cpp"
        },
        {
            label: "Python",
            value: "python"
        }
    ];

    return (
        <>
            {(!eventData || !teamData) && <span className="text-gray-950 dark:text-gray-50 text-2xl w-full text-center font-bold">No Event Data to Pull From or Invalid Team #</span>}
            {(eventData && teamData && teamDataState) &&
                <div className="flex flex-col w-full">
                    <section className="flex flex-col">
                        <span className="text-2xl font-semibold text-gray-950 dark:text-gray-50">{teamData.teamNumber} &#x2022; {teamData.name}</span>
                        <span className="text-lg text-gray-700 dark:text-gray-300">Robot Name: <span className="font-medium">{teamData.robotName !== "" ? teamData.robotName : "N/A"}</span> &#x2022; Rookie Year: <span className="font-medium">{teamData.rookieYear}</span></span>
                    </section>
                    <section className="flex flex-col pt-2">
                        <span className="text-xl font-semibold text-gray-950 dark:text-gray-50">Pre-Scouting Data</span>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Drivetrain</TableCell>
                                    <TableCell><Combobox placeholder="Select a drivetrain" emptyResult="Invalid drivetrain" options={drivetrainOptions} defaultValue={drivetrainOptions.find(d => d.value === teamDataState.drivetrain)?.label} onChange={(newValue) => setTeamDataState({ ...teamDataState, drivetrain: newValue as "other" })} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Programming Language</TableCell>
                                    <TableCell><Combobox placeholder="Select a programming language" emptyResult="Invalid programming language" options={programmingLanguageOptions} defaultValue={programmingLanguageOptions.find(p => p.value === teamDataState.programmingLanguage)?.label} onChange={(newValue) => setTeamDataState({ ...teamDataState, programmingLanguage: newValue as "java" })} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Can Score Coral?</TableCell>
                                    <TableCell><Checkbox defaultChecked={teamDataState.canScoreCoral} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canScoreCoral: !!checked })} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Can Score Algae?</TableCell>
                                    <TableCell><Checkbox defaultChecked={teamDataState.canScoreAlgae} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canScoreAlgae: !!checked })} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Average Coral Cycled</TableCell>
                                    <TableCell><Input type="number" className="w-min" min={0} defaultValue={teamDataState.averageCoralCycled} onChange={(e) => setTeamDataState({ ...teamDataState, averageCoralCycled: e.target.valueAsNumber })} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Most Coral Cycled</TableCell>
                                    <TableCell><Input type="number" className="w-min" min={0} defaultValue={teamDataState.mostCoralCycled} onChange={(e) => setTeamDataState({ ...teamDataState, mostCoralCycled: e.target.valueAsNumber })} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Max Coral Cycled in Auto</TableCell>
                                    <TableCell><Input type="number" className="w-min" min={0} defaultValue={teamDataState.maxCoralScoredInAuto} onChange={(e) => setTeamDataState({ ...teamDataState, maxCoralScoredInAuto: e.target.valueAsNumber })} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Can Score Coral in Auto?</TableCell>
                                    <TableCell><Checkbox defaultChecked={teamDataState.canScoreCoralInAuto} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canScoreCoralInAuto: !!checked })} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Can Score Algae in Auto?</TableCell>
                                    <TableCell><Checkbox defaultChecked={teamDataState.canScoreAlgaeInAuto} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canScoreAlgaeInAuto: !!checked })} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Can Leave in Auto?</TableCell>
                                    <TableCell><Checkbox defaultChecked={teamDataState.canLeaveInAuto} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canLeaveInAuto: !!checked })} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Can Shallow Cage Climb?</TableCell>
                                    <TableCell><Checkbox defaultChecked={teamDataState.canShallowCageClimb} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canShallowCageClimb: !!checked })} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Can Deep Cage Climb?</TableCell>
                                    <TableCell><Checkbox defaultChecked={teamDataState.canDeepCageClimb} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canDeepCageClimb: !!checked })} /></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </section>
                    <Savebar showing={showSaveBar} setShowing={setShowSaveBar} saveCallback={() => setConfirmSave(true)} resetCallback={cancelSaveCallback} />
                    <AlertDialog open={confirmSave}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will save over any and all current team data as it is shown to you currently. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => { cancelSaveCallback(); setConfirmSave(false) }}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => { saveCallback(); toast(`Saved Team Data for ${teamNumber}`); setConfirmSave(false) }}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            }
        </>
    )
}