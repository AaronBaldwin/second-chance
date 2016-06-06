'use strict';

var reputationTracker = {};

exports.register = function(person, amount) {
  return function() {
  	if(typeof reputationTracker[person] === 'undefined')
      reputationTracker[person] = 0; // Init a var if not previously specified
    reputationTracker[person] += amount;
  }
};

exports.condition = function(person, amount) {
  return function() {
    if(typeof reputationTracker[person] === 'undefined')
      reputationTracker[person] = 0; // Init a var if not previously specified
    return reputationTracker[person] >= amount;
  }
};
