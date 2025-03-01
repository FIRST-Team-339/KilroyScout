"use client";

import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { ReactNode } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";

type PiechartProps<D extends string, N extends string> = {
	title: string;
	description: string;
	dataKey: D;
	nameKey: N;
	chartData: Array<Record<D, number> & Record<N, string> & { fill: string }>;
};

export default function Piechart<D extends string, N extends string>({
	title,
	description,
	dataKey,
	nameKey,
	chartData,
}: PiechartProps<D, N>) {
	const chartConfig: ChartConfig = {
		[dataKey.toLowerCase()]: {
			label: capitalizeFirstLetter(dataKey),
		},
	};

	chartData.forEach((piece) => {
		chartConfig[piece[nameKey]] = {
			label: capitalizeFirstLetter(piece[nameKey]),
			color: "",
		};
	});

	const largestIndex = chartData.reduce(
		(largest, current, index) =>
			current[dataKey] > chartData[largest][dataKey] ? index : largest,
		0,
	);

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey={dataKey}
							nameKey={nameKey}
							innerRadius={60}
							strokeWidth={5}
							activeIndex={largestIndex}
							activeShape={({
								outerRadius = 0,
								...props
							}: PieSectorDataItem) => (
								<Sector {...props} outerRadius={outerRadius + 10} />
							)}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="leading-none text-muted-foreground">
					Leading Value:{" "}
					{capitalizeFirstLetter(chartData[largestIndex][nameKey])}
				</div>
			</CardFooter>
		</Card>
	);
}
