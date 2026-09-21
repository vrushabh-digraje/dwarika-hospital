import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: 'General', index: true },
    excerpt: { type: String, default: '' },
    description: { type: String, default: '' },
    fullContent: { type: String, default: '' },
    author: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    imageUrl: { type: String, default: '' },
    iconKey: { type: String, default: '' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

blogSchema.plugin(publishablePlugin);
blogSchema.index({ title: 'text', excerpt: 'text', fullContent: 'text', author: 'text' });

export default mongoose.model('Blog', blogSchema);
