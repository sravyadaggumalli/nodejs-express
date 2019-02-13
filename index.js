var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Employee = require('./models/employee');

const connectionUri = `${process.env.MONGODB_URI}node-api?retryWrites=true`;

mongoose.connect(connectionUri, { useNewUrlParser: true });
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();
router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router
  .route('/employees')
  .post(function(req, res) {
    var employee = new Employee(req.body);
    employee.save(function(err) {
      if (err) return res.status(500).send(err);
      return res.status(200).send(employee);
    });
  })

  .get(function(req, res) {
    Employee.find(function(err, employees) {
      if (err) return res.status(500).send(err);
      return res.status(200).json(employees);
    });
  });

router
  .route('/employees/:employeeId')
  .get(function(req, res) {
    Employee.findOne({ employeeId: req.params.employeeId }, function(
      err,
      employee
    ) {
      if (err) return res.status(500).send(err);
      return res.json(employee);
    });
  })
  .put(function(req, res) {
    Employee.findOneAndUpdate(
      { employeeId: req.params.employeeId },
      req.body,
      { new: true },
      function(err, employee) {
        if (err) return res.status(500).send(err);
        return res.send(employee);
      }
    );
  })

  .delete(function(req, res) {
    Employee.findOneAndRemove({ employeeId: req.params.employeeId }, function(
      err,
      employee
    ) {
      if (err) return res.status(500).send(err);
      const response = {
        message: 'Employee successfully deleted',
        id: employee._id,
      };
      return res.status(200).send(response);
    });
  });

app.use('/api', router);

module.exports = app;
