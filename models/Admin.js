const { Schema, model } = require('mongoose');

const adminSchema = new Schema(
  {
    profile: {
      firstName: {
        type: String,
        require: true,
        trim: true
      },
      lastName: {
        type: String,
        require: true,
        trim: true
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    hashPassword: {
      type: String,
      trim: true
    },

    isActivated: {
      type: Boolean,
      default: false
    },

    isDisable: {
      type: Boolean,
      default: false
    },

    role: {
      type: String,
      enum: ['ROOT_ADMIN', 'MANAGER', 'BASIC']
    },
    settings: {
      reservationEmailNotification: {
        type: Boolean,
        default: true
      }
    }
  },
  { timestamps: true }
);

module.exports = model('Admin', adminSchema);
