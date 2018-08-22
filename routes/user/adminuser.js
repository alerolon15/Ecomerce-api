const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Producto = require('../../models/producto');
const Company = require('../../models/company');
const path = require('path');
const multer = require('multer');


router.get('/listaUsuarios', function(req,res){
  if(req.session && req.session.user && req.session.user.esAdmin){
    User.find({}, function(err, users){
      if (err) {
        console.log(err);
        res.redirect('empresas/');
      }
      res.render('usuarios/lista', { usuario: req.session.user, users: users });
    });
  }else{
    res.redirect('empresas/');
  };
});

router.get('/listaUsuarios/borrar/:id', function(req,res){
  let id = req.params.id;
  console.log(req.params.id);
  if(req.session && req.session.user && req.session.user.esAdmin){
    User.findByIdAndRemove({_id:id}, function(err, users){
      if (err) {
        console.log(err);
      }
      console.log('ok')
      res.redirect('/admin/listaUsuarios');
    });
  }else{
    res.redirect('empresas/');
  };
});

router.post('/Activar', function(req, res, next) {
  let id = req.body.ID;
  let tipo = req.body.TIPO;
  let activar = req.body.Activar;
  User.findOne({_id:id}, function(err, user){
    if(err){
      res.status(400);
      res.send('Error al activar la prueba');
    };
    if (tipo == "A") {
      user.esAdmin = activar;
    }
    if (tipo == "O") {
      user.esOwner = activar;
    }
    user.save(function(error){
      if(error){
        res.status(400);
        res.send('Error al activar la prueba');
      }else{
        res.send('OK');
      };
    });
  });
});

module.exports = router;
