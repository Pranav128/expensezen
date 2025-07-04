import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import Expense from '@/models/expense';
import dbConnect from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');

    let filter: any = { user: userId };

    if (startDate) {
      filter.date = { ...filter.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filter.date = { ...filter.date, $lte: new Date(endDate) };
    }
    if (category) {
      filter.category = category;
    }

    const expenses = await Expense.find(filter).lean();

    // Convert expenses to CSV format
    const csvRows = [];
    // Add header row
    if (expenses.length > 0) {
      const headers = Object.keys(expenses[0]).filter(key => key !== '__v' && key !== '_id' && key !== 'user');
      csvRows.push(headers.join(','));
      // Add data rows
      expenses.forEach(expense => {
        const values = headers.map(header => {
          const value = expense[header];
          // Basic handling for commas in values
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        });
        csvRows.push(values.join(','));
      });
    }


    const csvData = csvRows.join('\n');

    const response = new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="expenses.csv"',
      },
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}