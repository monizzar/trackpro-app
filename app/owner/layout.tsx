import { Sidebar } from "@/components/layout/sidebar"
import { requireRole } from "@/lib/auth-helpers"

export default async function OwnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await requireRole(["OWNER"])

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}
