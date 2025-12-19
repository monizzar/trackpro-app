"use client"

import { useState, useEffect } from "react"
import { Package2, TrendingDown, TrendingUp, AlertTriangle, Plus, ArrowUpDown, History, Edit, Trash2, X } from "lucide-react"
import { toast } from "@/lib/toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Material {
    id: string
    code: string
    name: string
    description: string | null
    unit: string
    currentStock: number
    minimumStock: number
    price: number
}

interface MaterialDetail extends Material {
    transactions?: Array<{
        id: string
        type: string
        quantity: number
        unit: string
        createdAt: string
        user: {
            name: string
        }
        batch: {
            batchSku: string
            product: {
                name: string
            }
        } | null
    }>
}

interface Product {
    id: string
    sku: string
    name: string
    stock: number
    unit: string
    price: number
    status: string
}

interface Transaction {
    id: string
    type: string
    quantity: number
    unit: string
    notes: string | null
    createdAt: string
    material: {
        code: string
        name: string
        unit: string
    }
    user: {
        name: string
        role: string
    }
    batch: {
        batchSku: string
        product: {
            name: string
        }
    } | null
}

interface Statistics {
    totalMaterials: number
    lowStockItems: number
    outOfStockItems: number
    totalValue: number
    totalProductTypes?: number
    totalProducts?: number
}

