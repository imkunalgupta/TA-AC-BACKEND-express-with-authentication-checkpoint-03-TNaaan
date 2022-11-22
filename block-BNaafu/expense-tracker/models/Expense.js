var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expenseSchema = new Schema(
  {
    category: { type: String },
    amount: { type: Number },
    date: { type: Date, default: Date() },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, default: 'Expense' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
