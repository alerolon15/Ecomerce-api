var express = require('express');
var router = express.Router();
var User = require('../../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session && req.session.user){
    res.render('perfil/cambiarPassword', {title : "Aquosa", usuario: req.session.user, bgClass:'bg-dark'});
  }else{
    res.redirect("/login")
  }
});

router.post('/',function(req,res){
  /* validaciones del registro */
  req.check('password', 'Ingrese su contraseña anterior!').notEmpty();
  req.check('nuevapassword', 'La contraseña debe tener al menos 6 caracteres!').notEmpty().isLength({min:6});
  req.check('nuevapassword_confirmation', 'Las contraseñas no coinciden!').equals(req.body.nuevapassword);
  var listaErrores = req.validationErrors();
  if (listaErrores) {
    var mensajes = [];
    listaErrores.forEach(function(error){
        mensajes.push(error.msg);
    });
    var options = {
      title: 'Aquosa',
      errores: mensajes,
      usuario: req.session.user,
      bgClass:'bg-dark',
      datos: req.body
    };
    return res.render('perfil/cambiarPassword',options);
  };
	var email = req.session.user.email;
	var viejapassword =  req.body.password;
  var nombre = req.session.user.nombre;
	var apellido = req.session.user.apellido;
  var password = req.body.nuevapassword;
  var iniciales = setIniciales(nombre,apellido);

  var data = {
    nombre,
    apellido,
    email,
    password,
    iniciales
  };
	User.findOne({email: email, password: viejapassword}, function(err,users){
		if(err){
			console.log(err);
			return res.status(500).send();
		};
    if(!users) {
			var options = {
				title: 'Aquosa',
        usuario: req.session.user,
        bgClass:'bg-dark',
        error: "<div class='alert alert-danger' role='alert'>La contraseña anterior es incorrecta.</div>",
			};
			return res.render('perfil/cambiarPassword',options);
		};
    if(users) {
      //console.log(data);

      var usuario = new User(data);

      users.update(data,function(err){
        if(err){console.log(err)};
        var options = {
          title: 'Aquosa',
          usuario: req.session.user,
          bgClass:'bg-dark',
          error: "<div class='alert alert-success' role='alert'>La contraseña se cambio correctamente.</div>"
        };
        return res.render('perfil/cambiarPassword',options);
    	});
    };
  });
});

module.exports = router;
