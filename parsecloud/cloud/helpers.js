var Image = require('parse-image');

exports.sendEmail = function(toAddress,subject, string, isHtml)
{
  var Mandrill = require('mandrill');
  Mandrill.initialize('QCqjJwOnROLLZanWWYE8Eg');
  Mandrill.sendEmail({   
    "message": {
      "html" : isHtml ? string : '',
      "text" : !isHtml ? string : '',
      "subject": subject,
      "from_email": "test@tallerparse.com",
      "from_name": "Taller Parse",
      "to": toAddress,
    },
    async: true
  },{
    success: function() {
    },
    error: function(error) {
      console.error('Error Sending Emails! ' + JSON.stringify(error));
    }
  });
};
