"use client"

import { Plus, Search, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BatchManagementPage() {
    const batches = [
        { id: 1, code: "PROD-20241202-001", product: "Kaos Premium", target: 100, status: "in_progress", stage: "Pemotongan", date: "2 Des 2024" },
        { id: 2, code: "PROD-20241202-002", product: "Kemeja Formal", target: 50, status: "in_progress", stage: "Penjahitan", date: "2 Des 2024" },
        { id: 3, code: "PROD-20241201-005", product: "Jaket Hoodie", target: 75, status: "completed", stage: "Selesai", date: "1 Des 2024" },
    ]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manajemen Batch</h2>
                    <p className="text-muted-foreground">
                        Kelola batch produksi dan penjadwalan
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Batch Baru
                </Button>
            </div>

            <Tabs defaultValue="active" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="active">Batch Aktif</TabsTrigger>
                    <TabsTrigger value="completed">Selesai</TabsTrigger>
                    <TabsTrigger value="all">Semua Batch</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Batch Produksi Aktif</CardTitle>
                            <CardDescription>Batch yang sedang dalam proses produksi</CardDescription>
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
                                            <TableHead>Target</TableHead>
                                            <TableHead>Tahap</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {batches.filter(b => b.status === "in_progress").map((batch) => (
                                            <TableRow key={batch.id}>
                                                <TableCell className="font-mono text-sm font-medium">
                                                    {batch.code}
                                                </TableCell>
                                                <TableCell>{batch.product}</TableCell>
                                                <TableCell>{batch.target} pcs</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{batch.stage}</Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {batch.date}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge>In Progress</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
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

                <TabsContent value="completed">
                    <Card>
                        <CardHeader>
                            <CardTitle>Batch Selesai</CardTitle>
                            <CardDescription>Batch yang telah diselesaikan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kode Batch</TableHead>
                                            <TableHead>Produk</TableHead>
                                            <TableHead>Target</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {batches.filter(b => b.status === "completed").map((batch) => (
                                            <TableRow key={batch.id}>
                                                <TableCell className="font-mono text-sm font-medium">
                                                    {batch.code}
                                                </TableCell>
                                                <TableCell>{batch.product}</TableCell>
                                                <TableCell>{batch.target} pcs</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {batch.date}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge>Completed</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>Semua Batch</CardTitle>
                            <CardDescription>Daftar lengkap batch produksi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kode Batch</TableHead>
                                            <TableHead>Produk</TableHead>
                                            <TableHead>Target</TableHead>
                                            <TableHead>Tahap</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {batches.map((batch) => (
                                            <TableRow key={batch.id}>
                                                <TableCell className="font-mono text-sm font-medium">
                                                    {batch.code}
                                                </TableCell>
                                                <TableCell>{batch.product}</TableCell>
                                                <TableCell>{batch.target} pcs</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{batch.stage}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {batch.status === "in_progress" && <Badge>In Progress</Badge>}
                                                    {batch.status === "completed" && <Badge>Completed</Badge>}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
