var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var aqp = require('api-query-params');
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
      return res.json(employee);
    });
  })

  .get(function(req, res) {
    const { filter, skip, limit, sort, projection } = aqp(req.query);
    Employee.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .exec(function(err, employees) {
      if (err) return res.status(500).send(err);
      return res.json(employees);
    });
  });

router
  .route('/employees/:id')
  .get(function(req, res) {
    Employee.findById(req.params.id, function(
      err,
      employee
    ) {
      if (err) return res.status(500).send(err);
      return res.json(employee);
    });
  })
  .put(function(req, res) {
    Employee.findByIdAndUpdate(
      req.params.employeeId,
      req.body,
      { new: true },
      function(err, employee) {
        if (err) return res.status(500).send(err);
        return res.json(employee);
      }
    );
  })

  .delete(function(req, res) {
    Employee.findByIdAndRemove(req.params.id, function(
      err,
      employee
    ) {
      if (err) return res.status(500).send(err);
      const response = {
        message: 'Employee successfully deleted',
        id: employee._id,
      };
      return res.json(response);
    });
  });

app.use('/api', router);

module.exports = app;