export default function StocksPage() {
    const [materials, setMaterials] = useState<Material[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [statistics, setStatistics] = useState<Statistics>({
        totalMaterials: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        totalValue: 0,
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)
    const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Material
        direction: "asc" | "desc"
    } | null>(null)

    // Material detail, edit, and delete states
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialDetail | null>(null)
    const [isMaterialDetailOpen, setIsMaterialDetailOpen] = useState(false)
    const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [editForm, setEditForm] = useState({
        code: "",
        name: "",
        description: "",
        unit: "METER" as string,
        minimumStock: 0,
        price: 0,
    })

    // Transaction form
    const [transactionForm, setTransactionForm] = useState({
        materialId: "",
        type: "IN" as "IN" | "OUT" | "ADJUSTMENT" | "RETURN",
        quantity: 0,
        notes: "",
        unit: "ROLL" as string,
    })

    useEffect(() => {
        fetchMaterials()
        fetchProducts()
        fetchTransactions()
    }, [])

    const fetchMaterials = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/stocks?type=materials")
            const data = await response.json()

            if (data.success) {
                setMaterials(data.data.materials)
                // Update statistics with material data
                setStatistics(prev => ({
                    ...prev,
                    totalMaterials: data.data.statistics.totalMaterials,
                    lowStockItems: data.data.statistics.lowStockItems,
                    outOfStockItems: data.data.statistics.outOfStockItems,
                    totalValue: data.data.statistics.totalValue,
                }))
            }
        } catch (error) {
            console.error("Error fetching materials:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/stocks?type=products")
            const data = await response.json()

            if (data.success) {
                setProducts(data.data.products)
                // Update statistics with product data
                setStatistics(prev => ({
                    ...prev,
                    totalProductTypes: data.data.statistics.totalProductTypes,
                    totalProducts: data.data.statistics.totalProducts,
                }))
            }
        } catch (error) {
            console.error("Error fetching products:", error)
        }
    }

    const fetchTransactions = async () => {
        try {
            const response = await fetch("/api/material-transactions?limit=20")
            const data = await response.json()

            if (data.success) {
                setTransactions(data.data)
            }
        } catch (error) {
            console.error("Error fetching transactions:", error)
        }
    }

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const response = await fetch("/api/material-transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transactionForm),
            })

            const data = await response.json()

            if (data.success) {
                await fetchMaterials()
                await fetchTransactions()
                setIsTransactionDialogOpen(false)
                setTransactionForm({
                    materialId: "",
                    type: "IN",
                    quantity: 0,
                    notes: "",
                    unit: "",
                })
                toast.success("Transaksi Berhasil", `${transactionForm.type === 'IN' ? 'Penambahan' : 'Pengurangan'} stok berhasil dicatat`);
            } else {
                toast.error("Gagal Membuat Transaksi", data.error || "Tidak dapat membuat transaksi");
            }
        } catch (error) {
            console.error("Error creating transaction:", error)
            toast.error("Error", "Gagal membuat transaksi");
        } finally {
            setIsSaving(false)
        }
    }

    const handleSort = (key: keyof Material) => {
        let direction: "asc" | "desc" = "asc"
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key, direction })
    }

    const handleMaterialClick = async (materialId: string) => {
        try {
            const response = await fetch(`/api/materials/${materialId}`)
            const data = await response.json()

            if (data.success) {
                setSelectedMaterial(data.data)
                setIsMaterialDetailOpen(true)
            }
        } catch (error) {
            console.error("Error fetching material details:", error)
        }
    }

    const handleEditClick = () => {
        if (!selectedMaterial) return

        setEditForm({
            code: selectedMaterial.code,
            name: selectedMaterial.name,
            description: selectedMaterial.description || "",
            unit: selectedMaterial.unit,
            minimumStock: Number(selectedMaterial.minimumStock),
            price: Number(selectedMaterial.price),
        })

        setIsMaterialDetailOpen(false)
        setIsEditMaterialOpen(true)
    }

    const handleUpdateMaterial = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMaterial) return

        setIsSaving(true)
        try {
            const response = await fetch(`/api/materials/${selectedMaterial.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editForm),
            })

            const data = await response.json()

            if (data.success) {
                await fetchMaterials()
                setIsEditMaterialOpen(false)
                setSelectedMaterial(null)
                toast.success("Material Diperbarui", `${editForm.name} berhasil diperbarui`);
            } else {
                toast.error("Gagal Memperbarui", data.error || "Tidak dapat memperbarui material");
            }
        } catch (error) {
            console.error("Error updating material:", error)
            toast.error("Error", "Gagal memperbarui material");
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteClick = () => {
        setIsMaterialDetailOpen(false)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteMaterial = async () => {
        if (!selectedMaterial) return

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/materials/${selectedMaterial.id}`, {
                method: "DELETE",
            })

            const data = await response.json()

            if (data.success) {
                await fetchMaterials()
                setIsDeleteDialogOpen(false)
                setSelectedMaterial(null)
                toast.success("Material Dihapus", "Material berhasil dihapus dari sistem");
            } else {
                toast.error("Gagal Menghapus", data.error || "Tidak dapat menghapus material");
            }
        } catch (error) {
            console.error("Error deleting material:", error)
            toast.error("Error", "Gagal menghapus material");
        } finally {
            setIsDeleting(false)
        }
    }

    const getStockStatus = (current: number, minimum: number) => {
        if (current === 0) return "critical"
        if (current <= minimum) return "low"
        return "good"
    }

    const filteredMaterials = materials.filter((material) =>
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const sortedMaterials = [...filteredMaterials].sort((a, b) => {
        if (!sortConfig) return 0

        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortConfig.direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue)
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }

        return 0
    })

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price)
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getTransactionBadge = (type: string) => {
        const badges = {
            IN: <Badge className="bg-green-100 text-green-800">Stock In</Badge>,
            OUT: <Badge className="bg-red-100 text-red-800">Stock Out</Badge>,
            ADJUSTMENT: <Badge variant="secondary">Adjustment</Badge>,
            RETURN: <Badge className="bg-blue-100 text-blue-800">Return</Badge>,
        }
        return badges[type as keyof typeof badges] || <Badge>{type}</Badge>
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
                    <p className="text-muted-foreground">
                        Monitor your stock levels and materials
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isTransactionHistoryOpen} onOpenChange={setIsTransactionHistoryOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <History className="h-4 w-4 mr-2" />
                                History
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Transaction History</DialogTitle>
                                <DialogDescription>
                                    Recent material stock transactions
                                </DialogDescription>
                            </DialogHeader>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Material</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Batch</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                No transactions yet
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell className="text-sm">
                                                    {formatDate(transaction.createdAt)}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{transaction.material.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {transaction.material.code}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getTransactionBadge(transaction.type)}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {Number(transaction.quantity).toFixed(2)} {transaction.unit}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {transaction.user.name}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {transaction.batch ? (
                                                        <div>
                                                            <p className="font-medium">{transaction.batch.batchSku}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {transaction.batch.product.name}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Stock Transaction</DialogTitle>
                                <DialogDescription>
                                    Record material stock in/out transaction
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddTransaction} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="material">Material</Label>
                                    <Select
                                        id="material"
                                        value={transactionForm.materialId}
                                        onChange={(e) =>
                                            setTransactionForm({
                                                ...transactionForm,
                                                materialId: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">Select Material...</option>
                                        {materials.map((material) => (
                                            <option key={material.id} value={material.id}>
                                                {material.name} ({material.code}) - Stock: {Number(material.currentStock).toFixed(2)} {material.unit}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Transaction Type</Label>
                                    <Select
                                        id="type"
                                        value={transactionForm.type}
                                        onChange={(e) =>
                                            setTransactionForm({
                                                ...transactionForm,
                                                type: e.target.value as "IN" | "OUT" | "ADJUSTMENT" | "RETURN",
                                            })
                                        }
                                        required
                                    >
                                        <option value="IN">Stock In</option>
                                        <option value="OUT">Stock Out</option>
                                        <option value="ADJUSTMENT">Adjustment</option>
                                        <option value="RETURN">Return</option>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <Label htmlFor="quantity">Quantity</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                step="1"
                                                min="1"
                                                placeholder="Enter quantity"
                                                value={transactionForm.quantity || ""}
                                                onChange={(e) =>
                                                    setTransactionForm({
                                                        ...transactionForm,
                                                        quantity: parseFloat(e.target.value) || 0,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="unit">Unit</Label>
                                            <Select
                                                id="unit"
                                                value={transactionForm.unit}
                                                onChange={(e) =>
                                                    setTransactionForm({
                                                        ...transactionForm,
                                                        unit: e.target.value,
                                                    })
                                                }
                                                disabled
                                                required
                                            >
                                                <option value="">Select Unit...</option>
                                                <option value="METER">METER</option>
                                                <option value="ROLL">ROLL</option>
                                                <option value="PIECE">PIECE</option>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">

                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Additional notes..."
                                        value={transactionForm.notes}
                                        onChange={(e) =>
                                            setTransactionForm({
                                                ...transactionForm,
                                                notes: e.target.value,
                                            })
                                        }
                                        rows={3}
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsTransactionDialogOpen(false)}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save Transaction"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Raw Materials
                        </CardTitle>
                        <Package2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.totalMaterials}</div>
                        <p className="text-xs text-muted-foreground">
                            Types in inventory
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Finished Products
                        </CardTitle>
                        <Package2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.totalProducts || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Units ready to ship
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Low Stock Items
                        </CardTitle>
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">
                            {statistics.lowStockItems + statistics.outOfStockItems}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Need restock soon
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Stock Value
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(statistics.totalValue)}</div>
                        <p className="text-xs text-muted-foreground">
                            Total inventory value
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="materials" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="materials">Raw Materials</TabsTrigger>
                    <TabsTrigger value="products">Finished Products</TabsTrigger>
                </TabsList>

                <TabsContent value="materials" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Raw Materials Inventory</CardTitle>
                                    <CardDescription>
                                        Materials available for production
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Search materials..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-64"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    Loading materials...
                                </div>
                            ) : sortedMaterials.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Package2 className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        No materials found
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sortedMaterials.map((material) => {
                                        const status = getStockStatus(
                                            Number(material.currentStock),
                                            Number(material.minimumStock)
                                        )
                                        return (
                                            <div
                                                key={material.id}
                                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                                                onClick={() => handleMaterialClick(material.id)}
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                                        <Package2 className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{material.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {material.code} • Min: {Number(material.minimumStock).toFixed(2)} {material.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold">
                                                            {Number(material.currentStock).toFixed(2)}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {material.unit}
                                                        </p>
                                                    </div>
                                                    <div className="w-32">
                                                        {status === "good" && (
                                                            <Badge className="w-full justify-center">In Stock</Badge>
                                                        )}
                                                        {status === "low" && (
                                                            <Badge variant="secondary" className="w-full justify-center">
                                                                <TrendingDown className="h-3 w-3 mr-1" />
                                                                Low Stock
                                                            </Badge>
                                                        )}
                                                        {status === "critical" && (
                                                            <Badge variant="destructive" className="w-full justify-center">
                                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                                Out of Stock
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Finished Products</CardTitle>
                            <CardDescription>
                                Products ready for delivery
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Package2 className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        No finished products yet
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between p-4 rounded-lg border"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                                                    <Package2 className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.sku}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold">
                                                        {product.stock}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.unit}
                                                    </p>
                                                </div>
                                                <Badge className="w-24 justify-center">Available</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Material Detail Dialog */}
            <Dialog open={isMaterialDetailOpen} onOpenChange={setIsMaterialDetailOpen}>
                <DialogContent className="max-w-2xl">
                    {selectedMaterial && (
                        <>
                            <DialogHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <DialogTitle>{selectedMaterial.name}</DialogTitle>
                                        <DialogDescription>
                                            {selectedMaterial.code}
                                        </DialogDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={handleEditClick}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleDeleteClick}>
                                            <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Current Stock</Label>
                                        <p className="text-2xl font-bold">
                                            {Number(selectedMaterial.currentStock).toFixed(2)} {selectedMaterial.unit}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Minimum Stock</Label>
                                        <p className="text-2xl font-bold">
                                            {Number(selectedMaterial.minimumStock).toFixed(2)} {selectedMaterial.unit}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Price per Unit</Label>
                                        <p className="text-xl font-bold">
                                            {formatPrice(Number(selectedMaterial.price))}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Total Value</Label>
                                        <p className="text-xl font-bold">
                                            {formatPrice(Number(selectedMaterial.currentStock) * Number(selectedMaterial.price))}
                                        </p>
                                    </div>
                                </div>

                                {selectedMaterial.description && (
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Description</Label>
                                        <p className="text-sm">{selectedMaterial.description}</p>
                                    </div>
                                )}

                                <Separator />

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Recent Transactions</Label>
                                    {selectedMaterial.transactions && selectedMaterial.transactions.length > 0 ? (
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {selectedMaterial.transactions.map((transaction) => (
                                                <div
                                                    key={transaction.id}
                                                    className="flex items-center justify-between p-2 rounded border bg-muted/30"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            {getTransactionBadge(transaction.type)}
                                                            <span className="text-sm text-muted-foreground">
                                                                {formatDate(transaction.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            by {transaction.user.name}
                                                            {transaction.batch && (
                                                                <> • {transaction.batch.batchSku}</>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <p className="font-medium">
                                                        {Number(transaction.quantity).toFixed(2)} {transaction.unit}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            No transactions yet
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Material Dialog */}
            <Dialog open={isEditMaterialOpen} onOpenChange={setIsEditMaterialOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Material</DialogTitle>
                        <DialogDescription>
                            Update material information
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateMaterial} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-code">Material Code</Label>
                                <Input
                                    id="edit-code"
                                    placeholder="Material code"
                                    value={editForm.code}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, code: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Material Name</Label>
                                <Input
                                    id="edit-name"
                                    placeholder="Material name"
                                    value={editForm.name}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                placeholder="Material description"
                                value={editForm.description}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, description: e.target.value })
                                }
                                rows={2}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-unit">Unit</Label>
                                <Select
                                    id="edit-unit"
                                    value={editForm.unit}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, unit: e.target.value })
                                    }
                                    required
                                >
                                    <option value="METER">Meter</option>
                                    <option value="YARD">Yard</option>
                                    <option value="KILOGRAM">Kilogram</option>
                                    <option value="GRAM">Gram</option>
                                    <option value="PIECE">Piece</option>
                                    <option value="ROLL">Roll</option>
                                    <option value="BOX">Box</option>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-min-stock">Minimum Stock</Label>
                                <Input
                                    id="edit-min-stock"
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    placeholder="Min stock"
                                    value={editForm.minimumStock || ""}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            minimumStock: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-price">Price per Unit</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Price"
                                value={editForm.price || ""}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        price: parseFloat(e.target.value) || 0,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditMaterialOpen(false)}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Updating..." : "Update Material"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Material Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will deactivate <strong>{selectedMaterial?.name}</strong>.
                            <span className="block mt-2 text-muted-foreground">
                                Note: Materials being used in products or production batches cannot be deleted.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteMaterial}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
