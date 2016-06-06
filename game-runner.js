'use strict';
var _ = require('lodash');

// This will eventually have to be a generic front-end interface
var frontEnd = require('./node-frontend.js');
var parser = require('./dialogue-parser.js');


var dialogueNodes = parser.parseDialogueFile('./dialogue-files/sample.dia');
var currentNode; // Current dialogue node being iterated over
var dialogueIndex = 0; // Where in the currentNode's array we are
var validOptions = null;

function loadNewFile(file) {
  dialogueNodes = parser.parseDialogueFile(file);
  loadNewNode(1); // Always load Node 1 as a default
}

function loadNewNode(nodeId) {
  currentNode = findNodeIndexById(dialogueNodes, nodeId);
  currentNode.processActions();
  dialogueIndex = 0;
  validOptions = _.filter(currentNode.options, function(option) {
  return option.conditionalDisplay.length === 0 || _.reduce(option.conditionalDisplay, function(result, condition) {return result && condition()}, true);
  });
  exports.processResponse('');
}

function findNodeIndexById(nodeList, id) {
  for(let index = 0; index < nodeList.length; index++) {
    if(nodeList[index].id === id)
      return nodeList[index];
  }
  throw new Error('Unable to find Node ' + id + ' in the list of nodes');
}

// Receive data from the front end after the user clicks past current dialogue
// Input should generally be an integer and only relevant for options
exports.processResponse = function(input) {
  // If still more dialogue to send
  if(dialogueIndex < currentNode.text.length) {
    printDialogue(currentNode.text[dialogueIndex]);
  }
  else if(dialogueIndex === currentNode.text.length) {
    // Process options. If only one option valid, just execute it here
    if(validOptions.length === 0)
      throw new Error('No dialogue options found at the end of this path:', JSON.stringify(currentNode));
    else if(validOptions.length === 1)
      loadNewNode(determineJumpFromOption(validOptions[0]))
    else
      displayOptions(validOptions);
  }
  // It is presumed here that the user is sending back an option selection
  // The input will represent an index into the valid options sent to the front end
  else {
    input = parseInt(input);
    loadNewNode(determineJumpFromOption(validOptions[input]));
  }
  dialogueIndex++;
}

// Print the next line of text for the user
// Formatting will occur on the front end
function printDialogue(line) {
  frontEnd.displayDialogue(line);
}

// Show user input options/choices
// Formatting occurs on the front end
function displayOptions(options) {
  frontEnd.displayOptions(options);
}

// An option is a choice the user makes to advance the dialogue
// When chosen, an option should resolve to an ID signifying a new node
function determineJumpFromOption(option) {
  for(let routeIndex = 0; routeIndex < option.routes.length; routeIndex++) {
    let routeConditions = option.routes[routeIndex].conditions;
    let routeValid = _.reduce(routeConditions, function(result, condition) {return result && condition()}, true);
    if (routeValid)
      return option.routes[routeIndex].node;
  }
  // We return the first route that is valid.  If none, throw error
  throw new Error('Could not find any valid routes for option choice!');
}

// TEST
var testData = {
  routes: [{conditions: [function(){return true;}, function(){return false;}], node: 1},
  {conditions: [function(){return true;}], node: 2}
  ]
};

loadNewFile('./dialogue-files/1_opening.dia');
exports.processResponse(currentNode.text[0]);