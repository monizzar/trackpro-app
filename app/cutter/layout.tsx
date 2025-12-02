import { CutterSidebar } from "@/components/layout/cutter-sidebar"

export default function CutterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <CutterSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}
