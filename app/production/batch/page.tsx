"use client"

import { Plus, Search, Eye, CheckCircle, AlertCircle, Package, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { toast } from "@/lib/toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface Material {
    id: string
    code: string
    name: string
    unit: string
    currentStock: number
}

interface ProductMaterial {
    materialId: string
    quantity: number
    material: Material
}

interface Product {
    id: string
    sku: string
    name: string
    materials: ProductMaterial[]
}

interface Batch {
    id: string
    batchSku: string
    status: string
    targetQuantity: number
    actualQuantity: number | null
    rejectQuantity: number
    createdAt: string
    product: Product
    materialAllocations?: MaterialAllocation[]
}

interface MaterialAllocation {
    materialId: string
    materialName: string
    requestedQty: number
    unit: string
    availableStock: number
    material: Material
}

interface Cutter {
    id: string
    name: string
    email: string
    _count: {
        cuttingTasks: number
    }
}

interface CuttingTask {
    id: string
    batchId: string
    assignedToId: string
    materialReceived: number
    piecesCompleted: number
    rejectPieces: number
    wasteQty: number | null
    status: string
    notes: string | null
    startedAt: string | null
    completedAt: string | null
    assignedTo: {
        name: string
    }
}

interface Sewer {
    id: string
    name: string
    email: string
    _count: {
        sewingTasks: number
    }
}

interface SewingTask {
    id: string
    batchId: string
    assignedToId: string
    piecesReceived: number
    piecesCompleted: number
    rejectPieces: number
    status: string
    notes: string | null
    startedAt: string | null
    completedAt: string | null
    assignedTo: {
        name: string
    }
}

interface Finisher {
    id: string
    name: string
    email: string
    _count: {
        finishingTasks: number
    }
}

