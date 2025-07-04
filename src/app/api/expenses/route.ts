import dbConnect from '@/lib/db';
import Expense from '@/models/expense';
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';

export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { description, amount, category, date } = await request.json();
    const newExpense = new Expense({
      description,
      amount,
      category,
      date,
      userId,
    });

    const savedExpense = await newExpense.save();
    return NextResponse.json(savedExpense, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const expenses = await Expense.find({ userId });
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
