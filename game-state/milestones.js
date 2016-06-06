'use strict';

var milestoneTracker = {
  // Insert milestones here
};

exports.register = function(milestone, data) {
  return function() {
    milestoneTracker[milestone] = data;
  }
};

exports.condition = function(milestone) {
  return function() {
    return milestoneTracker[milestone];
  }
};
