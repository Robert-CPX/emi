import { Schema, model, models, Document } from 'mongoose'

export type User = {
  clerkId: string;
  username: string;
  email: string;
  bio?: string;
  password?: string;
  profilePic: string;
  joinedAt: Date;
  lastActiveAt: Date;
} | Document;

const UserSchema = new Schema<User>({
  clerkId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  bio: String,
  profilePic: { type: String, required: true },
  password: String,
  joinedAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
});

const UserModel = models.User || model<User>('User', UserSchema);

export default UserModel;