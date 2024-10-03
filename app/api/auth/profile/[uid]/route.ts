import { connectDB } from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(request: Request, { params }: { params: { uid: string } }) {
    await connectDB();
    const uid = params.uid;

    try {
        const user = await User.findById(uid);

        if (!user) return Response.json({ isError: true, message: "User not found" }, { status: 404 });

        const data = {
            uid: user._id,
            username: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.role === 'admin',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return Response.json({ isError: false, userInfo: data }, { status: 200 });
    } catch (error: unknown) {
        return Response.json({ isError: true, message: "Error deducting score", error }, { status: 500 });
    }
}