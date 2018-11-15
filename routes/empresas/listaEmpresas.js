const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const User = require('../../models/user');
const Producto = require('../../models/producto');
const Company = require('../../models/company');

const rutaUnlink = path.join(__dirname, '../../public/images/empresas/');

exports.listaGet = async (req, res) => {
  let owner = req.session.user._id;
  let query = {owner:owner}
  if (req.session.user.esAdmin) {
    query = {}
  };
  Company.find(query, function(err, compania){
    if(req.session && req.session.user && req.session.user.esOwner){
      res.render('empresas/lista', { usuario: req.session.user, compania: compania });
    }else{
      res.redirect('/empresas');
    }
  });
};
exports.borrar = async (req, res) => {
  let empresaBorrar = req.params.id;
  Company.findByIdAndRemove(empresaBorrar, function(err, compania){
    let urlFile = rutaUnlink + compania.imagen_principal;
    fs.unlink(urlFile, (error) => {
      if (error) throw error;
    });
    compania.catalogo_imagenes.forEach(function(img){
      let urlFile = rutaUnlink + img;
      fs.unlink(urlFile, (error) => {
        if (error) throw error;
      });
    });
    if(err) {
      console.log(err);
    };
    Producto.remove({urlcompanias:compania.url_key}, function(err){
      if (err) {
        console.log('error al borrar los productos de la empresa.');
        console.log('MensajeError: ' + err);
      }
      if(req.session && req.session.user && req.session.user.esOwner){
        res.redirect('/owner/listaEmpresas');
      }else{
        res.redirect('/empresas');
      }
    });
  });
};
