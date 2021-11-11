const mongoose = require('mongoose');

const { Schema } = mongoose;

const shiftSchema = new Schema({
  shiftDate: {
    type: Date,
    default: Date.now
  },
  shifts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'shifts'
    }
  ]
});

const Order = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
