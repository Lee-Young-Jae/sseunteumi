import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdminClient";
import { Transaction, CategoryTotals } from "@/types/query";

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
      .from("transactions")
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
      query = query
        .gte("transaction_date", startDate)
        .lte("transaction_date", endDate);
    }

    const { data: transactions, error } = await query.order(
      "transaction_date",
      {
        ascending: false,
      }
    );

    if (error) throw error;

    // 지출 항목만 필터링하여 카테고리별 총액 계산
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );
    const categoryTotals = expenseTransactions.reduce(
      (acc: CategoryTotals, transaction: Transaction) => {
        const categoryId = transaction.categories_id;
        if (categoryId && !acc[categoryId]) {
          acc[categoryId] = {
            total: 0,
            name: transaction.categories?.name || "",
            color: transaction.categories?.color || "",
          };
        }
        if (categoryId) {
          acc[categoryId].total += transaction.amount;
        }
        return acc;
      },
      {}
    );

    // 가장 많이 지출한 카테고리 찾기
    const topCategory = Object.entries(
      categoryTotals as CategoryTotals
    ).reduce<{
      id: string;
      total: number;
      name: string;
      color: string;
    } | null>(
      (max, [id, data]) =>
        !max || data.total > max.total ? { id, ...data } : max,
      null
    );

    // 수입과 지출 총액 계산
    const expenseTotal = expenseTransactions.reduce(
      (sum: number, t: Transaction) => sum + t.amount,
      0
    );

    const incomeTotal = transactions
      .filter((t) => t.type === "income")
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    return NextResponse.json({
      transactions,
      categoryTotals,
      topCategory,
      expenseTotal,
      incomeTotal,
      balance: incomeTotal - expenseTotal,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
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
    const { data: transaction, error } = await supabaseAdmin
      .from("transactions")
      .insert([
        {
          amount: body.amount,
          categories_id: body.type === "expense" ? body.categories_id : null,
          description: body.description,
          created_at: new Date(),
          transaction_date: body.transaction_date || new Date(),
          user_id: session.user.id,
          type: body.type, // 'expense' 또는 'income'
        },
      ])
      .select()
      .single();

    console.log(transaction, error);

    if (error) throw error;
    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create transaction" + error },
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

    // 필수 필드 검증
    if (!body.id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // 해당 거래가 현재 사용자의 것인지 확인
    const { data: existingTransaction, error: fetchError } = await supabaseAdmin
      .from("transactions")
      .select()
      .eq("id", body.id)
      .eq("user_id", session.user.id)
      .single();

    if (fetchError || !existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found or unauthorized" },
        { status: 404 }
      );
    }

    // 업데이트할 데이터 준비
    const updateData = {
      amount: body.amount,
      description: body.description,
      categories_id: body.type === "expense" ? body.categories_id : null,
      transaction_date: body.transaction_date,
      type: body.type,
    };

    const { data: transaction, error } = await supabaseAdmin
      .from("transactions")
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

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
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
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // 해당 거래가 현재 사용자의 것인지 확인
    const { data: existingTransaction, error: fetchError } = await supabaseAdmin
      .from("transactions")
      .select()
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single();

    if (fetchError || !existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found or unauthorized" },
        { status: 404 }
      );
    }

    // 거래 삭제 실행
    const { error } = await supabaseAdmin
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
