import mongoose from 'mongoose'

export interface IStudent {
    _id: mongoose.Types.ObjectId
    std_id: string
    prefix?: string
    name: string
    surname: string
    nickname?: string
    grade?: string
    classroom?: string
    score: number
    misconducts?: Misconduct[]
    createdAt?: Date
    updatedAt?: Date
}

export interface Misconduct {
    misconduct: string
    scoreDeduction: number
    remark?: string
    date: Date
}

const MisconductSchema = new mongoose.Schema<Misconduct>({
    misconduct: { type: String, required: true },
    scoreDeduction: { type: Number, required: true },
    remark: { type: String },
    date: { type: Date, default: Date.now }
})

const StudentSchema = new mongoose.Schema<IStudent>({
    std_id: {
        type: String,
        required: true,
        unique: true
    },
    prefix: String,
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    nickname: String,
    grade: String,
    classroom: String,
    score: {
        type: Number,
        default: 100
    },
    misconducts: [MisconductSchema]  // เก็บประวัติการทำผิด
}, {
    timestamps: true
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema)
