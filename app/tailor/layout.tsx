import { TailorSidebar } from "@/components/layout/tailor-sidebar"
import { requireRole } from "@/lib/auth-helpers"

export default async function TailorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await requireRole(["PENJAHIT"])

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <TailorSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}
