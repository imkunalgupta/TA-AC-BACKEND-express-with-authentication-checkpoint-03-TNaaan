let express = require('express');
let router = express.Router();
let Income = require('../models/Income');
let User = require('../models/User');
let moment = require('moment');

//render income details page
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Income.findById(id, (err, income) => {
    if (err) return next(err);
    console.log(income);
    const date = new Date(income.date).toISOString().split('T')[0];
    res.render('incomeDetails', { income, date });
  });
});

//render income edit page
router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Income.findById(id, (err, income) => {
    if (err) return next(err);
    income.sources = income.sources.join(' ');
    const date = new Date(income.date).toISOString().split('T')[0];
    res.render('incomeEditPage', { income, date });
  });
});

//edit income
router.post('/:id', (req, res, next) => {
  let id = req.params.id;
  req.body.sources = req.body.sources.trim().split(' ');
  Income.findByIdAndUpdate(id, req.body, (err, income) => {
    if (err) return next(err);
    res.redirect('/clients/statementList');
  });
});

//delete income
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Income.findByIdAndDelete(id, (err, income) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      income.userId,
      { $pull: { incomes: id } },
      (err, user) => {
        if (err) return next(err);
        res.redirect('/clients/statementList');
      }
    );
  });
});

module.exports = router;
