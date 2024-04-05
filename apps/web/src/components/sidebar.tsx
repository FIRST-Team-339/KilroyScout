"use client";
import Image from "next/image";
import KilroyTransparent from "../../public/kilroytrnspr.png"
import Link from "next/link";
import { CalendarIcon, ClockIcon, HomeIcon, TrophyIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export default function Sidebar() {
    const navs = [
        {
            label: "Home",
            href: "/",
            icon: HomeIcon,
        },
        {
            label: "Event Info",
            href: "/event",
            icon: CalendarIcon,
        },
        {
            label: "Matches",
            href: "/matches",
            icon: ClockIcon,
        },
        {
            label: "Rankings",
            href: "/rankings",
            icon: TrophyIcon,
        }
    ]

    const [isDark, setIsDark] = useLocalStorage("isDark", false);

    useEffect(() => {
        if (isDark) window.document.documentElement.classList.add("dark");
        if (!isDark) window.document.documentElement.classList.remove("dark");
    }, [isDark])

    return (
        <aside className="w-64 min-h-screen bg-orange-50 dark:bg-orange-500 drop-shadow-lg flex flex-col">
            <div className="flex justify-center">
                <Image src={KilroyTransparent} alt="Kilroy Logo" className="w-24 h-24"/>
            </div>
            <nav className="flex flex-col flex-grow">
                {navs.map(nav => (<Link href={nav.href} key={nav.label} className="flex group gap-x-3 rounded-md px-4 py-3 text-md font-semibold leading-6 awf items-center">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-orange-200 group-hover:border-orange-300 bg-orange-300 group-hover:bg-orange-400 font-medium text-gray-50 group-hover:text-gray-100">
                        <nav.icon className="h-6 w-6"/>
                    </span>
                    <span className="overflow-hidden text-gray-800 group-hover:text-gray-950 dark:text-gray-100 dark:group-hover:text-gray-200">{nav.label}</span>
                </Link>))}
            </nav>
            <div className="flex items-center space-x-2 p-4">
                <Switch id="dark-mode" onClick={() => setIsDark(!isDark)} checked={isDark} className=""/>
                <Label htmlFor="dark-mode" className="text-gray-950 dark:text-gray-50">Dark Mode</Label>
            </div>
        </aside>
    )
}