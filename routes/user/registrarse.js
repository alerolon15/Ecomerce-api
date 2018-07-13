var express = require('express');
var router = express.Router();
var User = require('../../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login/registrarse', {title : "Aquosa", bgClass:'bg-dark'});
});

router.post('/',function(req,res){
  /* validaciones del registro */
  req.check('nombre', 'Ingrese un nombre!').notEmpty();
  req.check('apellido', 'Ingrese un apellido!').notEmpty();
  req.check('email', 'Ingrese un email valido!').notEmpty().isEmail();
  req.check('password', 'La contraseña debe tener al menos 6 caracteres!').notEmpty().isLength({min:6});
  req.check('password_confirmation', 'Las contraseñas no coinciden!').equals(req.body.password);
  var listaErrores = req.validationErrors();
  if (listaErrores) {
    var mensajes = [];
    listaErrores.forEach(function(error){
        mensajes.push(error.msg);
    });
    var options = {
      title: 'Aquosa',
      errores: mensajes,
      bgClass:'bg-dark',
      datos: req.body
    };
    return res.render('login/registrarse',options);
  };

	var email = req.body.email.toLowerCase();
	var password = req.body.password;
  var nombre = req.body.nombre;
	var apellido = req.body.apellido;

  var data = {
    nombre,
    apellido,
    email,
    password
  };
	User.findOne({email: email}, function(err,users){
		if(err){
			console.log(err);
			return res.status(500).send();
		};
		if(users) {
			var options = {
				title: 'Aquosa',
        error: "<div class='alert alert-danger' role='alert'>El mail con el que desea registrarse ya existe.</div>",
        bgClass:'bg-dark',
        datos: req.body
			};
			return res.render('login/registrarse',options);
		};
		if(!users) {
      var usuario = new User(data);
      usuario.save(function(err){
    		if(err){
          var options = {
            title: 'Aquosa',
            bgClass:'bg-dark',
            error: "<div class='alert alert-success' role='alert'>No se pudo crear el usuario.</div>"
          };
          return res.render('login/registrarse',options);
        }
        var options = {
          title: 'Aquosa',
          bgClass:'bg-dark',
          error: "<div class='alert alert-success' role='alert'>El Usuario ha sido creado con exito.</div>"
        };
        return res.render('login/registrarse',options);
    	});
    };
  });
});

module.exports = router;
