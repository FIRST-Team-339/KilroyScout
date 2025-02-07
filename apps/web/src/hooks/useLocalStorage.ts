"use client";
import { useState } from "react";

export const useLocalStorage = <S>(
	key: string,
	defaultValue: S,
): [S, (value: S) => void] => {
	// Create state variable to store
	// localStorage value in state
	const [localStorageValue, setLocalStorageValue] = useState<S>(() => {
		if (typeof window === "undefined") return defaultValue;
		try {
			const value = localStorage.getItem(key);
			// If value is already present in
			// localStorage then return it

			// Else set default value in
			// localStorage and then return it
			if (value) {
				return JSON.parse(value);
			}

			localStorage.setItem(key, JSON.stringify(defaultValue));
			return defaultValue;
		} catch (error) {
			localStorage.setItem(key, JSON.stringify(defaultValue));
			return defaultValue;
		}
	});

	// this method update our localStorage and our state
	const setLocalStorageStateValue = (value: S) => {
		localStorage.setItem(key, JSON.stringify(value));
		setLocalStorageValue(value);
	};
	return [localStorageValue, setLocalStorageStateValue];
};
