import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions'; // Adjust the import path as needed
import { db } from '@/lib/db'; // Adjust the import path as needed

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Assuming your database has an 'activityLog' table
    // and a 'userId' column to link activities to users.
    // Adjust the database query based on your actual schema.
    const userActivity = await db.activityLog.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        timestamp: 'desc', // Or whatever timestamp field you use
      },
      // You might want to add pagination here later
    });

    return NextResponse.json(userActivity, { status: 200 });

  } catch (error) {
    console.error('Error fetching activity log:', error);
    return NextResponse.json({ error: 'Failed to fetch activity log' }, { status: 500 });
  }
}