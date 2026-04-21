import mongoose from "mongoose";

const RequestModel = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  category: {
    type: String // optional (can be AI generated later)
  },

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "completed"],
    default: "pending"
  },

    // ✅ GEO LOCATION (FIXED)
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },

  price: {
    type: Number // optional (can be AI suggested)
  },

  isPaid: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });
// ✅ IMPORTANT LINE
RequestModel.index({ location: "2dsphere" });

const RequestSchema =  mongoose.model.RequestModel || mongoose.model('Request', RequestModel);
export default RequestSchema;
