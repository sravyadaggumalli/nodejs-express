var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
  employeeId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    },
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
  image: {
    type: String,
    default: 'images/user.png',
  },
  address: {
    lines: {
      type: [String],
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: Number,
    },
  },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
