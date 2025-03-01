"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
import { capitalizeFirstLetter } from "@/lib/utils";

type BarchartProps<D extends string, N extends string> = {
	title: string;
	description: string;
	dataKey: D;
	nameKey: N;
	chartData: Array<Record<D, number> & Record<N, string> & { fill: string }>;
};

export default function BarchartProps<D extends string, N extends string>({
	title,
	description,
	dataKey,
	nameKey,
	chartData,
}: BarchartProps<D, N>) {
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
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart
						accessibilityLayer
						data={chartData}
						layout="vertical"
						margin={{
							left: 0,
						}}
					>
						<YAxis
							dataKey={nameKey}
							type="category"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) =>
								chartConfig[value as keyof typeof chartConfig]?.label as string
							}
						/>
						<XAxis dataKey={dataKey} type="number" hide />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar dataKey={dataKey} layout="vertical" radius={5} />
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="leading-none text-muted-foreground">
					Leading Value:{" "}
					{chartData.length > 0
						? capitalizeFirstLetter(chartData[largestIndex][nameKey])
						: "N/A"}
				</div>
			</CardFooter>
		</Card>
	);
}
