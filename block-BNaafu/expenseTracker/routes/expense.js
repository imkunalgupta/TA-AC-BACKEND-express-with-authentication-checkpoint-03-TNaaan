let express = require('express');
let router = express.Router();
let Expense = require('../models/Expense');
let User = require('../models/User');
let moment = require('moment');

//render expense details page
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Expense.findById(id, (err, expense) => {
    console.log(expense);
    const date = new Date(expense.date).toISOString().split('T')[0];
    res.render('expenseDetails', { expense, date });
  });
});

//render expense edit page
router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Expense.findById(id, (err, expense) => {
    if (err) return next(err);
    expense.category = expense.category.join(' ');
    const date = new Date(expense.date).toISOString().split('T')[0];
    res.render('expenseEditPage', { expense, date });
  });
});
//edit expense
router.post('/:id', (req, res, next) => {
  let id = req.params.id;
  req.body.category = req.body.category.trim().split(' ');
  Expense.findByIdAndUpdate(id, req.body, (err, expense) => {
    if (err) return next(err);
    res.redirect('/clients/statementList');
  });
});

//delete income
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Expense.findByIdAndDelete(id, (err, expense) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      expense.userId,
      { $pull: { expenses: id } },
      (err, user) => {
        if (err) return next(err);
        res.redirect('/clients/statementList');
      }
    );
  });
});
module.exports = router;
