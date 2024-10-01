import { connectDB } from '@/lib/mongoose';
import Student from '@/models/Student';

export async function GET(req: Request) {
    await connectDB();

    return Response.json({ success: true, message: "Ok" }, { status: 200 })
}

export async function POST(request: Request) {
    await connectDB();
    
    return Response.json({ success: true, message: "Ok" }, { status: 200 })
}