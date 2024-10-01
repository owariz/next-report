import { connectDB } from '@/lib/mongoose'
import Student from '@/models/Student'

export async function GET(req: Request, { params }: { params: { sid: string } },) {
    await connectDB()
    const std_id = params.sid

    const student = await Student.findOne({ std_id });

    if (!student) {
        return Response.json({ isError: true, message: "Student not found" }, { status: 404 })
    }

    return Response.json({ isError: false, message: "Ok", student }, { status: 200 })
}