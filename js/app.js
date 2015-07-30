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

$('#salir').click(function () {
  logout();
})

// Preguntar si hay usuario logeado o no
showLoginOrBody();

function login() {
  var usuario = $('#username').val();
  var contrasena = $('#password').val();

  console.log(usuario+'/'+contrasena);

  Parse.User.logIn(usuario, contrasena, {
    success: function(user) {
      console.log('login-success');
      showLoginOrBody();
    },
    error: function(user, error) {
      console.log('login-error');
      alert('Error en inicio de sesión.');
    }
  });
}

function logout() {
  Parse.User.logOut();
  showLoginOrBody();
}

function showLoginOrBody() {
  currentUser = Parse.User.current();
  if (currentUser) {
    $('.parse-body').show();
    $('.parse-login').hide();
  } else {
    $('.parse-login').show();
    $('.parse-body').hide();
  }
}
