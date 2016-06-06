'use strict';
var _ = require('lodash');
var color = require('bash-color');

console.log('This is the terminal/text version of Second Chance');
console.log('Second Chance\n------------\n\n');

const readline = require('readline');
const model = require('./game-runner');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

exports.displayDialogue = function(text) {

  var textComponents = text.split(' ');
  textComponents[0] = color.blue(textComponents[0]);
  text = textComponents.join(' ').trim();

  rl.question(text, function(response) {
    model.processResponse(response);
  })
};

exports.displayOptions = function(options) {
  var optsProcessed = 0;
  var baseText = '\n\n** Choose an option by typing a number and enter **\n\n'
  var text = _.reduce(options, function(total, option){
    return total + (++optsProcessed) + ') ' + option.text + '\n';
  }, baseText);
  rl.question(text, function(response) {
    console.log('\n\n');
    model.processResponse(response - 1);
  })
};
