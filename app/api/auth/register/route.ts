import bcrypt from 'bcrypt'
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    
    await connectDB()

    // ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือไม่
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return Response.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10)

    // สร้างผู้ใช้ใหม่
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'user'
    })

    return Response.json({
      message: 'User created successfully',
      userId: user._id
    })
  } catch (error) {
    console.error('Registration error:', error)
    return Response.json(
      { error: 'Error creating user' },
      { status: 500 }
    )
  }
}