import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        // category: true,
        unit: true,
        currentStock: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: materials,
    });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch materials",
      },
      { status: 500 }
    );
  }
}
