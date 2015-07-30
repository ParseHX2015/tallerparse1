// Inicializar el parse
Parse.initialize('SurJUfsG3JkChlpYg6BIW9dMwvl8wgDcEZhPJhXR', 'AeiH3QH3vfHbaQ4IUoXXe3FFInd5XIiuquHiXr3S');

// Inicializar variables
// Usuario actual
var currentUser;

// Evento submit
$('#login-form').submit(function () {
 login();
 return false;
});

$('#signup-form').submit(function () {
 signup();
 return false;
});

$('#evento-form').submit(function () {
  agregarEvento();
  return false;
});

$('#salir').click(function () {
  logout();
})

// Preguntar si hay usuario logeado o no
showLoginOrBody();

function login() {
  var usuario = $('#login-username').val();
  var contrasena = $('#login-password').val();

  Parse.User.logIn(usuario, contrasena, {
    success: function(user) {
      console.log('login-success');
      showLoginOrBody();
      $('#login-username').val('');
      $('#login-password').val('');
    },
    error: function(user, error) {
      console.log('login-error');
      alert('Error en inicio de sesión.');
    }
  });
}

function signup() {
  var usuario = $('#signup-username').val();
  var contrasena = $('#signup-password').val();
  var email = $('#signup-email').val();

  var user = new Parse.User();
  user.set("username", usuario);
  user.set("password", contrasena);
  user.set("email", email);

  user.signUp(null, {
    success: function(user) {
      console.log('signup-success');
      showLoginOrBody();
      $('#signup-username').val('');
      $('#signup-password').val('');
      $('#signup-email').val('');
    },
    error: function(user, error) {
      console.log('signup-error');
      alert("Error en registro");
    }
  });
}

function logout() {
  Parse.User.logOut();
  showLoginOrBody();
}

function agregarEvento() {

  var datos = {};

  datos.nombre = $('#nombre-evento').val();
  datos.disertantes = $('#nombre-disertante').val();
  datos.fecha = new Date($('#fecha-evento').val());
  datos.duracion = parseInt($('#duracion-evento').val());
  datos.descripcion = $('#descripcion-evento').val();

  var Evento = Parse.Object.extend('Evento');

  var evento = new Evento();

  evento.set('Nombre', datos.nombre);
  evento.set('Disertantes', datos.disertantes);
  evento.set('Fecha', datos.fecha);
  evento.set('Duracion', datos.duracion);
  evento.set('Descripcion', datos.descripcion);

  evento.save(null, {
    success: function(evento) {
      $('#nombre-evento').val('');
      $('#nombre-disertante').val('');
      $('#fecha-evento').val('');
      $('#duracion-evento').val('');
      $('#descripcion-evento').val('');
      agregarEventoATabla(evento);
      console.log('Evento Creado');
    },
    error: function(evento, error) {
      console.log('Error al crear evento');
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
}

function showLoginOrBody() {
  currentUser = Parse.User.current();

  if (currentUser) {
    renderizarTabla();
    $('.parse-body').show();
    $('.parse-login').hide();
  } else {
    $('.parse-login').show();
    $('.parse-body').hide();
  }
}

function renderizarTabla() {
  var Evento = Parse.Object.extend('Evento');
  var query = new Parse.Query(Evento);

  query.find({
    success: function(eventos) {
      console.log('renderizando tabla')
      var tablaEventos = $('#tabla-eventos');
      tablaEventos.empty();
      var encabezadoTabla = $('<tr><th>Nombre Evento</th><th>Nombre Disertantes</th><th>Fecha Evento</th><th>Duración Hs</th><th>Descripción</th><th>Fecha Creación</th></tr>');
      tablaEventos.append(encabezadoTabla);

      for (var i = 0; i < eventos.length; i++) {
        agregarEventoATabla(eventos[i]);
      };
    },
    error: function(object, error) {
      console.log('error renderizando tabla')
    }
  });
}

function agregarEventoATabla(evento) {
  var tr = $('<tr></tr>');
  var fechaDate = new Date(evento.get('Fecha'));
  var createdAtDate = new Date(evento.createdAt);
  $('<td>' + evento.get('Nombre') + '</td>').appendTo(tr);
  $('<td>' + evento.get('Disertantes') + '</td>').appendTo(tr);
  $('<td>' + fechaDate.getDate() + '/' + (fechaDate.getMonth() + 1) + '/' + fechaDate.getFullYear() + '</td>').appendTo(tr);
  $('<td>' + evento.get('Duracion') + '</td>').appendTo(tr);
  $('<td>' + evento.get('Descripcion') + '</td>').appendTo(tr);
  $('<td>' + createdAtDate.getDate() + '/' + (createdAtDate.getMonth() + 1) + '/' + createdAtDate.getFullYear() + ' ' + createdAtDate.getHours() + ':' + (createdAtDate.getMinutes() < 10 ? '0' : '') + createdAtDate.getMinutes() + '</td>').appendTo(tr);
  $('#tabla-eventos').append(tr);
}
