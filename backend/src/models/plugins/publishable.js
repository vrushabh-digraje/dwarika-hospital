export function publishablePlugin(schema) {
  schema.add({
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    sortOrder: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
  });

  schema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
      this.publishedAt = new Date();
    }
    if (this.isModified('status') && this.status === 'draft') {
      // keep publishedAt for history; do not clear
    }
    next();
  });
}

export default publishablePlugin;
