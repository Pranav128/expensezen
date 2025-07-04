import dbConnect from '@/lib/db';
import Expense from '@/models/expense';
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { description, amount, category, date } = await request.json();
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: await params.id, userId },
      { description, amount, category, date },
      { new: true }
    );

    if (!updatedExpense) {
      return NextResponse.json({ message: 'Expense not found or user not authorized' }, { status: 404 });
    }

    return NextResponse.json(updatedExpense);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const deletedExpense = await Expense.findOneAndDelete({ _id: await params.id, userId });

    if (!deletedExpense) {
      return NextResponse.json({ message: 'Expense not found or user not authorized' }, { status: 404 });
    }

    return NextResponse.json({ id: params.id, message: 'Expense deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
