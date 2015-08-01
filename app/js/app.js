// Inicializar el parse
Parse.initialize('SurJUfsG3JkChlpYg6BIW9dMwvl8wgDcEZhPJhXR', 'AeiH3QH3vfHbaQ4IUoXXe3FFInd5XIiuquHiXr3S');

// Inicializar variables
var currentUser; // Usuario actual (en localstorage)
var currentUserData; // Datos completos del usuario

// Evento submit para el login
$('#login-form').submit(function () {
 login();
 return false;
});

// Evento submit para el registro
$('#signup-form').submit(function () {
 signup();
 return false;
});

// Evento submit para el crear evento
$('#evento-form').submit(function () {
  agregarEvento();
  return false;
});

// Evento click para el boton salir y deslogueo
$('#salir').click(function () {
  logout();
})

// Mostrar o no el login en caso de estar logeado o no
showLoginOrBody();

// Mostrar los datos de los eventos hasta el día de hoy
renderizarTabla();

// Función de login
function login() {

  // obtener los datos de los campos del formulario
  var usuario = $('#login-username').val();
  var contrasena = $('#login-password').val();

  // llamada a la funcion de parse para login
  Parse.User.logIn(usuario, contrasena, {

    // en caso de que el login con esas credenciales sean correctas
    success: function(user) {
      console.log('login-success');

      // mostrar la ventana correspondiente para usuario autenticado
      showLoginOrBody();

      // limpiar el formulario de login
      $('#login-username').val('');
      $('#login-password').val('');
    },

    // en caso de que el login sea erróneo
    error: function(user, error) {
      console.log('login-error');
      // mostrar popup de error
      alert('Error en inicio de sesión: ' + error.message);
    }
  });
}

