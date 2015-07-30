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
