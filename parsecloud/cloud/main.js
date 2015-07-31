
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
var helpers = require('cloud/helpers.js');
 
// OBJECT USER
 
// afterSave: USER -- role setting
Parse.Cloud.afterSave('Object', function(request) {
  response.success();
});
 
// OBJECT MEAL
 
// beforeSave: MEAL -- Data validation
Parse.Cloud.beforeSave('Object', function (request, response) {
  response.success();
});

// CLOUD CODE JOBS
// JOBS
/*
To Test:
curl -X POST -H "X-Parse-Application-Id: key" -H "X-Parse-Master-Key: key" -H "Content-Type: application/json" -d "{}" -k https://api.parse.com/1/jobs/aJob
*/
Parse.Cloud.job("aJob", function(request, status) {  
  Parse.Cloud.useMasterKey();
  
  status.success('');
});
