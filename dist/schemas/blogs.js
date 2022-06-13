"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blogsSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    posted_by: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    // category: { type: String, required: true },
    url: { type: String, required: true },
    // series: String,
    // series_position: Number
});
const Blogs = (0, mongoose_1.model)('Blogs', blogsSchema);
exports.default = Blogs;
//# sourceMappingURL=blogs.js.map