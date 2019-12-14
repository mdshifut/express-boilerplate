const { Schema, model } = require('mongoose');

const reservationSchema = new Schema({
  start: {
    type: Date,
    require: true
  },
  end: {
    type: Date,
    require: true
  },
  reservedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    require: true,
    enum: ['pending', 'cancel', 'approved', 'active', 'completed'],
    modifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  review: {
    rating: { type: Number, required: true },
    body: {
      type: String,
      required: true
    }
  }
});

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    capacity: {
      adults: Number,
      childs: {
        type: Number,
        default: 0
      }
    },
    roomPrice: {
      type: Number,
      required: true
    },
    gallery: [
      {
        url: {
          type: String,
          require: true
        },
        isFeatured: false
      }
    ],
    reservations: [reservationSchema],
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = model('Room', roomSchema);
