// IMPORT ALL THE DEPENDENCIES
// =============================================================
var config = require( "../config" );


// Constants and variables:
var MAX_ROUNDS = 2 * ( config.app.teams - 1 );
var roundNums  = [];


// Make the array containing only the valid round numbers
// Valid rounds => 1 to ( 2 * ( nTeams - 1 ) )
for( var round = 0; round < MAX_ROUNDS; roundNums.push( ++round ) );


module.exports = roundNums;