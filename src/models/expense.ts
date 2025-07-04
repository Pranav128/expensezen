import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
  },
  date: {
    type: String,
    required: [true, 'Please provide a date'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

export default Expense;
