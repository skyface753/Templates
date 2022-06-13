"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    provider: { type: String, required: true },
    picture: String,
    role: { type: String, required: true, default: 'user' },
});
// 3. Create a Model.
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
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
//# sourceMappingURL=user.js.map