"use client"

import { Plus, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"

export default function FinishingProcessPage() {
    const currentBatch = {
        code: "PROD-20241201-005",
        product: "Jaket Hoodie",
        target: 75,
        completed: 50,
        received: 75,
    }

    const qualityChecks = [
        { id: "qc1", label: "Cek jahitan rapi dan kuat" },
        { id: "qc2", label: "Cek ukuran sesuai spesifikasi" },
        { id: "qc3", label: "Cek warna tidak luntur" },
        { id: "qc4", label: "Setrika dengan rapi" },
        { id: "qc5", label: "Pasang label dan tag" },
        { id: "qc6", label: "Packaging dengan plastik" },
    ]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Proses Finishing</h2>
                    <p className="text-muted-foreground">
                        Quality check dan finishing produk
                    </p>
                </div>
            </div>

            {/* Current Batch Info */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-mono">{currentBatch.code}</CardTitle>
                            <CardDescription>{currentBatch.product}</CardDescription>
                        </div>
                        <Badge>In Progress</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{currentBatch.completed}/{currentBatch.target} pcs ({Math.round((currentBatch.completed / currentBatch.target) * 100)}%)</span>
                        </div>
                        <Progress value={(currentBatch.completed / currentBatch.target) * 100} />
                    </div>

                    <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Jahitan Diterima</span>
                        <span className="font-medium">{currentBatch.received} pcs</span>
                    </div>
                </CardContent>
            </Card>

            {/* Quality Check */}
            <Card>
                <CardHeader>
                    <CardTitle>Quality Check</CardTitle>
                    <CardDescription>Pastikan semua checklist terpenuhi sebelum finishing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {qualityChecks.map((check) => (
                        <div key={check.id} className="flex items-center space-x-2">
                            <Checkbox id={check.id} />
                            <label
                                htmlFor={check.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {check.label}
                            </label>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Update Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Update Progress</CardTitle>
                    <CardDescription>Catat progress finishing yang telah diselesaikan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Jumlah Selesai</Label>
                        <Input
                            id="quantity"
                            type="number"
                            placeholder="Masukkan jumlah yang telah selesai di-finishing"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="defects">Jumlah Cacat/Reject (jika ada)</Label>
                        <Input
                            id="defects"
                            type="number"
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Catatan (Opsional)</Label>
                        <Input
                            id="notes"
                            placeholder="Tambahkan catatan jika ada kendala atau informasi penting"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button className="flex-1">
                            <Plus className="h-4 w-4 mr-2" />
                            Simpan Progress
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Submit ke Gudang
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Today's History */}
            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Hari Ini</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-medium">Update Progress</p>
                                <p className="text-muted-foreground">+25 pcs selesai</p>
                            </div>
                            <span className="text-muted-foreground">2 jam lalu</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-medium">Update Progress</p>
                                <p className="text-muted-foreground">+25 pcs selesai</p>
                            </div>
                            <span className="text-muted-foreground">5 jam lalu</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
