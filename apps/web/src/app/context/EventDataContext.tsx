// app/context/EventDataContext.tsx
"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useTransition,
} from "react";
import { getEventData, updateEventData } from "@/app/actions";
import type { EventData } from "@/lib/eventDataSchemas";

type EventDataContextType = {
	eventData: EventData | null;
	updateData: (newData: EventData) => void;
	isPending: boolean;
};

// Context for event data
const EventDataContext = createContext<EventDataContextType>(null!);

// Provider component
export function EventDataProvider({ children }: { children: React.ReactNode }) {
	const [eventData, setEventData] = useState<EventData | null>(null);
	const [isPending, startTransition] = useTransition();

	// Fetch event data on mount
	useEffect(() => {
		getEventData().then(setEventData);
	}, []);

	// Function to update event data
	const updateData = (newData: EventData) => {
		startTransition(() => {
			updateEventData(newData).then((updated) => {
				setEventData(newData);
			});
		});
	};

	return (
		<EventDataContext.Provider value={{ eventData, updateData, isPending }}>
			{children}
		</EventDataContext.Provider>
	);
}

// Hook for accessing event data
export function useEventData() {
	return useContext(EventDataContext);
}
