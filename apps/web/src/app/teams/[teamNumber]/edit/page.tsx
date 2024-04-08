"use client";
import Savebar from "@/components/savebar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TeamData, useEventData } from "@/hooks/useEventData"
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Team({ params: { teamNumber } }: { params: { teamNumber: string } }) {
    const [eventData, setEventData] = useEventData();
    const teamData = eventData?.teams.find(team => team.teamNumber === parseInt(teamNumber));
    const teamMatches = eventData?.matches.filter(match => match.alliances.blue.teams.includes(parseInt(teamNumber)) || match.alliances.red.teams.includes(parseInt(teamNumber)));
    const calculatedTeamMatches = eventData?.matches.filter(match => match.rankMatchData && match.alliances.blue.teams.includes(parseInt(teamNumber)) || match.alliances.red.teams.includes(parseInt(teamNumber)));
    const matchesScoutingData = calculatedTeamMatches?.map(teamMatch => {
        const blueIndex = teamMatch.alliances.blue.teams.findIndex((team) => team === parseInt(teamNumber));
        const redIndex = teamMatch.alliances.red.teams.findIndex((team) => team === parseInt(teamNumber));

        return blueIndex !== -1 ? teamMatch.scouting.blue[blueIndex]: teamMatch.scouting.red[redIndex];
    })

    const [showSaveBar, setShowSaveBar] = useState(false);
    const [confirmSave, setConfirmSave] = useState(false);
    const [teamDataState, setTeamDataState] = useState<TeamData["scouting"]>(teamData?.scouting ?? ({} as unknown as TeamData["scouting"]));

    const cancelSaveCallback = () => {
        setTeamDataState(teamData!.scouting);
        location.reload();
    };

    const saveCallback = () => {
        setEventData({
            ...eventData!,
            teams: eventData!.teams.map(team => {
                if (team.teamNumber === parseInt(teamNumber)) return {
                    ...team,
                    scouting: teamDataState
                };
                
                return team;
            })
        })
    }

    useEffect(() => {
        let valueModified = false;
        Object.keys(teamDataState).forEach(key => {
            if (teamDataState[key as keyof TeamData["scouting"]] !== teamData!.scouting[key as keyof TeamData["scouting"]]) valueModified = true;
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
            {(eventData && teamData && teamMatches && matchesScoutingData && teamMatches.length > 0) &&
            <div className="flex flex-col w-full">
                <section className="flex flex-col">
                    <span className="text-2xl font-semibold text-gray-950 dark:text-gray-50">{teamData.teamNumber} &#x2022; {teamData.name}</span>
                    <span className="text-lg text-gray-700 dark:text-gray-300">Robot Name: <span className="font-medium">{teamData.robotName !== "" ? teamData.robotName : "N/A"}</span></span>
                </section>
                <section className="flex flex-col pt-2">
                    <span className="text-xl font-semibold text-gray-950 dark:text-gray-50">Pre-Scouting Data</span>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Drivetrain</TableCell>
                                <TableCell><Combobox placeholder="Select a drivetrain" emptyResult="Invalid drivetrain" options={drivetrainOptions} defaultValue={drivetrainOptions.find(d => d.value === teamData.scouting.drivetrain)?.label} onChange={(newValue) => setTeamDataState({ ...teamDataState, drivetrain: newValue as "other" })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Programming Language</TableCell>
                                <TableCell><Combobox placeholder="Select a programming language" emptyResult="Invalid programming language" options={programmingLanguageOptions} defaultValue={programmingLanguageOptions.find(p => p.value === teamData.scouting.programmingLanguage)?.label} onChange={(newValue) => setTeamDataState({ ...teamDataState, programmingLanguage: newValue as "java" })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Score Speaker?</TableCell>
                                <TableCell><Checkbox defaultChecked={teamDataState.canScoreSpeaker} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canScoreSpeaker: !!checked })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Score Amp?</TableCell>
                                <TableCell><Checkbox defaultChecked={teamDataState.canScoreAmp} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canScoreAmp: !!checked })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Estimated Teleop Note Cycle</TableCell>
                                <TableCell><Input type="number" className="w-min" min={0} defaultValue={teamDataState.estimatedTeleopNoteCycle} onChange={(e) => setTeamDataState({ ...teamDataState, estimatedTeleopNoteCycle: e.target.valueAsNumber })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Score Speaker Auto?</TableCell>
                                <TableCell><Checkbox defaultChecked={teamDataState.canScoreSpeakerAuto} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canScoreSpeakerAuto: !!checked })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Score Amp Auto?</TableCell>
                                <TableCell><Checkbox defaultChecked={teamDataState.canScoreAmpAuto} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canScoreAmpAuto: !!checked })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Best Auto Notes</TableCell>
                                <TableCell><Input type="number" className="w-min" min={0} defaultValue={teamDataState.speakerAutoNotes} onChange={(e) => setTeamDataState({ ...teamDataState, speakerAutoNotes: e.target.valueAsNumber })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Pass Start Line Auto?</TableCell>
                                <TableCell><Checkbox defaultChecked={teamDataState.canPassStartLineAuto} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canPassStartLineAuto: !!checked })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Climb?</TableCell>
                                <TableCell><Checkbox defaultChecked={teamDataState.canClimb} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canClimb: !!checked })}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Score Trap?</TableCell>
                                <TableCell><Checkbox defaultChecked={teamDataState.canTrap} onCheckedChange={(checked) => setTeamDataState({ ...teamDataState, canTrap: !!checked })}/></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </section>
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
                        <AlertDialogAction onClick={() => {saveCallback(); toast(`Saved Team Data for ${teamNumber}`); setConfirmSave(false)}}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            }
        </>
    )
}