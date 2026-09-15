const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    citizenName: {
      type: String,
      required: true,
    },
    issueType: {
      type: String,
      required: [true, 'Please specify issue type'],
      enum: ['Garbage Dump', 'Overflowing Bin', 'Open Defecation Spot', 'Construction Debris', 'Drainage Blockage', 'Dead Animal', 'Other'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'resolved'],
      default: 'pending',
    },
    beforePhoto: {
      type: String, // Can be base64 string or URL path
      required: true,
    },
    afterPhoto: {
      type: String, // Can be base64 string or URL path
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
