import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdminClient";
import { authOptions } from "../auth/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: categories, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("카테고리 조회 에러:", error);
      throw error;
    }

    return NextResponse.json(categories);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 에러가 발생했습니다";
    return NextResponse.json(
      { error: `카테고리 조회 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { data: category, error } = await supabaseAdmin
      .from("categories")
      .insert([
        {
          name: body.name,
          color: body.color,
          user_id: session.user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { data: category, error } = await supabaseAdmin
      .from("categories")
      .update({ name: body.name, color: body.color })
      .eq("id", body.id)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" + error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    const { error } = await supabaseAdmin
      .from("categories")
      .update({ is_active: false })
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "카테고리 비활성화 실패" + error },
      { status: 500 }
    );
  }
}
