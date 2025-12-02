import { ProductionSidebar } from "@/components/layout/production-sidebar"

export default function ProductionLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <ProductionSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}
