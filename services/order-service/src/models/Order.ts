import mongoose, { Schema, Document } from 'mongoose';
import { IOrderItem, IAddress, OrderStatus, PaymentMethod, PaymentStatus, IOrder } from '../interfaces';

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Product ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total cannot be negative']
    },
  },
  { _id: false, versionKey: false }
);

const AddressSchema = new Schema<IAddress>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    addressLine: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    }
  },
  { _id: false, versionKey: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Customer ID is required'],
      index: true
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Vendor ID is required'],
      index: true
    },
    items: {
      type: [OrderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: function(items: IOrderItem[]) {
          return items && items.length > 0;
        },
        message: 'Order must have at least one item'
      }
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative']
    },
    shippingCost: {
      type: Number,
      required: [true, 'Shipping cost is required'],
      min: [0, 'Shipping cost cannot be negative'],
      default: 0
    },
    tax: {
      type: Number,
      required: [true, 'Tax is required'],
      min: [0, 'Tax cannot be negative'],
      default: 0
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total cannot be negative']
    },
    shippingAddress: {
      type: AddressSchema,
      required: [true, 'Shipping address is required']
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: [true, 'Payment method is required']
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },
    trackingNumber: {
      type: String,
      trim: true,
      default: null
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
  }
);

OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ vendorId: 1, createdAt: -1 });
OrderSchema.index({ vendorId: 1, status: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });

OrderSchema.statics.generateOrderNumber = function(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
};

OrderSchema.methods.canBeCancelled = function(): boolean {
  return ![OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(this.status);
};

OrderSchema.methods.isVendorOrder = function(vendorId: string): boolean {
  return this.vendorId === vendorId;
};

OrderSchema.methods.isCustomerOrder = function(customerId: string): boolean {
  return this.customerId === customerId;
};


OrderSchema.pre('save', function(next) {
  const calculatedTotal = this.subtotal + this.shippingCost + this.tax;
  if (Math.abs(calculatedTotal - this.total) > 0.01) {
    return next(new Error('Total amount mismatch'));
  }
  
  const itemsTotal = this.items.reduce((sum, item) => sum + item.total, 0);
  if (Math.abs(itemsTotal - this.subtotal) > 0.01) {
    return next(new Error('Items total mismatch with subtotal'));
  }
  
  next();
});

OrderSchema.post('save', function(doc) {
  console.log(`Order ${doc.orderNumber} saved successfully`);
});


export const Order = mongoose.model<IOrder>('Order', OrderSchema);
