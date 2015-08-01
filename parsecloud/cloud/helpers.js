var Image = require('parse-image');

exports.log = function(){
  var ret = '';
  for (var i = 0; i < arguments.length; i++) {
    if(typeof(arguments[i]) == 'object'){
      ret+=' ' + JSON.stringify(arguments[i]);
    }else{
      ret+=' ' + arguments[i];
    }
  }
  if(ret){
    console.log('----------------------- LOG START ------------------------');
    console.log(ret);
    console.log('------------------------ LOG END -------------------------');
  }
}

exports.sendEmail = function(toAddress,subject, htmlstring, isHtml)
{
  var Mandrill = require('mandrill');
  Mandrill.initialize('key');
  Mandrill.sendEmail({   
    "message": {
      "html" : htmlstring,
      "text" : !isHtml ? subject : '',
      "subject": isHtml ? subject : '',
      "from_email": "test@tallerparse.com",
      "from_name": "Taller Parse",
      "to": toAddress,
    },
    async: true
  },{
    success: function() {
      //response.success("Email sent!");
    },
    error: function(error) {
      console.error('Error Sending Emails! ' + JSON.stringify(error));
      //response.error("Uh oh, something went wrong");
    }
  });
};
