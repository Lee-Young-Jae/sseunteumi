import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdminClient";

export async function GET() {
  // 세션 확인
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: expenses, error } = await supabaseAdmin
      .from("expenses")
      .select("*")
      .eq("user_id", session.user.id) // 현재 로그인한 사용자의 expenses만 조회
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
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
    const { data: expense, error } = await supabaseAdmin
      .from("expenses")
      .insert([
        {
          amount: body.amount,
          category: body.category,
          description: body.description,
          created_at: new Date(),
          user_id: session.user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
