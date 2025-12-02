"use client"

import { Box, TrendingUp, AlertCircle, CheckCircle, Clock, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ProductionDashboard() {
    const activeBatches = [
        { id: 1, code: "PROD-20241202-001", product: "Kaos Premium", target: 100, completed: 35, stage: "Pemotongan", status: "on_track" },
        { id: 2, code: "PROD-20241202-002", product: "Kemeja Formal", target: 50, completed: 20, stage: "Penjahitan", status: "on_track" },
        { id: 3, code: "PROD-20241201-005", product: "Jaket Hoodie", target: 75, completed: 50, stage: "Finishing", status: "on_track" },
    ]

    const pendingVerification = [
        { id: 1, code: "PROD-20241201-004", stage: "Pemotongan", worker: "Ahmad", time: "10 menit lalu" },
        { id: 2, code: "PROD-20241201-003", stage: "Penjahitan", worker: "Siti", time: "25 menit lalu" },
    ]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Production Dashboard</h2>
                    <p className="text-muted-foreground">
                        Monitor dan kelola proses produksi
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Batch Aktif
                        </CardTitle>
                        <Box className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">
                            Dalam proses produksi
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Perlu Verifikasi
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">{pendingVerification.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Menunggu approval
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Selesai Hari Ini
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            Batch completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Produktivitas
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94%</div>
                        <p className="text-xs text-muted-foreground">
                            +5% dari minggu lalu
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Active Batches */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Batch Produksi Aktif</CardTitle>
                        <CardDescription>
                            Progress batch yang sedang berjalan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {activeBatches.map((batch) => (
                                <div key={batch.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-mono text-sm font-medium">{batch.code}</p>
                                            <p className="text-sm text-muted-foreground">{batch.product}</p>
                                        </div>
                                        <Badge>{batch.stage}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Progress value={(batch.completed / batch.target) * 100} className="flex-1" />
                                        <span className="text-sm text-muted-foreground">
                                            {batch.completed}/{batch.target}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Verification */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Perlu Verifikasi</CardTitle>
                        <CardDescription>
                            Hasil kerja menunggu approval
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pendingVerification.map((item) => (
                                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                                        <Clock className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-mono text-sm font-medium">{item.code}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.stage} • {item.worker}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Workers Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Status Pekerja</CardTitle>
                    <CardDescription>Ringkasan aktivitas tim produksi</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-3 p-4 rounded-lg border">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">5</p>
                                <p className="text-sm text-muted-foreground">Pemotong Aktif</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-lg border">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">8</p>
                                <p className="text-sm text-muted-foreground">Penjahit Aktif</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-lg border">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">3</p>
                                <p className="text-sm text-muted-foreground">Finishing Aktif</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
