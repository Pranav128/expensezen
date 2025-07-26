import dbConnect from '@/lib/db';
import Expense from '@/models/expense';
import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';
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
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const filter: any = { userId: userId };
    
    // Handle month/year filtering for better performance
    if (month && year) {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      const monthStart = new Date(yearNum, monthNum, 1);
      const monthEnd = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
      
      filter.date = {
        $gte: monthStart.toISOString().split('T')[0],
        $lte: monthEnd.toISOString().split('T')[0],
      };
    } else if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Optimize query: select only necessary fields and sort by date descending
    const expenses = await Expense.find(filter)
      .select('description amount category date')
      .sort({ date: -1 });
    return NextResponse.json(expenses);

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
