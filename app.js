require('./global_functions');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('client-sessions');
const expressValidator = require('express-validator');
const multer = require('multer');
const request = require('request');
const company = require('./models/company');
const product = require('./models/product');
const fs = require('fs');

const login = require('./routes/user/login');
const registrarse = require('./routes/user/registrarse');
const cambiarPassword = require('./routes/user/cambiarPassword');
const recuperar = require('./routes/user/recuperar');
const listaPedido = require('./routes/pedidos/listaPedido');
const misPedido = require('./routes/pedidos/misPedido');
const infoPedido = require('./routes/pedidos/infoPedido');
const crearPedido = require('./routes/pedidos/crearPedido');
const agregarCarrito = require('./routes/carrito/agregarCarrito');
const carrito = require('./routes/carrito/carrito');
const v1 = require('./routes/v1');
const Empresas = require('./routes/empresas/index');
const index = require('./routes/index');

const app = express();

// mongoose conexion
mongoose.connect('mongodb://localhost:27017/Aquosa',{useMongoClient: true});
mongoose.connection.on('error', function(err){
	console.log(
		' \x1b[41m%s\x1b[0m',
		'Error al intentar conectar con MongoDB.',
		'Mensaje: ' + err.message
	);
	process.exit();
});
// esta linea crea el usuario Administrador
const crear = require('./models/crearUsuarioAdmin');

//sesiones
app.use(session({
	cookieName: 'session',
	secret: 'h17hd87ahhd917793dgasdg6',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000
}));

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use('/public', express.static('public'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Las rutas de la app
app.use('/v1', v1);
app.use('/login', login);
app.use('/registrarse', registrarse);
app.use('/cambiarPassword', cambiarPassword);
app.use('/recuperar', recuperar);
app.use('/crearPedido', crearPedido);
app.use('/listaPedido', listaPedido);
app.use('/misPedido', misPedido);
app.use('/infoPedido', infoPedido);
app.use('/agregarCarrito', agregarCarrito);
app.use('/owner', Empresas);
app.use('/empresas', index);

app.use('/', function(req, res) {
	res.redirect('/empresas');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
