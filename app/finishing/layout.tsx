import { FinishingSidebar } from "@/components/layout/finishing-sidebar"

export default function FinishingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <FinishingSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}
