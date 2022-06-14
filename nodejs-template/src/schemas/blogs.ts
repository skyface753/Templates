import { Schema, model, PopulatedDoc } from 'mongoose';
import { IUser } from './user';
interface IBlogs {
    title: string;
    subtitle: string;
    posted_by: PopulatedDoc<IUser>;
    // category: string;
    url: string;
    // series?: string;
    // series_position?: number;
}

const blogsSchema = new Schema<IBlogs>({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    posted_by: { type: Schema.Types.ObjectId, ref: 'User' },
    // category: { type: String, required: true },
    url: { type: String, required: true },
    // series: String,
    // series_position: Number
});

const Blogs = model<IBlogs>('Blogs', blogsSchema);


export default Blogs;
