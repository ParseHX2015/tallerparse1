// Inicializar el parse
Parse.initialize('SurJUfsG3JkChlpYg6BIW9dMwvl8wgDcEZhPJhXR', 'AeiH3QH3vfHbaQ4IUoXXe3FFInd5XIiuquHiXr3S');

// Inicializar variables
// Usuario actual
var currentUser;
var currentUserData;

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
renderizarTabla();

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
      switch(error.code){
        case 125:
          alert("Dirección de correo inválida");
        break;
        case 142:
          alert(error.message);
        break;
        default:
          alert("Error en registro");
        break;
      } 
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

  var fileinput = $('#imagen-evento')[0];

  if (fileinput.files.length > 0) {
    var file = fileinput.files[0];
    var name = fileinput.files[0].name;

    var parseFile = new Parse.File(name, file);

    evento.set('Imagen', parseFile);
  }

  $('#evento-enviar').empty().append('Cargando').prop('disabled', true);

  evento.save(null, {
    success: function(evento) {
      $('#nombre-evento').val('');
      $('#nombre-disertante').val('');
      $('#fecha-evento').val('');
      $('#duracion-evento').val('');
      $('#descripcion-evento').val('');
      $('#evento-enviar').empty().append('Enviar').prop('disabled', false);
      var izqDer = $('.div-articulo').length - 1
      agregarEventoLista(izqDer, evento);
      console.log('Evento Creado');
    },
    error: function(evento, error) {
      console.log('Error al crear evento');
      alert('Failed to create new object, with error code: ' + error.message);
      $('#evento-enviar').empty().append('Enviar').prop('disabled', false);
    }
  });
}

function showLoginOrBody() {
  currentUser = Parse.User.current();

  if (currentUser) {
  	$('.boton-inscribir').show();
    $('.parse-body').show();
    $('.parse-login').hide();
    currentUser.fetch().then(function (user) {
      currentUserData = user;
      $('#user-span').append(currentUserData.get('username'));
      if (currentUserData.get('isAdmin')) {
        $('.section-form').show();
      }
    });
  } else {
    $('#user-span').empty()
    $('.section-form').hide();
    $('.boton-inscribir').hide();
    $('.parse-body').hide();
    $('.parse-login').show();
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
        agregarEventoLista(i, eventos[i]);
      };
    },
    error: function(object, error) {
      console.log('error renderizando tabla')
    }
  });
}


function agregarEventoLista(i,evento){

  //agregar a la tabla
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

  //agregar con imagenes
	var div = $('<div class="div-articulo"></div>');

  if (evento.get('Imagen')) {
    var imgSrc = evento.get('Imagen').url();
  } else {
    var imgSrc = "img/hellojs.png";
  }

	if(i%2==0){
		var art = $('<article class="margen texto-charla flotar-izquierda"></article>');
		var img = $('<div class="flyer-contenedor">'+ '<img src="' + imgSrc + '" class="flyer" />' + '</div>');
	}
	else {
		var art = $('<article class="margen texto-charla flotar-derecha texto-derecha"></article>');
		var img = $('<div class="flyer-contenedor-derecho">' + '<img src="' + imgSrc + '" class="flyer" />' + '</div>');
	}
	$('<header><h2>' + evento.get('Nombre') + '</h2></header>').appendTo(art);
	
	var charla = $('<section class="contenido"></section>');
	var charlaDesc = $('<p class="charla-descripcion"></p>');
	$('<strong>Descripción: ' + evento.get('Descripcion') + '</strong>').appendTo(charlaDesc);
	$('<p>Disertantes: '+ evento.get('Disertantes') +'</p>').appendTo(charlaDesc);
	var fechaDate = new Date(evento.get('Fecha'));
	$('<p>Fecha: '+ fechaDate.getDate() + '/' + (fechaDate.getMonth() + 1) + '/' + fechaDate.getFullYear() +'</p>').appendTo(charlaDesc);
	$('<p>Duración: '+ evento.get('Duracion') +' hs</p>').appendTo(charlaDesc);
  	var createdAtDate = new Date(evento.createdAt);
  	$('<p>Creado el: '+ createdAtDate.getDate() + '/' + (createdAtDate.getMonth() + 1) + '/' + createdAtDate.getFullYear() + ' ' + createdAtDate.getHours() + ':' + (createdAtDate.getMinutes() < 10 ? '0' : '') + createdAtDate.getMinutes() +'</p>').appendTo(charlaDesc);
  	charlaDesc.appendTo(charla);
  	charla.appendTo(art);
  	$('<div class="form-group"><button class="boton boton-inscribir" onclick="inscribirse(' + "\'" + evento.id + "\'" + ')" hidden>Inscribirse</button></div>').appendTo(art);
	var divImg = $('<div class="flyer-alto"></div>');
	img.appendTo(divImg);
	
	div.append(art);
	div.append(divImg);
	$('#eventos').append(div);
	//$('#eventos').append(art);
	//$('#eventos').append(divImg);
  $('.boton-inscribir').show();
}

function inscribirse(eventId){
	var evento = new (Parse.Object.extend('Evento'));
	evento.set('id',eventId);
	evento.relation('inscriptos').add(currentUser);
	evento.save();
	alert("Te has suscripto correctamente al evento");
}
