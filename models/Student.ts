import mongoose from 'mongoose'
import { Student } from 'next-auth'

export interface IStudent extends Omit<Student, 'id'> {
    _id: mongoose.Types.ObjectId
}

const StudentSchema = new mongoose.Schema<IStudent>({
    std_id: {
        type: String,
        required: true,
        unique: true
    },
    prefix: String,
    name: String,
    surname: String,
    nickname: String,
    grade: String,
    classroom: String,
    score: {
        type: Number,
        default: 100
    } 
}, {
    timestamps: true
})

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema)