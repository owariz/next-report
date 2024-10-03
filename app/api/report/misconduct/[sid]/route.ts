import { connectDB } from '@/lib/mongoose';
import Student from '@/models/Student';

export async function POST(request: Request, { params }: { params: { sid: string } }) {
    await connectDB();
    const std_id = params.sid;

    try {
        const { scoreDeduction, misconduct, remark } = await request.json();
        const student = await Student.findOne({ std_id });

        if (!student) {
            return Response.json({ isError: true, message: "Student not found" }, { status: 404 });
        }

        student.score -= scoreDeduction;

        // ตรวจสอบว่า misconducts มีอยู่หรือไม่
        student.misconducts = student.misconducts || [];
        student.misconducts.push({
            misconduct,
            scoreDeduction,
            remark,
            date: new Date()
        });

        await student.save();

        // ค้นหาข้อมูลนักเรียนอีกครั้งเพื่อส่งข้อมูลที่อัปเดต
        const updatedStudent = await Student.findOne({ std_id });

        return Response.json({ isError: false, message: "Score deducted successfully", student: updatedStudent }, { status: 200 });
    } catch (error: unknown) {
        return Response.json({ isError: true, message: "Error deducting score", error }, { status: 500 });
    }
}