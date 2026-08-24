import { NextResponse } from "next/server";
import { getAllMergedData, resetAlterData } from "@/lib/dataManager";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body as {
      type: "products" | "categories" | "categoryProducts" | "orders" | "all";
    };

    const targetType = type || "all";
    const resetSuccess = resetAlterData(targetType);

    if (!resetSuccess) {
      return NextResponse.json(
        { success: false, error: "Failed to reset alter data" },
        { status: 500 }
      );
    }

    const freshData = getAllMergedData();
    return NextResponse.json({
      success: true,
      data: freshData,
    });
  } catch (error) {
    console.error("POST /api/admin/reset error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset data" },
      { status: 500 }
    );
  }
}
