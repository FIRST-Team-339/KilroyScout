"use client";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEventData } from "@/hooks/useEventData"
import Link from "next/link";

export default function Event() {
    const [eventData] = useEventData();

    return (
        <>
            {!eventData && <span className="text-gray-950 text-2xl w-full text-center font-bold">No Event Data to Pull From</span>}
            {eventData && 
                <div className="flex flex-col space-y-4">
                    <section className="flex flex-col">
                        <span className="text-2xl font-semibold text-gray-950">{eventData.event.name}</span>
                        <span className="text-lg font-medium text-gray-700">{eventData.event.eventCode.toUpperCase()} &#x2022; Week {eventData.event.weekNumber}</span>
                    </section>
                    <section className="flex flex-col text-lg font-semibold text-gray-950">
                        <span>From: {new Date(eventData.event.dateStart).toLocaleDateString(undefined, {
                            month: "long",
                            day: "2-digit",
                            year: "numeric"
                        })}</span>
                        <span>To: {new Date(eventData.event.dateEnd).toLocaleDateString(undefined, {
                            month: "long",
                            day: "2-digit",
                            year: "numeric"
                        })}</span>
                    </section>
                    <section className="flex flex-col">
                        <span className="text-xl font-semibold text-gray-950">Venue</span>
                        <span className="text-lg text-gray-700">{eventData.event.venue}</span>
                        <span className="text-md text-gray-700">{eventData.event.location}</span>
                    </section>
                    <Table id="teams">
                        <TableCaption>Teams Attending</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Robot Name</TableHead>
                                <TableHead>Rookie Year</TableHead>
                                <TableHead>Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {eventData.teams.map(team => (
                                <TableRow key={team.teamNumber}>
                                    <TableCell className="font-medium"><Link href={`/teams/${team.teamNumber}`}>{team.teamNumber}</Link></TableCell>
                                    <TableCell>{team.name}</TableCell>
                                    <TableCell>{team.robotName}</TableCell>
                                    <TableCell>{team.rookieYear}</TableCell>
                                    <TableCell>{team.location}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            }
        </>
    )
}