// Skills page
var skills = {
  deceit: 0,
  empathy: 0,
  leadership: 0,
  stealth: 0,
  elemental: 0,
  metamagic: 0,
  mindandbody: 0,
  shadow: 0,
  firstaid: 0,
  lockpicking: 0,
  thaumaturgy: 0,
  technology: 0,
  brawling: 0,
  firearms: 0,
  focus: 0,
  reflexes: 0,
};

// Given a skill and an amount to change it by, produce a function that
// will do that in the future with no parameters.  Dialogue files will
// use this to generate dialgue paths that can auto update by calling
// all functions in an array of theirs.
exports.register = function(skill, modifier) {
  modifier = parseInt(modifier);
  return function() {
    skills[skill] += modifier;
  }
};

// Used to get a true/false result as to whether the skill check in question
// succeeds.  Returns a function which takes no parameters that the 
exports.condition = function(skill, amount) {
  amount = parseInt(amount);
  return function() {
    return skills[skill] >= amount;
  }
};
