import { Schema, model } from 'mongoose';

export interface IUser {
  username: string;
  password: string;
  picture?: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  picture: String,
  role: { type: String, required: true, default: 'user' },
});

const User = model<IUser>('User', userSchema);

export default User;