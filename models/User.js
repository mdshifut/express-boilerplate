const { Schema, model } = require('mongoose');

const userSchema = new Schema(
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
    }
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
