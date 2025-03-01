"use client";
import { useEventData } from "../context/EventDataContext";
import Piechart from "./piechart";
import Barchart from "./barchart";
import Colors from "tailwindcss/colors";

export default function Analytics() {
	const { eventData } = useEventData();

	const drivetrain = {
		swerve: 0,
		mecanum: 0,
		tank: 0,
		other: 0,
	};

	const programmingLanguage = {
		java: 0,
		kotlin: 0,
		cpp: 0,
		python: 0,
	};

	const scoring = {
		coral: 0,
		algae: 0,
		none: 0,
	};

	const autoScoring = {
		coral: 0,
		algae: 0,
		leave: 0,
		none: 0,
	};

	const maxCoralScoringLevels = [0, 0, 0, 0, 0];

	const averageCoralCycles: number[] = [];

	const mostCoralCycles: number[] = [];

	const maxCoralScoredInAutos: number[] = [];

	const endgame = {
		deepClimb: 0,
		shallowClimb: 0,
		parkingOnly: 0,
	};

	eventData?.teams.forEach((team) => {
		const {
			drivetrain: drivetrainType,
			programmingLanguage: programmingLanguageType,
			canScoreCoral,
			canScoreAlgae,
			maxCoralScoringLevel,
			averageCoralCycled,
			mostCoralCycled,
			maxCoralScoredInAuto,
			canScoreCoralInAuto,
			canScoreAlgaeInAuto,
			canLeaveInAuto,
			canDeepCageClimb,
			canShallowCageClimb,
		} = team.scouting;
		if (drivetrainType !== "") drivetrain[drivetrainType]++;

		if (programmingLanguageType !== "")
			programmingLanguage[programmingLanguageType]++;

		if (canScoreCoral) scoring.coral++;
		if (canScoreAlgae) scoring.algae++;
		if (!canScoreCoral && !canScoreAlgae) scoring.none++;

		maxCoralScoringLevels[maxCoralScoringLevel]++;

		if (
			Number.isNaN(averageCoralCycles[averageCoralCycled]) ||
			averageCoralCycles[averageCoralCycled] === undefined
		)
			averageCoralCycles[averageCoralCycled] = 1;
		else averageCoralCycles[averageCoralCycled]++;

		if (
			Number.isNaN(mostCoralCycles[mostCoralCycled]) ||
			mostCoralCycles[mostCoralCycled] === undefined
		)
			mostCoralCycles[mostCoralCycled] = 1;
		else mostCoralCycles[mostCoralCycled]++;

		if (
			Number.isNaN(maxCoralScoredInAutos[maxCoralScoredInAuto]) ||
			maxCoralScoredInAutos[maxCoralScoredInAuto] === undefined
		)
			maxCoralScoredInAutos[maxCoralScoredInAuto] = 1;
		else maxCoralScoredInAutos[maxCoralScoredInAuto]++;

		if (canScoreCoralInAuto) autoScoring.coral++;
		if (canScoreAlgaeInAuto) autoScoring.algae++;
		if (canLeaveInAuto) autoScoring.leave++;
		if (!canScoreCoral && !canScoreAlgae && !canLeaveInAuto) autoScoring.none++;

		if (canDeepCageClimb) endgame.deepClimb++;
		if (canShallowCageClimb) endgame.shallowClimb++;
		if (!canDeepCageClimb && !canShallowCageClimb) endgame.parkingOnly++;
	});

	return (
		<div>
			<section>
				<span className="text-2xl font-semibold">Team Analytics</span>
				<div className="grid grid-cols-5 gap-4 py-8">
					<Piechart
						title="Robot Drivetrain"
						description=""
						dataKey="amount"
						nameKey="drivetrain"
						chartData={[
							{
								amount: drivetrain.swerve,
								drivetrain: "swerve",
								fill: Colors.indigo[500],
							},
							{
								amount: drivetrain.mecanum,
								drivetrain: "mecanum",
								fill: Colors.cyan[500],
							},
							{
								amount: drivetrain.tank,
								drivetrain: "tank",
								fill: Colors.red[500],
							},
							{
								amount: drivetrain.other,
								drivetrain: "other",
								fill: Colors.gray[800],
							},
						]}
					/>
					<Piechart
						title="Programming Language"
						description=""
						dataKey="amount"
						nameKey="language"
						chartData={[
							{
								amount: programmingLanguage.java,
								language: "Java",
								fill: Colors.orange[700],
							},
							{
								amount: programmingLanguage.kotlin,
								language: "Kotlin",
								fill: Colors.purple[500],
							},
							{
								amount: programmingLanguage.cpp,
								language: "c++",
								fill: Colors.cyan[500],
							},
							{
								amount: programmingLanguage.python,
								language: "python",
								fill: Colors.green[500],
							},
						]}
					/>
					<Barchart
						title="Scoring Mechanisms"
						description=""
						dataKey="amount"
						nameKey="scoring"
						chartData={[
							{
								amount: scoring.coral,
								scoring: "coral",
								fill: Colors.blue[500],
							},
							{
								amount: scoring.algae,
								scoring: "algae",
								fill: Colors.cyan[500],
							},
							{
								amount: scoring.none,
								scoring: "none",
								fill: Colors.gray[800],
							},
						]}
					/>
					<Barchart
						title="Max Coral Scoring Level"
						description=""
						dataKey="amount"
						nameKey="maxCoralScoringLevel"
						chartData={[
							{
								amount: maxCoralScoringLevels[4],
								maxCoralScoringLevel: "L4",
								fill: Colors.orange[400],
							},
							{
								amount: maxCoralScoringLevels[3],
								maxCoralScoringLevel: "L3",
								fill: Colors.green[500],
							},
							{
								amount: maxCoralScoringLevels[2],
								maxCoralScoringLevel: "L2",
								fill: Colors.yellow[500],
							},
							{
								amount: maxCoralScoringLevels[1],
								maxCoralScoringLevel: "L1",
								fill: Colors.blue[500],
							},
							{
								amount: maxCoralScoringLevels[0],
								maxCoralScoringLevel: "0 (No Coral)",
								fill: Colors.gray[800],
							},
						]}
					/>
					<Barchart
						title="Average Coral Cycled"
						description=""
						dataKey="amount"
						nameKey="averageCoralCycled"
						chartData={averageCoralCycles
							.map((amount, index) => {
								return {
									amount: amount,
									averageCoralCycled: index.toString(),
									fill: Colors.gray[400],
								};
							})
							.filter((data) => data.amount !== 0)
							.sort((a, b) => b.amount - a.amount)}
					/>
					<Barchart
						title="Most Coral Cycled"
						description=""
						dataKey="amount"
						nameKey="mostCoralCycled"
						chartData={mostCoralCycles
							.map((amount, index) => {
								return {
									amount: amount,
									mostCoralCycled: index.toString(),
									fill: Colors.gray[400],
								};
							})
							.filter((data) => data.amount !== 0)
							.sort((a, b) => b.amount - a.amount)}
					/>
					<Barchart
						title="Max Coral Scored in Auto"
						description=""
						dataKey="amount"
						nameKey="maxCoralScoredInAuto"
						chartData={maxCoralScoredInAutos
							.map((amount, index) => {
								return {
									amount: amount,
									maxCoralScoredInAuto: index.toString(),
									fill: Colors.gray[400],
								};
							})
							.filter((data) => data.amount !== 0)
							.sort((a, b) => b.amount - a.amount)}
					/>
					<Barchart
						title="Auto Scoring Capabilities"
						description=""
						dataKey="amount"
						nameKey="scoring"
						chartData={[
							{
								amount: autoScoring.coral,
								scoring: "coral",
								fill: Colors.blue[500],
							},
							{
								amount: autoScoring.algae,
								scoring: "algae",
								fill: Colors.cyan[500],
							},
							{
								amount: autoScoring.leave,
								scoring: "leave",
								fill: Colors.yellow[500],
							},
							{
								amount: autoScoring.none,
								scoring: "none",
								fill: Colors.gray[800],
							},
						]}
					/>
					<Barchart
						title="Endgame Capabilities"
						description=""
						dataKey="amount"
						nameKey="endgame"
						chartData={[
							{
								amount: endgame.deepClimb,
								endgame: "Deep Climb",
								fill: Colors.red[600],
							},
							{
								amount: endgame.shallowClimb,
								endgame: "Shallow Climb",
								fill: Colors.cyan[500],
							},
							{
								amount: endgame.parkingOnly,
								endgame: "Parking Only",
								fill: Colors.gray[300],
							},
						]}
					/>
				</div>
			</section>
			<section>
				<span className="text-2xl font-semibold">Match Analytics</span>
			</section>
		</div>
	);
}
