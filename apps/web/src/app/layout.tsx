import Sidebar from "@/components/sidebar"
import { Metadata } from "next"
import "@/styles/globals.css"
import { Toaster } from "sonner"

export const metadata: Metadata = {
    title: 'Kilroy Scout',
    description: 'Who\'s scouting? Kilroy is scouting!',
    icons: "/kilroy.png"
}

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body className="min-h-screen flex">
          <Sidebar />
          <main className="h-screen w-full p-8 flex overflow-scroll">
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    )
  }