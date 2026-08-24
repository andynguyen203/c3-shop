import { NextResponse } from "next/server";
import { getAllMergedData, saveAlterData } from "@/lib/dataManager";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = getAllMergedData();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/admin/data error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body as {
      type: "products" | "categories" | "categoryProducts" | "orders";
      data: unknown;
    };

    if (!type || !data) {
      return NextResponse.json(
        { success: false, error: "Missing 'type' or 'data'" },
        { status: 400 }
      );
    }

    const saved = saveAlterData(type, data);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to save alter data" },
        { status: 500 }
      );
    }

    const updatedData = getAllMergedData();
    return NextResponse.json({
      success: true,
      data: updatedData,
    });
  } catch (error) {
    console.error("POST /api/admin/data error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save data" },
      { status: 500 }
    );
  }
}
