
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
var helpers = require('cloud/helpers.js');
 
// OBJECT USER

Parse.Cloud.beforeSave(Parse.User, function (request, response) {
  var checkName = /^[a-zA-Z0-9_-\.]+$/;
  var emailFormat = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
 
  var user = request.object;
  var username = user.get('username').trim();
  var email = user.get('email').trim();
 
  if (username.length < 4 || username.length > 16 || checkName.test(username)) {
    response.error('El nombre de usuario debe tener entre 4 y 16 caracteres y no contener caracteres especiales');
  }
  else if (!emailFormat.test(email)) {
    response.error('Formato de email incorrecto');
  }
  else {
    response.success();
  }
});
 
// afterSave: Data validation
Parse.Cloud.afterSave('Evento', function(request) {
  response.success();
});
 
// OBJECT MEAL
 
// beforeSave: Data validation
Parse.Cloud.beforeSave('Evento', function (request, response) {
  response.success();
});

// CLOUD CODE JOBS
// JOBS
/*
To Test:
curl -X POST -H "X-Parse-Application-Id: key" -H "X-Parse-Master-Key: key" -H "Content-Type: application/json" -d "{}" -k https://api.parse.com/1/jobs/aJob
*/
Parse.Cloud.job("TestJob", function(request, status) {  
  Parse.Cloud.useMasterKey();
  
  status.success('');
});
