
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
var helpers = require('cloud/helpers.js');
 
// OBJECT USER

Parse.Cloud.beforeSave(Parse.User, function (request, response) {
  var checkName = /^[a-zA-Z0-9_-]+$/;
  var emailFormat = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  var usuario = request.object;

  //nuevo usuario
  if(!usuario.id){
    var username = usuario.get('username').trim();
    var email = usuario.get('email').trim();
   
    if (username.length < 4 || username.length > 16 || !checkName.test(username)) {
      response.error('El nombre de usuario debe tener entre 4 y 16 caracteres y no contener caracteres especiales');
    }
    else if (!emailFormat.test(email)) {
      response.error('Formato de email incorrecto');
    }
    else {
      response.success();
    }
  } else {
    response.success();
  }
});

// beforeSave: Data validation
Parse.Cloud.beforeSave('Evento', function (request, response) {
  var evento = request.object;

  //nuevo evento
  if(!evento.id){
    var nombre = evento.get('Nombre').trim();
    var disertantes = evento.get('Disertantes').trim();
    var descripcion = evento.get('Descripcion').trim();
    var fecha = evento.get('Fecha');
    var duracion = evento.get('Duracion');

    if (nombre.length < 3) {
      response.error('El nombre de evento debe tener más de 3 caracteres');
    }
    else if (disertantes.length < 3) {
      response.error('Debe definir los disertantes del evento');
    }
    else if (!fecha) {
      response.error('La fecha del evento debe estar definida');
    }
    else if (!duracion) {
      response.error('La duración del evento debe estar definida');
    }
    else if (descripcion.length < 4) {
      response.error('La descripcion del evento debe tener más de 4 caracteres');
    }
    else {
      response.success();
    }
  } else {
    response.success();
  }
});
 
// afterSave: Data validation
Parse.Cloud.afterSave('Evento', function(request) {
  var evento = request.object;
  if (!evento.existed()) {
    var queryUser = new Parse.Query(Parse.User);
    queryUser.find({
      success: function (users) {
        var direcciones = [];
        for (var i = 0; i < users.length; i++) {
          direcciones.push({email: users[i].get('email'), name: users[i].get('username')});
        }
        helpers.sendEmail(direcciones,"Taller Parse",'Nuevo Evento creado: '+evento.get('Nombre'),false);
      }
    });
  }
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
