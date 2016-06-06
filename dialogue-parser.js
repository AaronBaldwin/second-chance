'use strict';

var fs = require('fs');
var stateManager = require('./game-state/state-manager');

exports.parseDialogueFile = function(filename) {
  var nodes = [];
  var lines = fs.readFileSync(filename, 'utf8').split('\n');
  var index = 0;
  var line;
  while(index < lines.length) {
    line = lines[index];
    if(isNodeStart(line))
      nodes.push(new DialogueNode());
    else
      index++;
  }
  return nodes.sort(sort);

  function sort(first, second) {
    if(first.id === second.id)
      throw new Error('Nodes should not have duplicate IDs');
    return first.id - second.id;
  }

  function DialogueNode() {
    this.id = parseInt(line.split(' ')[1]); // Numeric ID of this node
    this.options = []; // Choices for the player to pick from after this dialogue
    this.actions = []; // Functions to be called when this is visited
    this.text = [];  // Dialogue text
    this.vars = {}; // Empty on creation, populated by Actions

    this.processActions = () => {
      this.actions.forEach(function(callMe) {
        if(typeof callMe !== 'function')
          throw new Error('Only functions should be in dialogue actions');
        callMe();
      })
    };

    // This function returns a parameterless function which is reponsible for
    // incrementing 
    var registerVar = (varName) => {
      return () => this.vars[varName] = true;
    }

    while(line.length !== 0) {
      if(line.indexOf('    ') === 0) // starts with 4 spaces
        throw new Error('Found dialogue option path outside of dialogue option');
      else if(line.indexOf('   ') === 0) { // starts with 3 spaces
        this.options.push(new DialogueOption())
        continue; // this subsection advances the loop for us
      }
      else if(line.indexOf('  ') === 0) // starts with 2 spaces
        this.text.push(line.trim());
      else if(line.indexOf(' ') === 0) { // starts with 1 space
        let actionLineParts = line.trim().split('.');
        let newAction = actionLineParts[0] === 'this' ? registerVar(actionLineParts[1]) : stateManager.register(line);
        this.actions.push(newAction);
      }
      line = lines[++index];
    }
  }

  function DialogueOption() {
    var optionComponents = line.trim().split(' ');
    // The text for dialogue options has underscores to represent spaces
    this.text = optionComponents[0].replace(/_/g, ' ');
    this.conditionalDisplay = [];
    this.routes = [];
    // Iterate over all conditions (reputation.alexi.5, for instance) and register them
    for(let optionSplitIndex = 1; optionSplitIndex < optionComponents.length; optionSplitIndex++) {
      let newCondition = stateManager.condition(optionComponents[optionSplitIndex].trim());
      this.conditionalDisplay.push(newCondition);
    }
    line = lines[++index];
    // Parse all the routes
    while(line.indexOf('    ') === 0) { // 4 spaces present signifies a route for the option
      let nodeNumberAndCondition = line.trim().split(' ');
      let route = {node: parseInt(nodeNumberAndCondition[0]), conditions: []};
      this.routes.push(route);

      // Iterate over every condition on the line and add it to this route
      for(let optionSplitIndex = 1; optionSplitIndex < nodeNumberAndCondition.length; optionSplitIndex++) {
        let newCondition = stateManager.condition(nodeNumberAndCondition[optionSplitIndex]);
        route.conditions.push(newCondition);
      }
      line = lines[++index];
    }
  }
}

// Helper methods
function isNodeStart(line) {
  return typeof line === 'string' && line.indexOf('Node') === 0;
}


// Test
//var dNodes = exports.parseDialogueFile('sampple-node.dia');
//console.log('\n\n\n\n\n\n');
//console.log(dNodes[0].options[0].conditionalDisplay[0]()); //false;
//console.log(dNodes[0].actions[0].toString());
//console.log(dNodes[0].vars.availableAlexi);
//dNodes[0].actions[3]();
//console.log(dNodes[0].vars.availableAlexi);
//console.log(dNodes[0].options[0].conditionalDisplay[0]()); //true;
//console.log(dNodes[0].options[1].routes[0].node); //5
//console.log(dNodes[1].actions[0].toString());
