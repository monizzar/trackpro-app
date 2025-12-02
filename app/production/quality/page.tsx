"use client"

import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function QualityControlPage() {
    const pendingVerification = [
        { id: 1, code: "PROD-20241201-004", stage: "Pemotongan", worker: "Ahmad", product: "Kaos Premium", qty: 100, time: "10 menit lalu" },
        { id: 2, code: "PROD-20241201-003", stage: "Penjahitan", worker: "Siti", product: "Kemeja Formal", qty: 50, time: "25 menit lalu" },
    ]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Kontrol Kualitas</h2>
                    <p className="text-muted-foreground">
                        Verifikasi hasil produksi dari setiap tahap
                    </p>
                </div>
            </div>

            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Perlu Verifikasi</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingVerification.length}</div>
                        <p className="text-xs text-muted-foreground">Item menunggu</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Disetujui Hari Ini</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">15</div>
                        <p className="text-xs text-muted-foreground">Verifikasi passed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reject Rate</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.3%</div>
                        <p className="text-xs text-muted-foreground">-0.5% dari minggu lalu</p>
                    </CardContent>
                </Card>
            </div>

            {/* Verification Queue */}
            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending">Pending Verifikasi ({pendingVerification.length})</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    {pendingVerification.map((item) => (
                        <Card key={item.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-mono">{item.code}</CardTitle>
                                        <CardDescription>{item.product}</CardDescription>
                                    </div>
                                    <Badge variant="secondary">{item.stage}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Pekerja</p>
                                        <p className="font-medium">{item.worker}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Quantity</p>
                                        <p className="font-medium">{item.qty} pcs</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Waktu</p>
                                        <p className="font-medium">{item.time}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button className="flex-1">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Setujui
                                    </Button>
                                    <Button variant="destructive" className="flex-1">
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="approved">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Riwayat approved akan ditampilkan di sini</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rejected">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Riwayat rejected akan ditampilkan di sini</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
