"use client"

import { Package, TrendingDown, TrendingUp, AlertTriangle, Box } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function WarehouseDashboard() {
    const alerts = [
        { id: 1, material: "Kain Katun Premium", stock: 15, min: 50, status: "critical" },
        { id: 2, material: "Benang Jahit", stock: 45, min: 100, status: "low" },
    ]

    const recentActivity = [
        { id: 1, action: "Stok Masuk", material: "Kain Polyester", qty: 200, date: "2 Des 2024, 10:30" },
        { id: 2, action: "Alokasi Batch", material: "Kancing Plastik", qty: 500, batch: "PROD-20241202-001", date: "2 Des 2024, 09:15" },
        { id: 3, action: "Stok Keluar", material: "Benang Jahit", qty: 50, batch: "PROD-20241201-003", date: "1 Des 2024, 15:45" },
    ]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Warehouse Dashboard</h2>
                    <p className="text-muted-foreground">
                        Monitor dan kelola stok bahan baku
                    </p>
                </div>
                {/* Color Test Badge */}
                <Badge className="bg-primary text-primary-foreground">
                    New Theme Active
                </Badge>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Bahan Baku
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">
                            Jenis bahan aktif
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Stok Kritis
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">2</div>
                        <p className="text-xs text-muted-foreground">
                            Perlu segera restock
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Stok Masuk Hari Ini
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">
                            Transaksi masuk
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Alokasi Pending
                        </CardTitle>
                        <Box className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">
                            Permintaan menunggu
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Stock Alerts */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Stock Alerts</CardTitle>
                        <CardDescription>
                            Bahan baku yang perlu perhatian
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {alerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900"
                                >
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                                        <div>
                                            <p className="font-medium">{alert.material}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Stok: {alert.stock} | Minimum: {alert.min}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="destructive">
                                        {alert.status === "critical" ? "Kritis" : "Rendah"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Aktivitas Terkini</CardTitle>
                        <CardDescription>
                            Transaksi stok terbaru
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                        <Package className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {activity.material} • {activity.qty} unit
                                        </p>
                                        {activity.batch && (
                                            <p className="text-xs text-muted-foreground">
                                                Batch: {activity.batch}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
