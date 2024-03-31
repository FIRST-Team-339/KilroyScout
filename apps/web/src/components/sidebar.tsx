import Image from "next/image";
import KilroyTransparent from "../../public/kilroytrnspr.png"
import Link from "next/link";
import { ArrowPathIcon, CalendarIcon, ClockIcon, HomeIcon, TrophyIcon } from "@heroicons/react/16/solid";

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

    return (
        <aside className="w-64 min-h-screen bg-orange-50 drop-shadow-lg">
            <div className="flex justify-center">
                <Image src={KilroyTransparent} alt="Kilroy Logo" className="w-24 h-24"/>
            </div>
            <nav className="flex flex-col">
                {navs.map(nav => (<Link href={nav.href} key={nav.label} className="flex group gap-x-3 rounded-md px-4 py-3 text-md font-semibold leading-6 awf items-center">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-orange-200 group-hover:border-orange-300 bg-orange-300 group-hover:bg-orange-400 font-medium text-gray-50 group-hover:text-gray-100">
                        <nav.icon className="h-6 w-6"/>
                    </span>
                    <span className="overflow-hidden text-gray-800 group-hover:text-gray-950">{nav.label}</span>
                </Link>))}
            </nav>
        </aside>
    )
}