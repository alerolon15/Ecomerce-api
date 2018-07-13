var express = require('express');
var router = express.Router();
var User = require('../../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login/recuperar', {title : "Aquosa", bgClass:'bg-dark'});
});

router.post('/',function(req,res){
  /* validaciones del registro */
  req.check('email', 'Ingrese un email valido!').notEmpty().isEmail();

  var listaErrores = req.validationErrors();
  if (listaErrores) {
    var mensajes = [];
    listaErrores.forEach(function(error){
        mensajes.push(error.msg);
    });
    var options = {
      title: 'Aquosa',
      errores: mensajes,
      bgClass:'bg-dark'
    };
    return res.render('login/recuperar',options);
  };

	var email = req.body.email.toLowerCase();

	User.findOne({email: email}, function(err,users){
		if(err){
			console.log(err);
			return res.status(500).send();
		};
		if(!users) {
      var options = {
        title: 'Aquosa',
        bgClass:'bg-dark',
        error: "<div class='alert alert-danger' role='alert'>El mail que ingresaste no esta registrado.</div>"
      };
      return res.render('login/recuperar',options);
    };
    if(users) {
			var options = {
				title: 'Aquosa',
        error: "<div class='alert alert-success' role='alert'>Hemos enviado un mail a tu casilla de correo.</div>",
        bgClass:'bg-dark'
			};
			return res.render('login/recuperar',options);
		};
  });
});

module.exports = router;
