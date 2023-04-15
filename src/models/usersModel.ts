import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  gender: 'male' | 'female';
  photo?: string;
}

const userSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的名字'],
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, '密碼必填'],
      select: false,
    },
    gender: {
      type: String,
      default: 'male',
      enum: ['male', 'female'],
    },
    photo: String,
  },
  { versionKey: false }
);

export const User = mongoose.model<UserDocument>('User', userSchema);


