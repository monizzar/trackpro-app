"use client"

import { Plus, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function SewingProcessPage() {
    const currentBatch = {
        code: "PROD-20241202-002",
        product: "Kemeja Formal",
        target: 50,
        completed: 20,
        materials: [
            { name: "Potongan Kemeja", status: "Verified", qty: "50 set" },
            { name: "Benang Jahit", allocated: "3 roll", used: "1.2 roll" },
            { name: "Kancing", allocated: "400 pcs", used: "160 pcs" },
        ]
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Proses Penjahitan</h2>
                    <p className="text-muted-foreground">
                        Update progress pekerjaan penjahitan
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

                    <div>
                        <h4 className="text-sm font-medium mb-2">Material & Potongan</h4>
                        <div className="space-y-2">
                            {currentBatch.materials.map((material, index) => (
                                <div key={index} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded">
                                    <span>{material.name}</span>
                                    {material.status ? (
                                        <Badge variant="secondary" className="text-xs">{material.status}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground">{material.used} / {material.allocated}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Update Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Update Progress</CardTitle>
                    <CardDescription>Catat progress penjahitan yang telah diselesaikan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Jumlah Selesai</Label>
                        <Input
                            id="quantity"
                            type="number"
                            placeholder="Masukkan jumlah yang telah selesai dijahit"
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
                            Submit untuk Verifikasi
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
                                <p className="text-muted-foreground">+10 pcs selesai</p>
                            </div>
                            <span className="text-muted-foreground">1 jam lalu</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-medium">Update Progress</p>
                                <p className="text-muted-foreground">+10 pcs selesai</p>
                            </div>
                            <span className="text-muted-foreground">4 jam lalu</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
