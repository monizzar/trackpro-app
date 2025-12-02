import { WarehouseSidebar } from "@/components/layout/warehouse-sidebar"
import { requireRole } from "@/lib/auth-helpers"

export default async function WarehouseLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await requireRole(["KEPALA_GUDANG"])

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <WarehouseSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}
