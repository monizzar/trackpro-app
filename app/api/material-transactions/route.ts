import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireRole(["OWNER", "KEPALA_GUDANG"]);

    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get("materialId");
    const type = searchParams.get("type"); // IN, OUT, ADJUSTMENT, RETURN
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (materialId) where.materialId = materialId;
    if (type) where.type = type;

    const transactions = await prisma.materialTransaction.findMany({
      where,
      include: {
        material: {
          select: {
            code: true,
            name: true,
            unit: true,
          },
        },
        user: {
          select: {
            name: true,
            role: true,
          },
        },
        batch: {
          select: {
            batchSku: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch transactions",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["OWNER", "KEPALA_GUDANG"]);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { materialId, type, quantity, notes } = body;

    // Validate required fields
    if (!materialId || !type || !quantity) {
      return NextResponse.json(
        {
          success: false,
          error: "Material ID, type, and quantity are required",
        },
        { status: 400 }
      );
    }

    // Get material to check stock and unit
    const material = await prisma.material.findUnique({
      where: { id: materialId },
    });

    if (!material) {
      return NextResponse.json(
        {
          success: false,
          error: "Material not found",
        },
        { status: 404 }
      );
    }

    // Validate stock for OUT transactions
    if (type === "OUT" && Number(material.currentStock) < Number(quantity)) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient stock",
        },
        { status: 400 }
      );
    }

    // Create transaction and update stock in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.materialTransaction.create({
        data: {
          materialId,
          type,
          quantity,
          unit: material.unit,
          notes,
          userId: session.user.id,
        },
        include: {
          material: {
            select: {
              code: true,
              name: true,
              unit: true,
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      // Update material stock
      let newStock = Number(material.currentStock);
      if (type === "IN") {
        newStock += Number(quantity);
      } else if (type === "OUT") {
        newStock -= Number(quantity);
      } else if (type === "ADJUSTMENT") {
        newStock = Number(quantity); // Set to exact quantity
      } else if (type === "RETURN") {
        newStock += Number(quantity);
      }

      await tx.material.update({
        where: { id: materialId },
        data: {
          currentStock: newStock,
        },
      });

      return transaction;
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create transaction",
      },
      { status: 500 }
    );
  }
}
