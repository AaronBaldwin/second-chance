// Condition/State Manager

this.skills = require('./skills');
this.reputation = require('./reputation');
this.milestones = require('./milestones');

// Take an unparsed line and return a corresponding function
// The function takes no parameters and updates the state when called
// Example: reputation.alexi.1, generates a f(x) that ups rep with Alexi
exports.register = function(line) {
  line = line.trim();
  var components = line.split('.');
  var namespace = components[0];
  var data = components[1];
  var amount = components[2] == undefined ? true : components[2];

  return this[namespace].register(data, amount);
}

exports.condition = function(line) {
  line = line.trim();
  var components = line.split('.');
  var namespace = components[0];
  var data = components[1];
  var check = components[2];

  return this[namespace].condition(data, check);
}
