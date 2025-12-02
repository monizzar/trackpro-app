"use client"

import { Package, Search, Plus, Edit, TrendingDown, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function StockManagementPage() {
    const materials = [
        { id: 1, name: "Kain Katun Premium", code: "KKP-001", stock: 250, unit: "Roll", min: 50, status: "good", location: "Rak A1" },
        { id: 2, name: "Kain Polyester", code: "KPL-002", stock: 180, unit: "Roll", min: 50, status: "good", location: "Rak A2" },
        { id: 3, name: "Benang Jahit", code: "BNJ-003", stock: 45, unit: "Cone", min: 100, status: "low", location: "Rak B1" },
        { id: 4, name: "Kancing Plastik", code: "KNC-004", stock: 15, unit: "Pack", min: 50, status: "critical", location: "Rak C1" },
        { id: 5, name: "Resleting", code: "RSL-005", stock: 120, unit: "Pack", min: 30, status: "good", location: "Rak C2" },
    ]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manajemen Stok</h2>
                    <p className="text-muted-foreground">
                        Kelola stok bahan baku gudang
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Input Stok Masuk
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bahan</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{materials.length}</div>
                        <p className="text-xs text-muted-foreground">Jenis bahan aktif</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">
                            {materials.filter(m => m.status === "low").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Perlu monitoring</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stok Kritis</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {materials.filter(m => m.status === "critical").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Segera restock</p>
                    </CardContent>
                </Card>
            </div>

            {/* Materials Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Daftar Bahan Baku</CardTitle>
                            <CardDescription>Kelola dan monitor stok bahan baku</CardDescription>
                        </div>
                    </div>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari bahan baku..."
                            className="pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kode</TableHead>
                                    <TableHead>Nama Bahan</TableHead>
                                    <TableHead>Stok</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Min. Stok</TableHead>
                                    <TableHead>Lokasi</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {materials.map((material) => (
                                    <TableRow key={material.id}>
                                        <TableCell className="font-mono text-sm">{material.code}</TableCell>
                                        <TableCell className="font-medium">{material.name}</TableCell>
                                        <TableCell className="font-bold">{material.stock}</TableCell>
                                        <TableCell>{material.unit}</TableCell>
                                        <TableCell>{material.min}</TableCell>
                                        <TableCell>{material.location}</TableCell>
                                        <TableCell>
                                            {material.status === "good" && <Badge>Aman</Badge>}
                                            {material.status === "low" && (
                                                <Badge variant="secondary">
                                                    <TrendingDown className="h-3 w-3 mr-1" />
                                                    Rendah
                                                </Badge>
                                            )}
                                            {material.status === "critical" && (
                                                <Badge variant="destructive">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Kritis
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
