import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // Medicine / Item Name
    genericName: { type: String, required: true, trim: true }, // Generic / Primary Name
    brandName: { type: String, default: '', trim: true },
    companyName: { type: String, default: '', trim: true }, // Manufacturer Company
    supplierName: { type: String, default: '', trim: true }, // Supplier / Party Name
    group: {
      type: String,
      default: 'Medicine',
      trim: true,
    },
    form: {
      type: String,
      default: 'Tab.',
      trim: true,
    },
    strength: { type: String, default: 'NA', trim: true },
    unit: {
      type: String,
      default: 'Pcs',
      trim: true,
    },
    costPrice: { type: Number, default: 0 }, // Internal Cost / Purchase Price (Form only)
    rateType: {
      type: String,
      enum: ['IC', 'NC'],
      default: 'NC',
    },
    rateIC: { type: Number, default: 0 },
    rate: { type: Number, default: 0 }, // Selling Price in NC (NPR)
    quantity: { type: Number, default: 1 },
    totalAmount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    minStockAlert: { type: Number, default: 10 },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
    isNarcotics: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    description: { type: String, default: '' },
    slug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

medicineSchema.plugin(publishablePlugin);

// Hook to auto-calculate rate in NC (if IC specified), totalAmount, stockStatus, and brandName/name sync
medicineSchema.pre('save', function (next) {
  if (!this.brandName && this.name) {
    this.brandName = this.name;
  } else if (!this.name && this.brandName) {
    this.name = this.brandName;
  }

  if (this.rateType === 'IC' && this.rateIC > 0) {
    if (!this.rate || this.isModified('rateIC')) {
      this.rate = Number((this.rateIC * 1.6).toFixed(2));
    }
  }

  const qty = Number(this.quantity) || 0;
  const r = Number(this.rate) || 0;
  this.totalAmount = Number((qty * r).toFixed(2));

  const currentStock = Number(this.stock) || 0;
  const alertThreshold = Number(this.minStockAlert) ?? 10;
  if (currentStock <= 0) {
    this.stockStatus = 'Out of Stock';
  } else if (currentStock <= alertThreshold) {
    this.stockStatus = 'Low Stock';
  } else {
    this.stockStatus = 'In Stock';
  }

  next();
});

medicineSchema.index({
  name: 'text',
  genericName: 'text',
  brandName: 'text',
  supplierName: 'text',
  companyName: 'text',
});
medicineSchema.index({ stockStatus: 1 });
medicineSchema.index({ group: 1 });

export default mongoose.model('Medicine', medicineSchema);