export default function BatchManagementPage() {
    const router = useRouter()
    const [batches, setBatches] = useState<Batch[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [creating, setCreating] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
    const [confirming, setConfirming] = useState(false)
    const [showDetailDialog, setShowDetailDialog] = useState(false)
    const [detailBatch, setDetailBatch] = useState<Batch | null>(null)
    const [showAssignDialog, setShowAssignDialog] = useState(false)
    const [assignBatch, setAssignBatch] = useState<Batch | null>(null)
    const [cutters, setCutters] = useState<Cutter[]>([])
    const [selectedCutterId, setSelectedCutterId] = useState("")
    const [assignNotes, setAssignNotes] = useState("")
    const [assigning, setAssigning] = useState(false)
    const [showVerifyDialog, setShowVerifyDialog] = useState(false)
    const [verifyBatch, setVerifyBatch] = useState<Batch | null>(null)
    const [cuttingTask, setCuttingTask] = useState<CuttingTask | null>(null)
    const [verifyAction, setVerifyAction] = useState<"approve" | "reject">("approve")
    const [verifyNotes, setVerifyNotes] = useState("")
    const [verifying, setVerifying] = useState(false)
    const [showAssignSewerDialog, setShowAssignSewerDialog] = useState(false)
    const [assignSewerBatch, setAssignSewerBatch] = useState<Batch | null>(null)
    const [sewers, setSewers] = useState<Sewer[]>([])
    const [selectedSewerId, setSelectedSewerId] = useState("")
    const [assignSewerNotes, setAssignSewerNotes] = useState("")
    const [assigningSewer, setAssigningSewer] = useState(false)
    const [showVerifySewingDialog, setShowVerifySewingDialog] = useState(false)
    const [verifySewingBatch, setVerifySewingBatch] = useState<Batch | null>(null)
    const [sewingTask, setSewingTask] = useState<SewingTask | null>(null)
    const [verifySewingAction, setVerifySewingAction] = useState<"approve" | "reject">("approve")
    const [verifySewingNotes, setVerifySewingNotes] = useState("")
    const [verifyingSewing, setVerifyingSewing] = useState(false)
    const [showAssignFinisherDialog, setShowAssignFinisherDialog] = useState(false)
    const [assignFinisherBatch, setAssignFinisherBatch] = useState<Batch | null>(null)
    const [finishers, setFinishers] = useState<Finisher[]>([])
    const [selectedFinisherId, setSelectedFinisherId] = useState("")
    const [assignFinisherNotes, setAssignFinisherNotes] = useState("")
    const [assigningFinisher, setAssigningFinisher] = useState(false)

    // Form state
    const [selectedProductId, setSelectedProductId] = useState("")
    const [targetQuantity, setTargetQuantity] = useState("")
    const [notes, setNotes] = useState("")
    const [materialAllocations, setMaterialAllocations] = useState<MaterialAllocation[]>([])

    useEffect(() => {
        fetchBatches()
        fetchProducts()
    }, [])

    const fetchBatches = async () => {
        try {
            const response = await fetch("/api/production-batches")
            const result = await response.json()

            if (result.success) {
                setBatches(result.data)
            }
        } catch (error) {
            console.error("Error fetching batches:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products")
            const result = await response.json()

            if (result.success) {
                setProducts(result.data)
            }
        } catch (error) {
            console.error("Error fetching products:", error)
        }
    }

    const handleProductChange = (productId: string) => {
        setSelectedProductId(productId)
        const product = products.find(p => p.id === productId)

        if (product && product.materials && product.materials.length > 0) {
            // Setup material list untuk input manual
            const allocations: MaterialAllocation[] = product.materials.map(pm => ({
                materialId: pm.material.id,
                materialName: pm.material.name,
                requestedQty: 0, // Default 0, akan diinput manual
                unit: pm.material.unit,
                availableStock: Number(pm.material.currentStock) || 0,
                material: pm.material,
            }))
            setMaterialAllocations(allocations)
        } else {
            setMaterialAllocations([])
        }
    }

    const handleTargetQuantityChange = (value: string) => {
        setTargetQuantity(value)
        // Material allocations tidak auto-recalculate
        // Quantity material diinput manual oleh kepala produksi
    }

    const handleMaterialQuantityChange = (materialId: string, quantity: string) => {
        setMaterialAllocations(prev =>
            prev.map(ma =>
                ma.materialId === materialId
                    ? { ...ma, requestedQty: parseFloat(quantity) || 0 }
                    : ma
            )
        )
    }

    const handleCreateBatch = async () => {
        if (!selectedProductId || !targetQuantity) {
            toast.error("Error", "Produk dan target quantity harus diisi")
            return
        }

        setCreating(true)
        try {
            const response = await fetch("/api/production-batches", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: selectedProductId,
                    targetQuantity: parseInt(targetQuantity),
                    notes,
                    materialAllocations: materialAllocations.map(ma => ({
                        materialId: ma.materialId,
                        requestedQty: ma.requestedQty,
                    })),
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Berhasil", "Batch produksi berhasil dibuat")
                setShowCreateDialog(false)
                resetForm()
                fetchBatches()
            } else {
                toast.error("Error", result.error || "Gagal membuat batch")
            }
        } catch (error) {
            console.error("Error creating batch:", error)
            toast.error("Error", "Terjadi kesalahan saat membuat batch")
        } finally {
            setCreating(false)
        }
    }

    const resetForm = () => {
        setSelectedProductId("")
        setTargetQuantity("")
        setNotes("")
        setMaterialAllocations([])
    }

    const handleConfirmBatch = async () => {
        if (!selectedBatch) return

        setConfirming(true)
        try {
            const response = await fetch(`/api/production-batches/${selectedBatch.id}/confirm`, {
                method: "POST",
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Berhasil", result.message || "Batch berhasil dikonfirmasi")
                setShowConfirmDialog(false)
                setSelectedBatch(null)
                fetchBatches()
            } else {
                toast.error("Error", result.error || "Gagal mengkonfirmasi batch")
            }
        } catch (error) {
            console.error("Error confirming batch:", error)
            toast.error("Error", "Terjadi kesalahan saat mengkonfirmasi batch")
        } finally {
            setConfirming(false)
        }
    }

    const openConfirmDialog = async (batch: Batch) => {
        // Fetch full batch details including material allocations
        try {
            const response = await fetch(`/api/production-batches/${batch.id}`)
            const result = await response.json()

            if (result.success) {
                setSelectedBatch(result.data)
                setShowConfirmDialog(true)
            }
        } catch (error) {
            console.error("Error fetching batch details:", error)
            toast.error("Error", "Gagal memuat detail batch")
        }
    }

    const openDetailDialog = async (batch: Batch) => {
        // Fetch full batch details including material allocations
        try {
            const response = await fetch(`/api/production-batches/${batch.id}`)
            const result = await response.json()

            if (result.success) {
                setDetailBatch(result.data)
                setShowDetailDialog(true)
            }
        } catch (error) {
            console.error("Error fetching batch details:", error)
            toast.error("Error", "Gagal memuat detail batch")
        }
    }

    const openAssignDialog = async (batch: Batch) => {
        setSelectedCutterId("")
        setAssignNotes("")

        // Fetch full batch details including material allocations
        try {
            const batchResponse = await fetch(`/api/production-batches/${batch.id}`)
            const batchResult = await batchResponse.json()

            if (batchResult.success) {
                setAssignBatch(batchResult.data)
            } else {
                toast.error("Error", "Gagal memuat detail batch")
                return
            }
        } catch (error) {
            console.error("Error fetching batch details:", error)
            toast.error("Error", "Gagal memuat detail batch")
            return
        }

        // Fetch cutters
        try {
            const response = await fetch("/api/users/cutters")
            const result = await response.json()

            if (result.success) {
                setCutters(result.data)
                setShowAssignDialog(true)
            }
        } catch (error) {
            console.error("Error fetching cutters:", error)
            toast.error("Error", "Gagal memuat daftar pemotong")
        }
    }

    const handleAssignToCutter = async () => {
        if (!assignBatch || !selectedCutterId) {
            toast.error("Error", "Pilih pemotong terlebih dahulu")
            return
        }

        // Hitung total material yang akan diterima pemotong
        const totalMaterialReceived = assignBatch.materialAllocations?.reduce(
            (sum, allocation) => sum + Number(allocation.requestedQty),
            0
        ) || 0

        setAssigning(true)
        try {
            const response = await fetch(`/api/production-batches/${assignBatch.id}/assign-cutter`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    assignedToId: selectedCutterId,
                    notes: assignNotes,
                    materialReceived: totalMaterialReceived,
                    materialAllocations: assignBatch.materialAllocations?.map(allocation => ({
                        materialId: allocation.materialId,
                        materialName: allocation.materialName,
                        quantity: allocation.requestedQty,
                        unit: allocation.unit
                    }))
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Berhasil", result.message || "Batch berhasil di-assign ke pemotong")
                setShowAssignDialog(false)
                setAssignBatch(null)
                setSelectedCutterId("")
                setAssignNotes("")
                fetchBatches()
            } else {
                toast.error("Error", result.error || "Gagal assign batch")
            }
        } catch (error) {
            console.error("Error assigning batch:", error)
            toast.error("Error", "Terjadi kesalahan saat assign batch")
        } finally {
            setAssigning(false)
        }
    }

    const openVerifyDialog = async (batch: Batch) => {
        setVerifyBatch(batch)
        setVerifyAction("approve")
        setVerifyNotes("")

        // Fetch cutting task details
        try {
            const response = await fetch(`/api/production-batches/${batch.id}/cutting-task`)
            const result = await response.json()

            if (result.success && result.data) {
                setCuttingTask(result.data)
                setShowVerifyDialog(true)
            } else {
                toast.error("Error", "Gagal memuat detail cutting task")
            }
        } catch (error) {
            console.error("Error fetching cutting task:", error)
            toast.error("Error", "Gagal memuat detail cutting task")
        }
    }

    const handleVerifyCutting = async () => {
        if (!cuttingTask) return

        setVerifying(true)
        try {
            const response = await fetch(`/api/cutting-tasks/${cuttingTask.id}/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: verifyAction,
                    notes: verifyNotes,
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Berhasil", result.message || "Verifikasi berhasil")
                setShowVerifyDialog(false)
                setVerifyBatch(null)
                setCuttingTask(null)
                setVerifyNotes("")
                fetchBatches()
            } else {
                toast.error("Error", result.error || "Gagal verifikasi")
            }
        } catch (error) {
            console.error("Error verifying cutting:", error)
            toast.error("Error", "Terjadi kesalahan saat verifikasi")
        } finally {
            setVerifying(false)
        }
    }

    const openAssignSewerDialog = async (batch: Batch) => {
        setAssignSewerBatch(batch)
        setSelectedSewerId("")
        setAssignSewerNotes("")

        // Fetch sewers
        try {
            const response = await fetch("/api/users/sewers")
            const result = await response.json()

            if (result.success) {
                setSewers(result.data)
                setShowAssignSewerDialog(true)
            }
        } catch (error) {
            console.error("Error fetching sewers:", error)
            toast.error("Error", "Gagal memuat daftar penjahit")
        }
    }

    const handleAssignToSewer = async () => {
        if (!assignSewerBatch || !selectedSewerId) {
            toast.error("Error", "Pilih penjahit terlebih dahulu")
            return
        }

        setAssigningSewer(true)
        try {
            const response = await fetch(`/api/production-batches/${assignSewerBatch.id}/assign-sewer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    assignedToId: selectedSewerId,
                    notes: assignSewerNotes,
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Berhasil", result.message || "Batch berhasil di-assign ke penjahit")
                setShowAssignSewerDialog(false)
                setAssignSewerBatch(null)
                setSelectedSewerId("")
                setAssignSewerNotes("")
                fetchBatches()
            } else {
                toast.error("Error", result.error || "Gagal assign batch")
            }
        } catch (error) {
            console.error("Error assigning batch to sewer:", error)
            toast.error("Error", "Terjadi kesalahan saat assign batch")
        } finally {
            setAssigningSewer(false)
        }
    }

    const openVerifySewingDialog = async (batch: Batch) => {
        setVerifySewingBatch(batch)
        setVerifySewingAction("approve")
        setVerifySewingNotes("")

        // Fetch sewing task details
        try {
            const response = await fetch(`/api/production-batches/${batch.id}/sewing-task`)
            const result = await response.json()

            if (result.success && result.data) {
                setSewingTask(result.data)
                setShowVerifySewingDialog(true)
            } else {
                toast.error("Error", "Gagal memuat detail sewing task")
            }
        } catch (error) {
            console.error("Error fetching sewing task:", error)
            toast.error("Error", "Gagal memuat detail sewing task")
        }
    }

    const handleVerifySewing = async () => {
        if (!sewingTask) return

        setVerifyingSewing(true)
        try {
            const response = await fetch(`/api/sewing-tasks/${sewingTask.id}/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: verifySewingAction,
                    notes: verifySewingNotes,
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Berhasil", result.message || "Verifikasi berhasil")
                setShowVerifySewingDialog(false)
                setVerifySewingBatch(null)
                setSewingTask(null)
                setVerifySewingNotes("")
                fetchBatches()
            } else {
                toast.error("Error", result.error || "Gagal verifikasi")
            }
        } catch (error) {
            console.error("Error verifying sewing:", error)
            toast.error("Error", "Terjadi kesalahan saat verifikasi")
        } finally {
            setVerifyingSewing(false)
        }
    }

    const openAssignFinisherDialog = async (batch: Batch) => {
        setAssignFinisherBatch(batch)
        setSelectedFinisherId("")
        setAssignFinisherNotes("")

        // Fetch finishers
        try {
            const response = await fetch("/api/users/finishers")
            const result = await response.json()

            if (result.success) {
                setFinishers(result.data)
                setShowAssignFinisherDialog(true)
            }
        } catch (error) {
            console.error("Error fetching finishers:", error)
            toast.error("Error", "Gagal memuat daftar finisher")
        }
    }

    const handleAssignToFinisher = async () => {
        if (!assignFinisherBatch || !selectedFinisherId) {
            toast.error("Error", "Pilih finisher terlebih dahulu")
            return
        }

        setAssigningFinisher(true)
        try {
            const response = await fetch(`/api/production-batches/${assignFinisherBatch.id}/assign-finisher`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    assignedToId: selectedFinisherId,
                    notes: assignFinisherNotes,
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Berhasil", result.message || "Batch berhasil di-assign ke finisher")
                setShowAssignFinisherDialog(false)
                setAssignFinisherBatch(null)
                setSelectedFinisherId("")
                setAssignFinisherNotes("")
                fetchBatches()
            } else {
                toast.error("Error", result.error || "Gagal assign batch")
            }
        } catch (error) {
            console.error("Error assigning batch to finisher:", error)
            toast.error("Error", "Terjadi kesalahan saat assign batch")
        } finally {
            setAssigningFinisher(false)
        }
    }

    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            PENDING: "Menunggu",
            MATERIAL_REQUESTED: "Material Diminta",
            MATERIAL_ALLOCATED: "Material Dialokasi",
            ASSIGNED_TO_CUTTER: "Di-assign ke Pemotong",
            IN_CUTTING: "Proses Pemotongan",
            CUTTING_COMPLETED: "Pemotongan Selesai",
            CUTTING_VERIFIED: "Potongan Terverifikasi",
            ASSIGNED_TO_SEWER: "Di-assign ke Penjahit",
            IN_SEWING: "Proses Penjahitan",
            SEWING_COMPLETED: "Penjahitan Selesai",
            SEWING_VERIFIED: "Jahitan Terverifikasi",
            IN_FINISHING: "Proses Finishing",
            FINISHING_COMPLETED: "Finishing Selesai",
            WAREHOUSE_VERIFIED: "Terverifikasi Gudang",
            COMPLETED: "Selesai",
            CANCELLED: "Dibatalkan",
        }
        return statusMap[status] || status
    }

    const getCurrentStage = (status: string) => {
        if (["PENDING", "MATERIAL_REQUESTED", "MATERIAL_ALLOCATED"].includes(status)) return "Persiapan"
        if (["ASSIGNED_TO_CUTTER", "IN_CUTTING", "CUTTING_COMPLETED", "CUTTING_VERIFIED"].includes(status)) return "Pemotongan"
        if (["ASSIGNED_TO_SEWER", "IN_SEWING", "SEWING_COMPLETED", "SEWING_VERIFIED"].includes(status)) return "Penjahitan"
        if (["IN_FINISHING", "FINISHING_COMPLETED"].includes(status)) return "Finishing"
        if (status === "WAREHOUSE_VERIFIED") return "Gudang"
        if (status === "COMPLETED") return "Selesai"
        if (status === "CANCELLED") return "Dibatalkan"
        return status
    }

    const isActive = (batch: Batch) => {
        return !["COMPLETED", "CANCELLED", "WAREHOUSE_VERIFIED"].includes(batch.status)
    }

    const isCompleted = (batch: Batch) => {
        return batch.status === "COMPLETED" || batch.status === "WAREHOUSE_VERIFIED"
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    }

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="text-center">Loading...</div>
            </div>
        )
    }

    const filteredBatches = (filterFn: (batch: Batch) => boolean) => {
        return batches.filter((batch) => {
            const matchSearch = batch.batchSku.toLowerCase().includes(search.toLowerCase()) ||
                batch.product.name.toLowerCase().includes(search.toLowerCase())
            return filterFn(batch) && matchSearch
        })
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manajemen Batch</h2>
                    <p className="text-muted-foreground">
                        Kelola batch produksi dan penjadwalan
                    </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Batch Baru
                </Button>
            </div>

            {/* Create Batch Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Buat Batch Produksi Baru</DialogTitle>
                        <DialogDescription>
                            Isi form di bawah untuk membuat batch produksi baru
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Product Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="product">Produk *</Label>
                            <Select
                                id="product"
                                value={selectedProductId}
                                onChange={(e) => handleProductChange(e.target.value)}
                            >
                                <option value="">Pilih produk</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} ({product.sku})
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Target Quantity */}
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Target Quantity * <b>(Pcs)</b></Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                placeholder="Masukkan jumlah target produksi"
                                value={targetQuantity}
                                onChange={(e) => handleTargetQuantityChange(e.target.value)}
                            />
                        </div>

                        {/* Material Allocations */}
                        {materialAllocations.length > 0 && (
                            <div className="space-y-3">
                                <div>
                                    <Label>Alokasi Bahan Baku (Input Manual)</Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Masukkan perkiraan kebutuhan bahan baku. Konversi dari roll ke pcs akan ditentukan oleh pemotong.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {materialAllocations.map((allocation) => (
                                        <div key={allocation.materialId} className="rounded-lg border p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{allocation.materialName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Stok tersedia: {Number(allocation.availableStock)} {allocation.unit}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`material-${allocation.materialId}`}>
                                                    Perkiraan Kebutuhan ({allocation.unit})
                                                </Label>
                                                <Input
                                                    id={`material-${allocation.materialId}`}
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    placeholder={`Masukkan jumlah ${allocation.unit}`}
                                                    value={allocation.requestedQty || ""}
                                                    onChange={(e) => handleMaterialQuantityChange(allocation.materialId, e.target.value)}
                                                />
                                                {allocation.requestedQty > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        {Number(allocation.availableStock) >= Number(allocation.requestedQty) ? (
                                                            <>
                                                                <Badge className="bg-green-500">Stok Cukup</Badge>
                                                                <span className="text-sm text-muted-foreground">
                                                                    Sisa: {Number(allocation.availableStock) - Number(allocation.requestedQty)} {allocation.unit}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Badge variant="destructive">Stok Kurang</Badge>
                                                                <span className="text-sm text-muted-foreground">
                                                                    Kurang: {Number(allocation.requestedQty) - Number(allocation.availableStock)} {allocation.unit}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Catatan (Opsional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Tambahkan catatan untuk batch ini..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowCreateDialog(false)
                                resetForm()
                            }}
                            disabled={creating}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleCreateBatch} disabled={creating}>
                            {creating ? "Membuat..." : "Buat Batch"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Batch Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Batch Produksi</DialogTitle>
                        <DialogDescription>
                            Konfirmasi batch ini untuk mengalokasikan material dan memulai proses produksi
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBatch && (
                        <div className="space-y-4 py-4">
                            {/* Batch Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                                <div>
                                    <Label className="text-muted-foreground">Kode Batch</Label>
                                    <p className="font-mono font-medium">{selectedBatch.batchSku}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Produk</Label>
                                    <p className="font-medium">{selectedBatch.product.name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Target Produksi</Label>
                                    <p className="font-medium">{selectedBatch.targetQuantity} pcs</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <Badge>{getStatusLabel(selectedBatch.status)}</Badge>
                                </div>
                            </div>

                            {/* Material Allocations */}
                            <div className="space-y-2">
                                <Label>Material yang Dibutuhkan</Label>
                                {selectedBatch.materialAllocations && selectedBatch.materialAllocations.length > 0 ? (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Material</TableHead>
                                                    <TableHead className="text-right">Kebutuhan</TableHead>
                                                    <TableHead className="text-right">Stok Tersedia</TableHead>
                                                    <TableHead className="text-center">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedBatch.materialAllocations.map((allocation) => {
                                                    const available = Number(allocation.material.currentStock) || 0
                                                    const needed = Number(allocation.requestedQty)
                                                    const sufficient = available >= needed

                                                    return (
                                                        <TableRow key={allocation.materialId}>
                                                            <TableCell>
                                                                <div>
                                                                    <p className="font-medium">{allocation.material.name}</p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {allocation.material.code}
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {needed} {allocation.material.unit}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {available} {allocation.material.unit}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {sufficient ? (
                                                                    <Badge className="bg-green-500">
                                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                                        Cukup
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="destructive">
                                                                        <AlertCircle className="h-3 w-3 mr-1" />
                                                                        Kurang
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <Alert>
                                        <Package className="h-4 w-4" />
                                        <AlertDescription>
                                            Tidak ada material yang diperlukan untuk batch ini
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Warning if insufficient stock */}
                            {selectedBatch.materialAllocations?.some(
                                (a) => Number(a.material.currentStock) < Number(a.requestedQty)
                            ) && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            <strong>Peringatan:</strong> Beberapa material tidak mencukupi.
                                            Silakan tambah stok material terlebih dahulu sebelum konfirmasi.
                                        </AlertDescription>
                                    </Alert>
                                )}

                            {/* Confirmation Info */}
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Dengan mengkonfirmasi batch ini, material akan dialokasikan dan stok akan
                                    dikurangi secara otomatis. Batch akan siap untuk memulai proses produksi.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowConfirmDialog(false)
                                setSelectedBatch(null)
                            }}
                            disabled={confirming}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleConfirmBatch}
                            disabled={
                                confirming ||
                                selectedBatch?.materialAllocations?.some(
                                    (a) => Number(a.material.currentStock) < Number(a.requestedQty)
                                ) ||
                                false
                            }
                        >
                            {confirming ? "Mengkonfirmasi..." : "Konfirmasi Batch"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign to Cutter Dialog */}
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Assign ke Pemotong</DialogTitle>
                        <DialogDescription>
                            Pilih pemotong untuk mengerjakan batch ini
                        </DialogDescription>
                    </DialogHeader>

                    {assignBatch && (
                        <div className="space-y-4 py-4">
                            {/* Batch Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                                <div>
                                    <Label className="text-muted-foreground">Kode Batch</Label>
                                    <p className="font-mono font-medium">{assignBatch.batchSku}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Produk</Label>
                                    <p className="font-medium">{assignBatch.product.name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Target Quantity</Label>
                                    <p className="font-medium">{assignBatch.targetQuantity} pcs</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <Badge>{getStatusLabel(assignBatch.status)}</Badge>
                                </div>
                            </div>

                            {/* Material yang Sudah Dialokasikan */}
                            {assignBatch.materialAllocations && assignBatch.materialAllocations.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Bahan Baku untuk Pemotongan</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Material yang sudah dialokasikan dan siap diteruskan ke pemotong
                                    </p>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Material</TableHead>
                                                    <TableHead className="text-right">Jumlah</TableHead>
                                                    <TableHead>Satuan</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {assignBatch.materialAllocations.map((allocation) => (
                                                    <TableRow key={allocation.materialId}>
                                                        <TableCell className="font-medium">
                                                            {allocation.material.name}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {Number(allocation.requestedQty)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {allocation.material.unit}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}

                            {/* Cutter Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="cutter">Pilih Pemotong *</Label>
                                <Select
                                    id="cutter"
                                    value={selectedCutterId}
                                    onChange={(e) => setSelectedCutterId(e.target.value)}
                                >
                                    <option value="">Pilih pemotong</option>
                                    {cutters.map((cutter) => (
                                        <option key={cutter.id} value={cutter.id}>
                                            {cutter.name} ({cutter._count.cuttingTasks} task aktif)
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="assignNotes">Catatan (Opsional)</Label>
                                <Textarea
                                    id="assignNotes"
                                    placeholder="Tambahkan catatan untuk pemotong..."
                                    value={assignNotes}
                                    onChange={(e) => setAssignNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <Alert>
                                <UserPlus className="h-4 w-4" />
                                <AlertDescription>
                                    Setelah di-assign, pemotong akan menerima notifikasi dan dapat mulai mengerjakan batch ini.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowAssignDialog(false)
                                setAssignBatch(null)
                                setSelectedCutterId("")
                                setAssignNotes("")
                            }}
                            disabled={assigning}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleAssignToCutter}
                            disabled={assigning || !selectedCutterId}
                        >
                            {assigning ? "Mengassign..." : "Assign ke Pemotong"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Verify Cutting Dialog */}
            <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Verifikasi Potongan</DialogTitle>
                        <DialogDescription>
                            Periksa hasil pemotongan dan approve atau tolak
                        </DialogDescription>
                    </DialogHeader>

                    {verifyBatch && cuttingTask && (
                        <div className="space-y-4 py-4">
                            {/* Batch Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                                <div>
                                    <Label className="text-muted-foreground">Kode Batch</Label>
                                    <p className="font-mono font-medium">{verifyBatch.batchSku}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Produk</Label>
                                    <p className="font-medium">{verifyBatch.product.name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Target Quantity</Label>
                                    <p className="font-medium">{verifyBatch.targetQuantity} pcs</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Pemotong</Label>
                                    <p className="font-medium">{cuttingTask.assignedTo.name}</p>
                                </div>
                            </div>

                            {/* Cutting Results */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Hasil Pemotongan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-3 border rounded-lg">
                                            <Label className="text-muted-foreground text-xs">Pieces Completed</Label>
                                            <p className="text-2xl font-bold text-green-600">{cuttingTask.piecesCompleted}</p>
                                        </div>
                                        <div className="p-3 border rounded-lg">
                                            <Label className="text-muted-foreground text-xs">Reject Pieces</Label>
                                            <p className="text-2xl font-bold text-red-600">{cuttingTask.rejectPieces}</p>
                                        </div>
                                        <div className="p-3 border rounded-lg">
                                            <Label className="text-muted-foreground text-xs">Waste (kg)</Label>
                                            <p className="text-2xl font-bold text-orange-600">
                                                {cuttingTask.wasteQty ? Number(cuttingTask.wasteQty).toFixed(2) : "0.00"}
                                            </p>
                                        </div>
                                    </div>
                                    {cuttingTask.notes && (
                                        <div className="p-3 bg-muted rounded-lg">
                                            <Label className="text-xs text-muted-foreground">Catatan dari Pemotong</Label>
                                            <p className="text-sm mt-1">{cuttingTask.notes}</p>
                                        </div>
                                    )}
                                    {cuttingTask.completedAt && (
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Waktu Selesai</Label>
                                            <p className="text-sm">{formatDate(cuttingTask.completedAt)}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Verification Action */}
                            <div className="space-y-3">
                                <Label>Aksi Verifikasi *</Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="verifyAction"
                                            value="approve"
                                            checked={verifyAction === "approve"}
                                            onChange={(e) => setVerifyAction(e.target.value as "approve" | "reject")}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-green-600">✓ Approve (Setujui)</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="verifyAction"
                                            value="reject"
                                            checked={verifyAction === "reject"}
                                            onChange={(e) => setVerifyAction(e.target.value as "approve" | "reject")}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-red-600">✗ Reject (Tolak)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="verifyNotes">
                                    Catatan Verifikasi {verifyAction === "reject" && "*"}
                                </Label>
                                <Textarea
                                    id="verifyNotes"
                                    placeholder={verifyAction === "reject"
                                        ? "Jelaskan alasan penolakan..."
                                        : "Tambahkan catatan (opsional)..."
                                    }
                                    value={verifyNotes}
                                    onChange={(e) => setVerifyNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {verifyAction === "approve" ? (
                                <Alert>
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Dengan approve, batch akan berstatus CUTTING_VERIFIED dan siap untuk tahap selanjutnya (assign to tailor).
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Dengan reject, batch akan dikembalikan ke status IN_CUTTING untuk diperbaiki oleh pemotong.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowVerifyDialog(false)
                                setVerifyBatch(null)
                                setCuttingTask(null)
                                setVerifyNotes("")
                            }}
                            disabled={verifying}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleVerifyCutting}
                            disabled={verifying || (verifyAction === "reject" && !verifyNotes.trim())}
                            variant={verifyAction === "approve" ? "default" : "destructive"}
                        >
                            {verifying ? "Memverifikasi..." : verifyAction === "approve" ? "Approve" : "Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign to Sewer Dialog */}
            <Dialog open={showAssignSewerDialog} onOpenChange={setShowAssignSewerDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Assign ke Penjahit</DialogTitle>
                        <DialogDescription>
                            Pilih penjahit untuk mengerjakan batch ini
                        </DialogDescription>
                    </DialogHeader>

                    {assignSewerBatch && (
                        <div className="space-y-4 py-4">
                            {/* Batch Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                                <div>
                                    <Label className="text-muted-foreground">Kode Batch</Label>
                                    <p className="font-mono font-medium">{assignSewerBatch.batchSku}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Produk</Label>
                                    <p className="font-medium">{assignSewerBatch.product.name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Target Quantity</Label>
                                    <p className="font-medium">{assignSewerBatch.targetQuantity} pcs</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <Badge>{getStatusLabel(assignSewerBatch.status)}</Badge>
                                </div>
                            </div>

                            {/* Sewer Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="sewer">Pilih Penjahit *</Label>
                                <Select
                                    id="sewer"
                                    value={selectedSewerId}
                                    onChange={(e) => setSelectedSewerId(e.target.value)}
                                >
                                    <option value="">Pilih penjahit</option>
                                    {sewers.map((sewer) => (
                                        <option key={sewer.id} value={sewer.id}>
                                            {sewer.name} ({sewer._count.sewingTasks} task aktif)
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="assignSewerNotes">Catatan (Opsional)</Label>
                                <Textarea
                                    id="assignSewerNotes"
                                    placeholder="Tambahkan catatan untuk penjahit..."
                                    value={assignSewerNotes}
                                    onChange={(e) => setAssignSewerNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <Alert>
                                <UserPlus className="h-4 w-4" />
                                <AlertDescription>
                                    Setelah di-assign, penjahit akan menerima notifikasi dan dapat mulai mengerjakan batch ini.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowAssignSewerDialog(false)
                                setAssignSewerBatch(null)
                                setSelectedSewerId("")
                                setAssignSewerNotes("")
                            }}
                            disabled={assigningSewer}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleAssignToSewer}
                            disabled={assigningSewer || !selectedSewerId}
                        >
                            {assigningSewer ? "Mengassign..." : "Assign ke Penjahit"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Verify Sewing Dialog */}
            <Dialog open={showVerifySewingDialog} onOpenChange={setShowVerifySewingDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Verifikasi Jahitan</DialogTitle>
                        <DialogDescription>
                            Periksa hasil penjahitan dan approve atau tolak
                        </DialogDescription>
                    </DialogHeader>

                    {verifySewingBatch && sewingTask && (
                        <div className="space-y-4 py-4">
                            {/* Batch Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                                <div>
                                    <Label className="text-muted-foreground">Kode Batch</Label>
                                    <p className="font-mono font-medium">{verifySewingBatch.batchSku}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Produk</Label>
                                    <p className="font-medium">{verifySewingBatch.product.name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Target Quantity</Label>
                                    <p className="font-medium">{verifySewingBatch.targetQuantity} pcs</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Penjahit</Label>
                                    <p className="font-medium">{sewingTask.assignedTo.name}</p>
                                </div>
                            </div>

                            {/* Sewing Results */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Hasil Penjahitan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-muted-foreground">Pieces Diterima</Label>
                                            <p className="text-2xl font-bold">{sewingTask.piecesReceived}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Pieces Completed</Label>
                                            <p className="text-2xl font-bold text-green-600">{sewingTask.piecesCompleted}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Reject Pieces</Label>
                                            <p className="text-2xl font-bold text-red-600">{sewingTask.rejectPieces}</p>
                                        </div>
                                    </div>
                                    {sewingTask.notes && (
                                        <div>
                                            <Label className="text-muted-foreground">Catatan dari Penjahit</Label>
                                            <p className="text-sm mt-1">{sewingTask.notes}</p>
                                        </div>
                                    )}
                                    {sewingTask.completedAt && (
                                        <div>
                                            <Label className="text-muted-foreground">Selesai pada</Label>
                                            <p className="text-sm mt-1">{formatDate(sewingTask.completedAt)}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Verification Action */}
                            <div className="space-y-3">
                                <Label>Aksi Verifikasi *</Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="verifySewingAction"
                                            value="approve"
                                            checked={verifySewingAction === "approve"}
                                            onChange={(e) => setVerifySewingAction(e.target.value as "approve" | "reject")}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-green-600 font-medium">Approve</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="verifySewingAction"
                                            value="reject"
                                            checked={verifySewingAction === "reject"}
                                            onChange={(e) => setVerifySewingAction(e.target.value as "approve" | "reject")}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-red-600 font-medium">Reject</span>
                                    </label>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="verifySewingNotes">
                                    Catatan Verifikasi {verifySewingAction === "reject" && <span className="text-red-500">*</span>}
                                </Label>
                                <Textarea
                                    id="verifySewingNotes"
                                    placeholder={verifySewingAction === "reject"
                                        ? "Jelaskan alasan penolakan..."
                                        : "Tambahkan catatan (opsional)..."
                                    }
                                    value={verifySewingNotes}
                                    onChange={(e) => setVerifySewingNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {verifySewingAction === "approve" ? (
                                <Alert>
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Dengan approve, batch akan berstatus SEWING_VERIFIED dan siap untuk tahap selanjutnya (finishing).
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Dengan reject, batch akan dikembalikan ke status IN_SEWING untuk diperbaiki oleh penjahit.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowVerifySewingDialog(false)
                                setVerifySewingBatch(null)
                                setSewingTask(null)
                                setVerifySewingNotes("")
                            }}
                            disabled={verifyingSewing}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleVerifySewing}
                            disabled={verifyingSewing || (verifySewingAction === "reject" && !verifySewingNotes.trim())}
                            variant={verifySewingAction === "approve" ? "default" : "destructive"}
                        >
                            {verifyingSewing ? "Memverifikasi..." : verifySewingAction === "approve" ? "Approve" : "Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign to Finisher Dialog */}
            <Dialog open={showAssignFinisherDialog} onOpenChange={setShowAssignFinisherDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Assign ke Finisher</DialogTitle>
                        <DialogDescription>
                            Pilih finisher untuk mengerjakan batch ini
                        </DialogDescription>
                    </DialogHeader>

                    {assignFinisherBatch && (
                        <div className="space-y-4 py-4">
                            {/* Batch Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                                <div>
                                    <p className="text-sm text-muted-foreground">Batch SKU</p>
                                    <p className="font-medium font-mono">{assignFinisherBatch.batchSku}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Produk</p>
                                    <p className="font-medium">{assignFinisherBatch.product.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Target Quantity</p>
                                    <p className="font-medium">{assignFinisherBatch.targetQuantity} pcs</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <p className="font-medium">{getStatusLabel(assignFinisherBatch.status)}</p>
                                </div>
                            </div>

                            {/* Finisher Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="finisher">Pilih Finisher *</Label>
                                <Select
                                    id="finisher"
                                    value={selectedFinisherId}
                                    onChange={(e) => setSelectedFinisherId(e.target.value)}
                                >
                                    <option value="">Pilih finisher</option>
                                    {finishers.map((finisher) => (
                                        <option key={finisher.id} value={finisher.id}>
                                            {finisher.name} ({finisher._count.finishingTasks} active tasks)
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="assignFinisherNotes">Catatan (Opsional)</Label>
                                <Textarea
                                    id="assignFinisherNotes"
                                    placeholder="Tambahkan catatan untuk finisher..."
                                    value={assignFinisherNotes}
                                    onChange={(e) => setAssignFinisherNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <Alert>
                                <UserPlus className="h-4 w-4" />
                                <AlertDescription>
                                    Setelah di-assign, finisher akan menerima notifikasi dan dapat mulai mengerjakan batch ini.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowAssignFinisherDialog(false)
                                setAssignFinisherBatch(null)
                                setSelectedFinisherId("")
                                setAssignFinisherNotes("")
                            }}
                            disabled={assigningFinisher}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleAssignToFinisher}
                            disabled={assigningFinisher || !selectedFinisherId}
                        >
                            {assigningFinisher ? "Mengassign..." : "Assign ke Finisher"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Batch Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Batch Produksi</DialogTitle>
                        <DialogDescription>
                            Informasi lengkap tentang batch produksi
                        </DialogDescription>
                    </DialogHeader>

                    {detailBatch && (
                        <div className="space-y-6 py-4">
                            {/* Batch Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Batch</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-muted-foreground">Kode Batch</Label>
                                            <p className="font-mono font-medium text-lg">{detailBatch.batchSku}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Status</Label>
                                            <div className="mt-1">
                                                <Badge className="text-sm">{getStatusLabel(detailBatch.status)}</Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Produk</Label>
                                            <p className="font-medium">{detailBatch.product.name}</p>
                                            <p className="text-sm text-muted-foreground">{detailBatch.product.sku}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Tahap</Label>
                                            <div className="mt-1">
                                                <Badge variant="secondary">{getCurrentStage(detailBatch.status)}</Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Target Produksi</Label>
                                            <p className="font-medium">{detailBatch.targetQuantity} pcs</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Tanggal Dibuat</Label>
                                            <p className="text-sm">{formatDate(detailBatch.createdAt)}</p>
                                        </div>
                                        {detailBatch.actualQuantity !== null && (
                                            <div>
                                                <Label className="text-muted-foreground">Jumlah Aktual</Label>
                                                <p className="font-medium">{detailBatch.actualQuantity} pcs</p>
                                            </div>
                                        )}
                                        {detailBatch.rejectQuantity > 0 && (
                                            <div>
                                                <Label className="text-muted-foreground">Reject</Label>
                                                <p className="font-medium text-destructive">{detailBatch.rejectQuantity} pcs</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Material Allocations */}
                            {detailBatch.materialAllocations && detailBatch.materialAllocations.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Alokasi Material</CardTitle>
                                        <CardDescription>Material yang digunakan untuk batch ini</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Material</TableHead>
                                                        <TableHead className="text-right">Diminta</TableHead>
                                                        <TableHead className="text-right">Dialokasi</TableHead>
                                                        <TableHead className="text-center">Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {detailBatch.materialAllocations.map((allocation) => (
                                                        <TableRow key={allocation.materialId}>
                                                            <TableCell>
                                                                <div>
                                                                    <p className="font-medium">{allocation.material.name}</p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {allocation.material.code}
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {Number(allocation.requestedQty).toFixed(2)} {allocation.material.unit}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {allocation.material.currentStock !== undefined
                                                                    ? `${Number(allocation.material.currentStock).toFixed(2)} ${allocation.material.unit}`
                                                                    : '-'
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {Number(allocation.material.currentStock || 0) >= Number(allocation.requestedQty) ? (
                                                                    <Badge className="bg-green-500">
                                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                                        Cukup
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="destructive">
                                                                        <AlertCircle className="h-3 w-3 mr-1" />
                                                                        Kurang
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
                            )}

                            {/* Actions */}
                            {["PENDING", "MATERIAL_REQUESTED"].includes(detailBatch.status) && (
                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => {
                                            setShowDetailDialog(false)
                                            openConfirmDialog(detailBatch)
                                        }}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Konfirmasi Batch
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDetailDialog(false)
                                setDetailBatch(null)
                            }}
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                                <Input
                                    placeholder="Cari batch..."
                                    className="pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
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
                                        {filteredBatches(isActive).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                                    Tidak ada batch aktif
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredBatches(isActive).map((batch) => (
                                                <TableRow key={batch.id}>
                                                    <TableCell
                                                        className="font-mono text-sm font-medium cursor-pointer hover:text-primary hover:underline"
                                                        onClick={() => {
                                                            setSelectedBatch(batch)
                                                            openDetailDialog(batch)
                                                        }}
                                                    >
                                                        {batch.batchSku}
                                                    </TableCell>
                                                    <TableCell
                                                        className="cursor-pointer hover:text-primary hover:underline"
                                                    // onClick={() => openDetailDialog(batch)}
                                                    >
                                                        {batch.product.name}
                                                    </TableCell>
                                                    <TableCell>{batch.targetQuantity} pcs</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{getCurrentStage(batch.status)}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {formatDate(batch.createdAt)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge>{getStatusLabel(batch.status)}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {["PENDING"].includes(batch.status) && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => openConfirmDialog(batch)}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Konfirmasi
                                                                </Button>
                                                            )}
                                                            {batch.status === "MATERIAL_ALLOCATED" && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="default"
                                                                    onClick={() => openAssignDialog(batch)}
                                                                >
                                                                    <UserPlus className="h-4 w-4 mr-1" />
                                                                    Assign Pemotong
                                                                </Button>
                                                            )}
                                                            {batch.status === "CUTTING_COMPLETED" && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="default"
                                                                    onClick={() => openVerifyDialog(batch)}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Verifikasi Potongan
                                                                </Button>
                                                            )}
                                                            {batch.status === "CUTTING_VERIFIED" && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="default"
                                                                    onClick={() => openAssignSewerDialog(batch)}
                                                                >
                                                                    <UserPlus className="h-4 w-4 mr-1" />
                                                                    Assign Penjahit
                                                                </Button>
                                                            )}
                                                            {batch.status === "SEWING_COMPLETED" && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="default"
                                                                    onClick={() => openVerifySewingDialog(batch)}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Verifikasi Jahitan
                                                                </Button>
                                                            )}
                                                            {batch.status === "SEWING_VERIFIED" && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="default"
                                                                    onClick={() => openAssignFinisherDialog(batch)}
                                                                >
                                                                    <UserPlus className="h-4 w-4 mr-1" />
                                                                    Assign Finisher
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => router.push(`/production/batch/${batch.id}`)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
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
                                        {filteredBatches(isCompleted).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                    Tidak ada batch selesai
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredBatches(isCompleted).map((batch) => (
                                                <TableRow key={batch.id}>
                                                    <TableCell
                                                        className="font-mono text-sm font-medium cursor-pointer hover:text-primary hover:underline"
                                                        onClick={() => router.push(`/production/batch/${batch.id}`)}
                                                    >
                                                        {batch.batchSku}
                                                    </TableCell>
                                                    <TableCell
                                                        className="cursor-pointer hover:text-primary hover:underline"
                                                        onClick={() => router.push(`/production/batch/${batch.id}`)}
                                                    >
                                                        {batch.product.name}
                                                    </TableCell>
                                                    <TableCell>{batch.targetQuantity} pcs</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {formatDate(batch.createdAt)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge>Completed</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
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
                                        {filteredBatches(() => true).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                    Tidak ada batch ditemukan
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredBatches(() => true).map((batch) => (
                                                <TableRow key={batch.id}>
                                                    <TableCell
                                                        className="font-mono text-sm font-medium cursor-pointer hover:text-primary hover:underline"
                                                        onClick={() => router.push(`/production/batch/${batch.id}`)}
                                                    >
                                                        {batch.batchSku}
                                                    </TableCell>
                                                    <TableCell
                                                        className="cursor-pointer hover:text-primary hover:underline"
                                                        onClick={() => router.push(`/production/batch/${batch.id}`)}
                                                    >
                                                        {batch.product.name}
                                                    </TableCell>
                                                    <TableCell>{batch.targetQuantity} pcs</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{getCurrentStage(batch.status)}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge>{getStatusLabel(batch.status)}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
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
