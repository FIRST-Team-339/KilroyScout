"use client";
import { useEventData } from "@/app/context/EventDataContext";
import Savebar from "@/components/savebar";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { MatchData, MatchScoutingData } from "@/lib/eventDataSchemas";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function MatchDetails({
	params: { matchNumber },
}: { params: { matchNumber: string } }) {
	const { eventData, updateData } = useEventData();
	const matchData = eventData?.matches.find(
		(match) => match.matchNumber === Number.parseInt(matchNumber),
	);

	const [showSaveBar, setShowSaveBar] = useState(false);
	const [confirmSave, setConfirmSave] = useState(false);
	const [matchDataState, setMatchDataState] = useState<
		MatchData["scouting"] | undefined
	>();

	const cancelSaveCallback = () => {
		setMatchDataState(matchData!.scouting);
		location.reload();
	};

	const saveCallback = () => {
		updateData({
			...eventData!,
			matches: eventData!.matches.map((match) => {
				if (match.matchNumber === Number.parseInt(matchNumber))
					return {
						...match,
						rankMatchData: true,
						scouting: matchDataState!,
					};

				return match;
			}),
		});
		location.reload();
	};

	useEffect(() => {
		if (!matchData) return;
		setMatchDataState(structuredClone(matchData.scouting));
	}, [matchData]);

	useEffect(() => {
		if (!matchData || !matchDataState) return;
		let valueModified = false;

		matchDataState.blue.forEach((blueMatchDataState, index) => {
			Object.keys(blueMatchDataState.auto).forEach((key) => {
				if (
					blueMatchDataState.auto[key as keyof MatchScoutingData["auto"]] !==
					matchData?.scouting.blue[index].auto[
						key as keyof MatchScoutingData["auto"]
					]
				)
					valueModified = true;
			});

			Object.keys(blueMatchDataState.teleop).forEach((key) => {
				if (
					blueMatchDataState.teleop[
						key as keyof MatchScoutingData["teleop"]
					] !==
					matchData?.scouting.blue[index].teleop[
						key as keyof MatchScoutingData["teleop"]
					]
				)
					valueModified = true;
			});

			if (
				blueMatchDataState.brokeDown !==
				matchData?.scouting.blue[index].brokeDown
			)
				valueModified = true;

			if (
				blueMatchDataState.comments !== matchData?.scouting.blue[index].comments
			)
				valueModified = true;
		});

		matchDataState.red.forEach((redMatchDataState, index) => {
			Object.keys(redMatchDataState.auto).forEach((key) => {
				if (
					redMatchDataState.auto[key as keyof MatchScoutingData["auto"]] !==
					matchData?.scouting.red[index].auto[
						key as keyof MatchScoutingData["auto"]
					]
				)
					valueModified = true;
			});

			Object.keys(redMatchDataState.teleop).forEach((key) => {
				if (
					redMatchDataState.teleop[key as keyof MatchScoutingData["teleop"]] !==
					matchData?.scouting.red[index].teleop[
						key as keyof MatchScoutingData["teleop"]
					]
				)
					valueModified = true;
			});

			if (
				redMatchDataState.brokeDown !== matchData?.scouting.red[index].brokeDown
			)
				valueModified = true;

			if (
				redMatchDataState.comments !== matchData?.scouting.red[index].comments
			)
				valueModified = true;
		});

		setShowSaveBar(valueModified);
	}, [matchData, matchDataState]);

	type DeepPartial<T> = T extends object
		? {
				[P in keyof T]?: DeepPartial<T[P]>;
			}
		: T;

	const mergeMatchData = (
		array: [MatchScoutingData, MatchScoutingData, MatchScoutingData],
		dataToMerge: DeepPartial<MatchScoutingData>,
		index: number,
	): [MatchScoutingData, MatchScoutingData, MatchScoutingData] => {
		const original = array[index];

		array[index] = {
			auto: {
				leave: dataToMerge.auto?.leave ?? original.auto.leave,
				coralL1: dataToMerge.auto?.coralL1 ?? original.auto.coralL1,
				coralL2: dataToMerge.auto?.coralL2 ?? original.auto.coralL2,
				coralL3: dataToMerge.auto?.coralL3 ?? original.auto.coralL3,
				coralL4: dataToMerge.auto?.coralL4 ?? original.auto.coralL4,
				algaeProcessor:
					dataToMerge.auto?.algaeProcessor ?? original.auto.algaeProcessor,
				allianceGotAutoRP:
					dataToMerge.auto?.allianceGotAutoRP ??
					original.auto.allianceGotAutoRP,
			},
			teleop: {
				coralL1: dataToMerge.teleop?.coralL1 ?? original.teleop.coralL1,
				coralL2: dataToMerge.teleop?.coralL2 ?? original.teleop.coralL2,
				coralL3: dataToMerge.teleop?.coralL3 ?? original.teleop.coralL3,
				coralL4: dataToMerge.teleop?.coralL4 ?? original.teleop.coralL4,
				algaeProcessor:
					dataToMerge.teleop?.algaeProcessor ?? original.teleop.algaeProcessor,
				algaeNet: dataToMerge.teleop?.algaeNet ?? original.teleop.algaeNet,
				parked: dataToMerge.teleop?.parked ?? original.teleop.parked,
				shallowCageClimbed:
					dataToMerge.teleop?.shallowCageClimbed ??
					original.teleop.shallowCageClimbed,
				deepCageClimbed:
					dataToMerge.teleop?.deepCageClimbed ??
					original.teleop.deepCageClimbed,
				allianceGotCoralRP:
					dataToMerge.teleop?.allianceGotCoralRP ??
					original.teleop.allianceGotCoralRP,
				allianceGotBargeRP:
					dataToMerge.teleop?.allianceGotBargeRP ??
					original.teleop.allianceGotBargeRP,
				drivingSkill:
					dataToMerge.teleop?.drivingSkill ?? original.teleop.drivingSkill,
			},
			allianceDidCoopertition:
				dataToMerge.allianceDidCoopertition ?? original.allianceDidCoopertition,
			brokeDown: dataToMerge.brokeDown ?? original.brokeDown,
			comments: dataToMerge.comments ?? original.comments,
		};

		return array;
	};

	return (
		<>
			{(!eventData || !matchData) && (
				<span className="text-gray-950 text-2xl w-full text-center font-bold">
					No Event Data to Pull From or Invalid Match #
				</span>
			)}
			{eventData && matchData && matchDataState && (
				<div className="flex flex-col w-full">
					<section className="flex flex-col py-2">
						<span className="font-bold text-3xl text-center">
							Match {matchNumber}
						</span>
					</section>
					<div className="w-full grid grid-cols-2 pb-24 gap-x-24">
						<div className="w-full grid grid-rows-3 gap-y-16">
							{matchData.scouting.blue.map((data, index) => {
								const teamNumber = matchData.blueAllianceTeams[index];

								return (
									<section
										key={teamNumber}
										className="flex flex-col text-gray-950 dark:text-gray-50 space-y-2"
									>
										<Link
											className="text-2xl font-semibold text-blue-700"
											href={`/teams/${teamNumber}`}
										>
											{teamNumber}
										</Link>
										<span className="text-xl font-medium">Autonomous</span>
										<Table>
											<TableBody>
												<TableRow>
													<TableCell>Leave</TableCell>
													<TableCell>
														<Checkbox
															defaultChecked={data.auto.leave}
															onCheckedChange={(checked) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{ auto: { leave: !!checked } },
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L1 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.auto.coralL1}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			auto: { coralL1: e.target.valueAsNumber },
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L1 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.auto.coralL2}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			auto: { coralL2: e.target.valueAsNumber },
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L1 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.auto.coralL3}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			auto: { coralL3: e.target.valueAsNumber },
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L1 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.auto.coralL4}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			auto: { coralL4: e.target.valueAsNumber },
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Algae Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.auto.algaeProcessor}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			auto: {
																				algaeProcessor: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
										<span className="text-xl font-medium">Teleop</span>
										<Table>
											<TableBody>
												<TableRow>
													<TableCell>L1 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.coralL1}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			teleop: {
																				coralL1: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L2 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.coralL2}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			teleop: {
																				coralL2: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L3 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.coralL3}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			teleop: {
																				coralL3: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L4 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.coralL4}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			teleop: {
																				coralL4: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Algae Scored [Processor]</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.algaeProcessor}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			teleop: {
																				algaeProcessor: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Algae Scored [Net]</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.algaeNet}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			teleop: {
																				algaeNet: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Parked</TableCell>
													<TableCell>
														<Checkbox
															defaultChecked={data.teleop.parked}
															onCheckedChange={(checked) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{ teleop: { parked: !!checked } },
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Shallow Cage Climbed</TableCell>
													<TableCell>
														<Checkbox
															defaultChecked={data.teleop.shallowCageClimbed}
															onCheckedChange={(checked) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			teleop: { shallowCageClimbed: !!checked },
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Deep Cage Climbed</TableCell>
													<TableCell>
														<Checkbox
															defaultChecked={data.teleop.deepCageClimbed}
															onCheckedChange={(checked) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{ teleop: { deepCageClimbed: !!checked } },
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>
														Driving Skill (Movability, Defense, etc... rated
														0-5)
													</TableCell>
													<TableCell className="flex flex-row items-center">
														<Input
															type="number"
															className="w-min"
															min={0}
															max={5}
															defaultValue={data.teleop.drivingSkill}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	blue: mergeMatchData(
																		matchDataState.blue,
																		{
																			teleop: {
																				drivingSkill: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
										<span className="text-xl font-medium">Comments</span>
										<Textarea
											defaultValue={data.comments}
											className="resize-y min-h-10 max-h-40"
											onChange={(e) =>
												setMatchDataState({
													...matchDataState,
													blue: mergeMatchData(
														matchDataState.blue,
														{ comments: e.target.value },
														index,
													),
												})
											}
										/>
									</section>
								);
							})}
						</div>
						<div className="w-full grid grid-rows-3 gap-16">
							{matchData.scouting.red.map((data, index) => {
								const teamNumber = matchData.redAllianceTeams[index];

								return (
									<section
										key={teamNumber}
										className="flex flex-col text-gray-950 dark:text-gray-50 space-y-2"
									>
										<Link
											className="text-2xl font-semibold text-red-700"
											href={`/teams/${teamNumber}`}
										>
											{teamNumber}
										</Link>
										<span className="text-xl font-medium">Autonomous</span>
										<Table>
											<TableBody>
												<TableRow>
													<TableCell>Leave</TableCell>
													<TableCell>
														<Checkbox
															defaultChecked={data.auto.leave}
															onCheckedChange={(checked) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{ auto: { leave: !!checked } },
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L1 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.auto.coralL1}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			auto: { coralL1: e.target.valueAsNumber },
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L1 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.auto.coralL2}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			auto: { coralL2: e.target.valueAsNumber },
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L1 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.auto.coralL3}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			auto: { coralL3: e.target.valueAsNumber },
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L1 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.auto.coralL4}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			auto: { coralL4: e.target.valueAsNumber },
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Algae Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.auto.algaeProcessor}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			auto: {
																				algaeProcessor: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
										<span className="text-xl font-medium">Teleop</span>
										<Table>
											<TableBody>
												<TableRow>
													<TableCell>L1 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.coralL1}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			teleop: {
																				coralL1: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L2 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.coralL2}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			teleop: {
																				coralL2: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L3 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.coralL3}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			teleop: {
																				coralL3: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>L4 Coral Scored</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.coralL4}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			teleop: {
																				coralL4: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Algae Scored [Processor]</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.algaeProcessor}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			teleop: {
																				algaeProcessor: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Algae Scored [Net]</TableCell>
													<TableCell>
														<Input
															type="number"
															className="w-min"
															min={0}
															defaultValue={data.teleop.algaeNet}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			teleop: {
																				algaeNet: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Parked</TableCell>
													<TableCell>
														<Checkbox
															defaultChecked={data.teleop.parked}
															onCheckedChange={(checked) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{ teleop: { parked: !!checked } },
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Shallow Cage Climbed</TableCell>
													<TableCell>
														<Checkbox
															defaultChecked={data.teleop.shallowCageClimbed}
															onCheckedChange={(checked) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			teleop: { shallowCageClimbed: !!checked },
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>Deep Cage Climbed</TableCell>
													<TableCell>
														<Checkbox
															defaultChecked={data.teleop.deepCageClimbed}
															onCheckedChange={(checked) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{ teleop: { deepCageClimbed: !!checked } },
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>
														Driving Skill (Movability, Defense, etc... rated
														0-5)
													</TableCell>
													<TableCell className="flex flex-row items-center">
														<Input
															type="number"
															className="w-min"
															min={0}
															max={5}
															defaultValue={data.teleop.drivingSkill}
															onChange={(e) =>
																setMatchDataState({
																	...matchDataState,
																	red: mergeMatchData(
																		matchDataState.red,
																		{
																			teleop: {
																				drivingSkill: e.target.valueAsNumber,
																			},
																		},
																		index,
																	),
																})
															}
														/>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
										<span className="text-xl font-medium">Comments</span>
										<Textarea
											defaultValue={data.comments}
											className="resize-y min-h-10 max-h-40"
											onChange={(e) =>
												setMatchDataState({
													...matchDataState,
													red: mergeMatchData(
														matchDataState.red,
														{ comments: e.target.value },
														index,
													),
												})
											}
										/>
									</section>
								);
							})}
						</div>
					</div>
					<Savebar
						showing={showSaveBar}
						setShowing={setShowSaveBar}
						saveCallback={() => setConfirmSave(true)}
						resetCallback={cancelSaveCallback}
					/>
					<AlertDialog open={confirmSave}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This will save over any and all current team data as it is
									shown to you currently. This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel
									onClick={() => {
										cancelSaveCallback();
										setConfirmSave(false);
									}}
								>
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										saveCallback();
										toast(`Saved Match Data for match ${matchNumber}`);
										setConfirmSave(false);
									}}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}
		</>
	);
}
