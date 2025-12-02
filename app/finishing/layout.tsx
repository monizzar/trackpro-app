import { FinishingSidebar } from "@/components/layout/finishing-sidebar"
import { requireRole } from "@/lib/auth-helpers"

export default async function FinishingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await requireRole(["FINISHING"])

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <FinishingSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}
