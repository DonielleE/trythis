const mongoose = require('mongoose');

const { Schema } = mongoose;

const ShiftsSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  rate: {
    type: Number,
    required: true,
    min: 0.99
  },
  quantity: {
    type: Number,
    min: 0,
    default: 0
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  }
});

const Shifts = mongoose.model('shifts', ShiftsSchema);

module.exports = Shifts;
