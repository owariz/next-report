import mongoose from 'mongoose'
import { User } from 'next-auth'

export interface IUser extends Omit<User, 'id'> {
  password: string
  role?: string
  _id: mongoose.Types.ObjectId
}

const UserSchema = new mongoose.Schema<IUser>({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  }
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)