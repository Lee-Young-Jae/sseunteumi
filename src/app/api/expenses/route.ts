import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdminClient";
import { authOptions } from "../auth/auth";

interface CategoryTotal {
  total: number;
  name: string;
  color: string;
}

interface Expense {
  amount: number;
  categories_id: string;
  categories: {
    name: string;
    color: string;
  };
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    let query = supabaseAdmin
      .from("expenses")
      .select(
        `
        *,
        categories(*)
      `
      )
      .eq("user_id", session.user.id);

    // 월별 필터링이 있는 경우
    if (month && year) {
      const startDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        1
      ).toISOString();
      const endDate = new Date(
        parseInt(year),
        parseInt(month),
        0
      ).toISOString();
      query = query.gte("expense_date", startDate).lte("expense_date", endDate);
    }

    const { data: expenses, error } = await query.order("expense_date", {
      ascending: false,
    });

    if (error) throw error;

    // 카테고리별 총액 계산
    const categoryTotals = expenses.reduce<Record<string, CategoryTotal>>(
      (acc, expense: Expense) => {
        const categoryId = expense.categories_id;
        if (!acc[categoryId]) {
          acc[categoryId] = {
            total: 0,
            name: expense.categories.name,
            color: expense.categories.color,
          };
        }
        acc[categoryId].total += expense.amount;
        return acc;
      },
      {}
    );

    // 가장 많이 지출한 카테고리 찾기
    const topCategory = Object.entries(categoryTotals).reduce<
      (CategoryTotal & { id: string }) | null
    >(
      (max, [id, data]) =>
        !max || data.total > max.total ? { id, ...data } : max,
      null
    );

    return NextResponse.json({
      expenses,
      categoryTotals,
      topCategory,
      total: expenses.reduce(
        (sum: number, expense: Expense) => sum + expense.amount,
        0
      ),
    });
  } catch (error) {
    console.error(error);
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
          categories_id: body.categories_id,
          description: body.description,
          created_at: new Date(),
          expense_date: body.expense_date || new Date(),
          user_id: session.user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 필수 필드 검증
    if (!body.id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    // 해당 지출이 현재 사용자의 것인지 확인
    const { data: existingExpense, error: fetchError } = await supabaseAdmin
      .from("expenses")
      .select()
      .eq("id", body.id)
      .eq("user_id", session.user.id)
      .single();

    if (fetchError || !existingExpense) {
      return NextResponse.json(
        { error: "Expense not found or unauthorized" },
        { status: 404 }
      );
    }

    // 업데이트할 데이터 준비
    const updateData = {
      amount: body.amount,
      description: body.description,
      categories_id: body.categories_id,
      expense_date: body.expense_date,
    };

    const { data: expense, error } = await supabaseAdmin
      .from("expenses")
      .update(updateData)
      .eq("id", body.id)
      .select(
        `
        *,
        categories(*)
      `
      )
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    // 해당 지출이 현재 사용자의 것인지 확인
    const { data: existingExpense, error: fetchError } = await supabaseAdmin
      .from("expenses")
      .select()
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single();

    if (fetchError || !existingExpense) {
      return NextResponse.json(
        { error: "Expense not found or unauthorized" },
        { status: 404 }
      );
    }

    // 지출 삭제 실행
    const { error } = await supabaseAdmin
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
