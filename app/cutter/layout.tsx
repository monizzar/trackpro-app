import { CutterSidebar } from "@/components/layout/cutter-sidebar"
import { requireRole } from "@/lib/auth-helpers"

export default async function CutterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await requireRole(["PEMOTONG"])

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <CutterSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}
