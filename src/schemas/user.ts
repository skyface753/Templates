import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface IUser {
  username: string;
  provider: string;
  picture?: string;
  role: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  provider: { type: String, required: true },
  picture: String,
    role: { type: String, required: true, default: 'user' },
});

// 3. Create a Model.
const User = model<IUser>('User', userSchema);

export default User;

// run().catch(err => console.log(err));

// async function run() {
//   // 4. Connect to MongoDB
//   await connect('mongodb://localhost:27017/test');

//   const user = new User({
//     name: 'Bill',
//     email: 'bill@initech.com',
//     avatar: 'https://i.imgur.com/dM7Thhn.png'
//   });
//   await user.save();

//   console.log(user.email); // 'bill@initech.com'
// }