// Función de registro
function signup() {

  // obtener los datos de los campos del formulario de registro
  var usuario = $('#signup-username').val();
  var contrasena = $('#signup-password').val();
  var email = $('#signup-email').val();

  // creación de objeto usuario parse
  var user = new Parse.User();

  // setear los valores obtenidos del formulario
  user.set("username", usuario);
  user.set("password", contrasena);
  user.set("email", email);

  // llamar a la función de parse de registro que almacena en la nube al usuario
  user.signUp(null, {

    // en caso de éxito
    success: function(user) {
      console.log('signup-success');

      // mostrar la ventana correspondiente al usuario autenticado
      showLoginOrBody();

      // limpiar campos del formulario de registro
      $('#signup-username').val('');
      $('#signup-password').val('');
      $('#signup-email').val('');
    },

    // en caso de error
    error: function(user, error) {
      console.log('signup-error');

      // mostrar el error correspondiente
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

// Función logout
function logout() {

  // Función de parse que realiza el deslogueo
  Parse.User.logOut();

  // mostrar la ventana correspondiente al usuario no logueado
  showLoginOrBody();
}

// Función para agregar eventos
function agregarEvento() {

  // inicialización de objeto
  var datos = {};

  // obtener los datos del formulario
  datos.nombre = $('#nombre-evento').val();
  datos.disertantes = $('#nombre-disertante').val();
  datos.fecha = new Date($('#fecha-evento').val());
  datos.duracion = parseInt($('#duracion-evento').val());
  datos.descripcion = $('#descripcion-evento').val();

  // crear un objeto parse de tipo evento
  var Evento = Parse.Object.extend('Evento');
  var evento = new Evento();

  // setear los valores obtenidos en los campos
  evento.set('Nombre', datos.nombre);
  evento.set('Disertantes', datos.disertantes);
  evento.set('Fecha', datos.fecha);
  evento.set('Duracion', datos.duracion);
  evento.set('Descripcion', datos.descripcion);

  // obtener el campo de imagen
  var fileinput = $('#imagen-evento')[0];

  // en caso de que exista una imagen cargada en el campo
  if (fileinput.files.length > 0) {

    // obtener la imagen
    var file = fileinput.files[0];

    // obtener el nombre
    var parseFile = new Parse.File(file.name, file);

    // setear al evento la imagen
    evento.set('Imagen', parseFile);
  }

  // mostrar "Cargando" en el botón para notificar que está cargando el evento a parse
  $('#evento-enviar').empty().append('Cargando').prop('disabled', true);

  // guardar el evento
  evento.save(null, {

    // en caso de éxito
    success: function(evento) {

      // limpiar los campos
      $('#nombre-evento').val('');
      $('#nombre-disertante').val('');
      $('#fecha-evento').val('');
      $('#duracion-evento').val('');
      $('#descripcion-evento').val('');

      // mostrar nuevamente "Enviar" en el botón
      $('#evento-enviar').empty().append('Enviar').prop('disabled', false);

      // obtener el número de articulos para saber si el próximo debe tener la imágen a la derecha o izquierda
      var izqDer = $('.div-articulo').length;

      // agregar el evento guardado a la lista
      agregarEventoLista(izqDer, evento);
      console.log('Evento Creado');
    },

    // en caso de error
    error: function(evento, error) {
      console.log('Error al crear evento');

      // según el tipo de error, mostrar el popup correspondiente
      switch(error.code){
        case 142:
          alert(error.message);
        break;
        default:
          alert("Error al crear el evento");
        break;
      }

      // mostrar nuevamente "Enviar" en el botón
      $('#evento-enviar').empty().append('Enviar').prop('disabled', false);
    }
  });
}

// Función para mostrar o no el login, dependiendo si está logeado o no
function showLoginOrBody() {

  // obtener el usuario actual
  currentUser = Parse.User.current();

  // en caso de que esté autenticado
  if (currentUser) {

    // mostrar el botón de inscribir en los eventos
  	$('.boton-inscribir').show();

    // mostrar el cuerpo principal
    $('.parse-body').show();

    // esconder el panel de login y registro
    $('.parse-login').hide();

    // obtener más información del usuario
    currentUser.fetch().then(function (user) {
      
      // almacenar la información
      currentUserData = user;

      // mostrar el nombre del usuario en la página
      $('#user-span').append(currentUserData.get('username'));
      
      // en caso de que el usuario logueado sea administrador, mostrar el formulario de agregar eventos
      if (currentUserData.get('isAdmin')) {
        $('.section-form').show();
      }
    });

  // en caso de que no esté autenticado
  } else {

    // quitar el nombre de usuario
    $('#user-span').empty()

    // ocultar el formulario de eventos
    $('.section-form').hide();

    // ocultar los botones de inscripción
    $('.boton-inscribir').hide();

    // ocultar la pantalla principal
    $('.parse-body').hide();

    // mostrar el login y registro
    $('.parse-login').show();
  }
}

// Función renderizar tabla, que muestra la tabla y los eventos creados
function renderizarTabla() {

  // crear una consulta a los datos de la nube de objetos de tipo "Evento"
  var Evento = Parse.Object.extend('Evento');
  var query = new Parse.Query(Evento);

  // correr la consulta
  query.find({
    // en caso de éxito
    success: function(eventos) {
      console.log('renderizando tabla')

      // Buscar la tabla de eventos en la página y vaciarla
      var tablaEventos = $('#tabla-eventos');
      tablaEventos.empty();

      // crear el encabezado de la tabla y agregarla a la tabla en la página
      var encabezadoTabla = $('<tr><th>Nombre Evento</th><th>Nombre Disertantes</th><th>Fecha Evento</th><th>Duración Hs</th><th>Descripción</th><th>Fecha Creación</th></tr>');
      tablaEventos.append(encabezadoTabla);

      // por cada uno de los eventos, agregar a la tabla y renderizar la lista
      for (var i = 0; i < eventos.length; i++) {
        agregarEventoLista(i, eventos[i]);
      };
    },

    // en caso de error
    error: function(object, error) {
      console.log('error renderizando tabla');

      // mostrar popup de error 
      alert('Error en renderizado: ' + error.message);
    }
  });
}

// Función agregar evento a la lista
function agregarEventoLista(i,evento){

  // Agregar a la tabla
  // crear una fila de la tabla
  var tr = $('<tr></tr>');

  // obtener las fechas del evento y de su creación
  var fechaDate = new Date(evento.get('Fecha'));
  var createdAtDate = new Date(evento.createdAt);

  // crear las celdas y agregarlas a la fila
  $('<td>' + evento.get('Nombre') + '</td>').appendTo(tr);
  $('<td>' + evento.get('Disertantes') + '</td>').appendTo(tr);
  $('<td>' + fechaDate.getDate() + '/' + (fechaDate.getMonth() + 1) + '/' + fechaDate.getFullYear() + '</td>').appendTo(tr);
  $('<td>' + evento.get('Duracion') + '</td>').appendTo(tr);
  $('<td>' + evento.get('Descripcion') + '</td>').appendTo(tr);
  $('<td>' + createdAtDate.getDate() + '/' + (createdAtDate.getMonth() + 1) + '/' + createdAtDate.getFullYear() + ' ' + createdAtDate.getHours() + ':' + (createdAtDate.getMinutes() < 10 ? '0' : '') + createdAtDate.getMinutes() + '</td>').appendTo(tr);
  
  // aplicar la fila a la tabla 
  $('#tabla-eventos').append(tr);

  // Agregar a la lista con imagenes

  // crear el div del artículo
	var div = $('<div class="div-articulo"></div>');

  // en caso de que el evento tenga imagen, utilizarla
  if (evento.get('Imagen')) {
    var imgSrc = evento.get('Imagen').url();

  // caso contrario, usar imagen por defecto
  } else {
    var imgSrc = "img/hellojs.png";
  }

  // crear imagen y datos a la derecha o izquierda, según su posición en la lista
	if(i%2==0){

    // crear el artículo con los datos a la izquierda 
		var art = $('<article class="margen texto-charla flotar-izquierda"></article>');

    // crear la imagen
		var img = $('<div class="flyer-contenedor">'+ '<img src="' + imgSrc + '" class="flyer" />' + '</div>');
	}
	else {

    // crear el artículo con los datos a la izquierda
		var art = $('<article class="margen texto-charla flotar-derecha texto-derecha"></article>');

    // crear la imagen
		var img = $('<div class="flyer-contenedor-derecho">' + '<img src="' + imgSrc + '" class="flyer" />' + '</div>');
	}

  // agregar el nombre del evento como título del artículo
	$('<header><h2>' + evento.get('Nombre') + '</h2></header>').appendTo(art);
	
  // crear el contenido de la charla
	var charla = $('<section class="contenido"></section>');

  // crear la descripción, asignar la información de la nube y agregarlo a la charla
	var charlaDesc = $('<p class="charla-descripcion"></p>');
	$('<strong>Descripción: ' + evento.get('Descripcion') + '</strong>').appendTo(charlaDesc);
	$('<p>Disertantes: '+ evento.get('Disertantes') +'</p>').appendTo(charlaDesc);
	var fechaDate = new Date(evento.get('Fecha'));
	$('<p>Fecha: '+ fechaDate.getDate() + '/' + (fechaDate.getMonth() + 1) + '/' + fechaDate.getFullYear() +'</p>').appendTo(charlaDesc);
	$('<p>Duración: '+ evento.get('Duracion') +' hs</p>').appendTo(charlaDesc);
  var createdAtDate = new Date(evento.createdAt);
  $('<p>Creado el: '+ createdAtDate.getDate() + '/' + (createdAtDate.getMonth() + 1) + '/' + createdAtDate.getFullYear() + ' ' + createdAtDate.getHours() + ':' + (createdAtDate.getMinutes() < 10 ? '0' : '') + createdAtDate.getMinutes() +'</p>').appendTo(charlaDesc);
  charlaDesc.appendTo(charla);

  // asignar la charla al artículo
  charla.appendTo(art);

  // agregar el boton para inscribirse
  $('<div class="form-group"><button class="boton boton-inscribir" onclick="inscribirse(' + "\'" + evento.id + "\'" + ')" hidden>Inscribirse</button></div>').appendTo(art);
	
  // agregar la imagen
  var divImg = $('<div class="flyer-alto"></div>');
	img.appendTo(divImg);
	
  // agregar la imagen y el contenido al div del artículo
	div.append(art);
	div.append(divImg);

  // agregar el artículo a la página
	$('#eventos').append(div);
	//$('#eventos').append(art);
	//$('#eventos').append(divImg);

  // mostrar el botón de inscribir en caso de estar logeado
  if (currentUser) {
    $('.boton-inscribir').show();
  }
}

// Función de inscribirse
function inscribirse(eventId){

  // crear un evento temporal con el id del evento correspondiente
	var evento = new (Parse.Object.extend('Evento'));
	evento.set('id',eventId);

  // agregar al usuario actual como inscripto
	evento.relation('inscriptos').add(currentUser);

  // guardar el evento con su relación
	evento.save();

  // notificar la suscripción
	alert("Te has suscripto correctamente al evento");
}
