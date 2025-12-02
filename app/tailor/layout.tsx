import { TailorSidebar } from "@/components/layout/tailor-sidebar"

export default function TailorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <TailorSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}
