import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  try {
    await requireRole(["OWNER", "KEPALA_GUDANG"]);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'materials' or 'products'

    if (type === "materials") {
      // Get raw materials with stock info
      const materials = await prisma.material.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          unit: true,
          currentStock: true,
          minimumStock: true,
          price: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Calculate statistics
      const totalMaterials = materials.length;
      const lowStockItems = materials.filter(
        (m) =>
          Number(m.currentStock) <= Number(m.minimumStock) &&
          Number(m.currentStock) > 0
      ).length;
      const outOfStockItems = materials.filter(
        (m) => Number(m.currentStock) === 0
      ).length;
      const totalValue = materials.reduce(
        (sum, m) => sum + Number(m.currentStock) * Number(m.price),
        0
      );

      return NextResponse.json({
        success: true,
        data: {
          materials,
          statistics: {
            totalMaterials,
            lowStockItems,
            outOfStockItems,
            totalValue,
          },
        },
      });
    }

    if (type === "products") {
      // Get finished products from completed production batches
      const completedBatches = await prisma.productionBatch.findMany({
        where: {
          status: "COMPLETED",
        },
        include: {
          product: {
            select: {
              id: true,
              sku: true,
              name: true,
              price: true,
              status: true,
            },
          },
        },
        orderBy: {
          completedDate: "desc",
        },
      });

      // Group by product and sum quantities
      const productsMap = new Map();
      completedBatches.forEach((batch) => {
        const productId = batch.product.id;
        const netQuantity = batch.actualQuantity - batch.rejectQuantity;

        if (productsMap.has(productId)) {
          const existing = productsMap.get(productId);
          existing.stock += netQuantity;
        } else {
          productsMap.set(productId, {
            id: productId,
            sku: batch.product.sku,
            name: batch.product.name,
            price: Number(batch.product.price),
            stock: netQuantity,
            unit: "PCS",
            status: batch.product.status,
          });
        }
      });

      const products = Array.from(productsMap.values());
      const totalProducts = products.reduce((sum, p) => sum + p.stock, 0);
      const totalValue = products.reduce(
        (sum, p) => sum + p.stock * p.price,
        0
      );

      return NextResponse.json({
        success: true,
        data: {
          products,
          statistics: {
            totalProductTypes: products.length,
            totalProducts,
            totalValue,
          },
        },
      });
    }

    // Default: return both
    return NextResponse.json({
      success: false,
      error: "Please specify type parameter: 'materials' or 'products'",
    });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stocks",
      },
      { status: 500 }
    );
  }
}
