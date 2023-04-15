import mongoose, { Document, Schema } from 'mongoose';

export interface PostDocument extends Document {
  content: string;
  image: string;
  createdAt: Date;
  likes: number;
  user: Schema.Types.ObjectId;
}

const postSchema: Schema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
    },
    image: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '貼文ID未填寫'],
    },
  },
  { versionKey: false }
);

export const Post = mongoose.model<PostDocument>('Post', postSchema);
