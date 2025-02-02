"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventData, eventDataSchema, useEventData } from "@/hooks/useEventData";
import { initEvent } from "./actions";
import { useFormState } from "react-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import Loading from "@/components/loading";
import { toast } from "sonner";
import { search } from "@/lib/bluetooth";

export default function Home() {
  const [eventData, setEventData] = useEventData();
  const [eventCode, setEventCode] = useState(eventData?.event.eventCode ?? "");
  const [initEventState, initEventAction, pending] = useFormState(initEvent, eventData);
  const [importEventState, setImportEventState] = useState<EventData | null>(null);
  const [confirmSetEvent, setConfirmSetEvent] = useState(false);
  const [confirmImportEvent, setConfirmImportEvent] = useState(false);

  useEffect(() => {
    if (initEventState == null) {
      toast.error(`Invalid/No Data from event code ${eventCode}`)
      return;
    }

    if ((initEventState?.event.eventCode !== eventData?.event.eventCode) || eventData == null) {
      setConfirmSetEvent(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initEventState])

  const importData = (event: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files![0], "UTF-8");
    fileReader.onload = event => {
      const data = eventDataSchema.safeParse(JSON.parse(event.target?.result as string));

      if (data.success) {
        setImportEventState(data.data);
        setConfirmImportEvent(true);
      } else {
        toast.error(`Error importing data: ${data.error.message}`)
      }
    };
  }

  const exportData = () => {
    if (eventData) {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(eventData)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = `${eventData.event.eventCode}.scouting.json`;

      link.click();
      toast("Data exported!")
    } else {
      toast.error("Invalid/No Event Data to export");
    }
  }

  return (
    <>
      <AlertDialog open={confirmSetEvent}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will override all event data. If you haven&apos;t already exported the data and you need to. Please do so and try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmSetEvent(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setConfirmSetEvent(false); setEventData(initEventState); toast(`Initialized event data using event code ${initEventState?.event.eventCode.toUpperCase() ?? ""}`) }}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={confirmImportEvent}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will override all event data. If you haven&apos;t already exported the data and you need to. Please do so and try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmImportEvent(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setConfirmImportEvent(false); setEventData(importEventState); setEventCode(importEventState?.event.eventCode.toUpperCase() ?? eventCode); toast(`Imported event data from file with event code ${importEventState?.event.eventCode ?? ""}`) }}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex flex-col space-y-4">
        <section>
          <span className="text-2xl font-semibold">Event</span>
          <form className="pt-4 flex" action={initEventAction}>
            <Input name="eventCode" type="text" placeholder="Type Event Code" value={eventCode} onChange={(e) => setEventCode(e.target.value)} />
            <Button type="submit" className="ml-2" disabled={pending}>{pending && <Loading />}Set Event</Button>
          </form>
        </section>
        <section className="flex flex-col space-y-2">
          <span className="text-2xl font-semibold">Data</span>
          <Button type="button" onClick={() => document.getElementById("import")?.click()}>Import Data</Button>
          <Input id="import" type="file" className="hidden" accept=".scouting.json" onChange={importData} />
          <Button type="button" onClick={exportData}>Export Data</Button>
        </section>
        <section className="flex flex-col space-y-2">
          <span className="text-2xl font-semibold">Sync</span>
          <Button type="button" onClick={() => search(navigator.bluetooth)}>Scan For Devices</Button>
        </section>
      </div>
    </>
  )
}