"use client"

import { Box, Search, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MaterialAllocationPage() {
    const requests = [
        {
            id: 1,
            batchCode: "PROD-20241202-001",
            product: "Kaos Premium",
            qty: 100,
            status: "pending",
            requestedBy: "Kepala Produksi",
            date: "2 Des 2024, 09:00"
        },
        {
            id: 2,
            batchCode: "PROD-20241202-002",
            product: "Kemeja Formal",
            qty: 50,
            status: "pending",
            requestedBy: "Kepala Produksi",
            date: "2 Des 2024, 10:30"
        },
    ]

    const allocated = [
        {
            id: 3,
            batchCode: "PROD-20241201-005",
            product: "Jaket Hoodie",
            qty: 75,
            status: "allocated",
            allocatedAt: "1 Des 2024, 14:20"
        },
        {
            id: 4,
            batchCode: "PROD-20241201-004",
            product: "Kaos Premium",
            qty: 100,
            status: "in_production",
            allocatedAt: "1 Des 2024, 10:15"
        },
    ]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Alokasi Bahan</h2>
                    <p className="text-muted-foreground">
                        Kelola permintaan dan alokasi bahan untuk batch produksi
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Permintaan Pending</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{requests.length}</div>
                        <p className="text-xs text-muted-foreground">Menunggu alokasi</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dialokasikan Hari Ini</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">Batch teralokasi</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dalam Produksi</CardTitle>
                        <Box className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Batch aktif</p>
                    </CardContent>
                </Card>
            </div>

            {/* Allocation Tabs */}
            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending">
                        Permintaan Pending ({requests.length})
                    </TabsTrigger>
                    <TabsTrigger value="allocated">
                        Teralokasi
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        Riwayat
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Permintaan Alokasi Bahan</CardTitle>
                            <CardDescription>Batch produksi yang menunggu alokasi bahan</CardDescription>
                            <div className="relative mt-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Cari batch..." className="pl-10" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kode Batch</TableHead>
                                            <TableHead>Produk</TableHead>
                                            <TableHead>Target Qty</TableHead>
                                            <TableHead>Diminta Oleh</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {requests.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell className="font-mono text-sm font-medium">
                                                    {request.batchCode}
                                                </TableCell>
                                                <TableCell>{request.product}</TableCell>
                                                <TableCell>{request.qty} pcs</TableCell>
                                                <TableCell>{request.requestedBy}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {request.date}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        Pending
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm">
                                                        Alokasikan
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="allocated" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Batch Teralokasi</CardTitle>
                            <CardDescription>Batch yang sudah mendapat alokasi bahan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kode Batch</TableHead>
                                            <TableHead>Produk</TableHead>
                                            <TableHead>Target Qty</TableHead>
                                            <TableHead>Dialokasi Pada</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allocated.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-mono text-sm font-medium">
                                                    {item.batchCode}
                                                </TableCell>
                                                <TableCell>{item.product}</TableCell>
                                                <TableCell>{item.qty} pcs</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {item.allocatedAt}
                                                </TableCell>
                                                <TableCell>
                                                    {item.status === "allocated" && (
                                                        <Badge>
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Teralokasi
                                                        </Badge>
                                                    )}
                                                    {item.status === "in_production" && (
                                                        <Badge variant="secondary">
                                                            <Box className="h-3 w-3 mr-1" />
                                                            Produksi
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Riwayat alokasi akan ditampilkan di sini</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
