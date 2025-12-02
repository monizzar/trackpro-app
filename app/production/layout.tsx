import { ProductionSidebar } from "@/components/layout/production-sidebar"
import { requireRole } from "@/lib/auth-helpers"

export default async function ProductionLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await requireRole(["KEPALA_PRODUKSI"])

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <ProductionSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}
