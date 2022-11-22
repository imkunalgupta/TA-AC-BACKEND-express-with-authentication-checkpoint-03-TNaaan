var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var incomeSchema = new Schema(
  {
    source: { type: String },
    amount: { type: Number },
    date: { type: Date, default: Date() },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, default: 'Income' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Income', incomeSchema);
