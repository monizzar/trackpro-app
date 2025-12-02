"use client"

import { Scissors, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function CutterDashboard() {
    const stats = [
        { title: "Batch Aktif", value: "2", subtitle: "Sedang dikerjakan", icon: Scissors },
        { title: "Selesai Hari Ini", value: "3", subtitle: "+1 dari kemarin", icon: CheckCircle },
        { title: "Total Progress", value: "65%", subtitle: "Target hari ini", icon: Clock },
    ]

    const activeBatches = [
        { code: "PROD-20241202-001", product: "Kaos Premium", target: 100, completed: 35, deadline: "2 Des 2024 - 17:00" },
        { code: "PROD-20241202-003", product: "Kemeja Formal", target: 50, completed: 20, deadline: "3 Des 2024 - 12:00" },
    ]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard Pemotong</h2>
                    <p className="text-muted-foreground">
                        Kelola pekerjaan pemotongan Anda
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Active Batches */}
            <Card>
                <CardHeader>
                    <CardTitle>Batch Aktif</CardTitle>
                    <CardDescription>Pekerjaan pemotongan yang sedang berlangsung</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {activeBatches.map((batch) => (
                        <div key={batch.code} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-mono text-sm font-medium">{batch.code}</p>
                                    <p className="text-sm text-muted-foreground">{batch.product}</p>
                                </div>
                                <Badge variant="secondary">Pemotongan</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress: {batch.completed}/{batch.target} pcs</span>
                                <span className="text-muted-foreground">{Math.round((batch.completed / batch.target) * 100)}%</span>
                            </div>
                            <Progress value={(batch.completed / batch.target) * 100} />
                            <p className="text-xs text-muted-foreground">Deadline: {batch.deadline}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Panduan Kerja</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <p>Ambil material dari gudang sesuai alokasi</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <p>Lakukan pemotongan sesuai pola yang ditentukan</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <p>Update progress secara berkala</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <p>Submit untuk verifikasi setelah selesai</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
