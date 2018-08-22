const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const User = require('../../models/user');
const Producto = require('../../models/producto');
const Company = require('../../models/company');

const rutaUnlink = path.join(__dirname, '../../public/images/productos/');

exports.listaGet = async (req, res) => {
  let urlkey = req.params.urlkey;
  Company.find({url_key:urlkey}, function(err, compania){
    let companiaUrlkey = compania[0].url_key;
    Producto.find({urlcompanias:companiaUrlkey}, function(err, productos){
      if(req.session && req.session.user && req.session.user.esOwner){
        res.render('productos/lista', { usuario: req.session.user, productos: productos, compania: compania });
      }else{
        res.render('productos/lista', { productos: productos, compania: compania });
      }
    });
  });
};

exports.borrarProducto = async (req, res) => {
  let productoBorrar = req.params.id;
  Producto.findByIdAndRemove(productoBorrar, function(err, producto){
    producto.imagenes.forEach(function(img){
      let urlFile = rutaUnlink + img;
      fs.unlink(urlFile, (error) => {
        if (error) throw error;
      });
    });
    if(err) {
      console.log(err);
    };
    if(req.session && req.session.user && req.session.user.esOwner){
      res.redirect('/empresas/' + req.params.urlkey + '/listaProducto');
    }else{
      res.redirect("/empresas")
    }
  });
};

exports.editarProducto = async (req, res) => {
  let urlkey = req.params.urlkey;
  let productoEditar = req.params.id;
  console.log('paso1');
  Company.find({url_key:urlkey}, function(err, compania){
    if(req.session && req.session.user && req.session.user.esOwner){
      /* validaciones del registro */
      req.check('codigo', 'Ingrese un codigo!').notEmpty();
      req.check('nombre', 'Ingrese un nombre!').notEmpty();
      req.check('descripcion', 'Ingrese una descripcion!').notEmpty()
      req.check('categoria', 'Ingrese una categoria!').notEmpty()
      req.check('stock', 'Ingrese stock!').notEmpty()

      var listaErrores = req.validationErrors();
      if (listaErrores) {
        let mensajes = [];
        listaErrores.forEach(function(error){
            mensajes.push(error.msg);
        });
        Producto.findById(productoEditar, function(err, prod){

          var options = {
            title: 'Aquosa',
            errores: mensajes,
            bgClass:'bg-dark',
            producto: prod,
            compania:compania
          }

          res.render('productos/editar',options);
          });
      }else{

        let codigo = req.body.codigo;
        let nombre = req.body.nombre;
        let descripcion = req.body.descripcion;
        let precio = req.body.precio;
        let categoria = req.body.categoria.toUpperCase();
        let stock = req.body.stock;
        let estado = 'hacer req.body.estado';
        let proveedor = { razonSocial: req.body.razonSocial, email: req.body.email };
        let proveedores = [proveedor];
        let valorCompra = req.body.valorCompra;
        let ivaCompra = req.body.ivaCompra;
        let totalCompra = req.body.totalCompra;
        let valorVenta = req.body.valorVenta;
        let ivaVenta = req.body.ivaVenta;
        let totalVenta = req.body.totalVenta;
        let indicador = { porc_rent: 'hacer req.body.porc_rent' };
        let rentabilidad = [indicador];
        let observaciones = 'hacer req.body.observaciones';

        let data = {
          codigo,
          nombre,
          descripcion,
          precio,
          categoria,
          stock,
          estado,
          proveedores,
          valorCompra,
          ivaCompra,
          totalCompra,
          valorVenta,
          ivaVenta,
          totalVenta,
          rentabilidad,
          observaciones
        };

        var producto = new Producto(data);
        Producto.findByIdAndUpdate(productoEditar, data, function(err){
          if (err) {
            Producto.find({}, function(err, productos){
              res.render('productos/lista', {
                usuario: req.session.user,
                productos: productos,
                compania: compania,
                error: "<div class='alert alert-danger' role='alert'>no se ha podido modificar correctamente el producto.</div>"
               });
            });
          } else {
            Producto.find({}, function(err, productos){
              res.render('productos/lista', {
                usuario: req.session.user,
                productos: productos,
                compania: compania,
                error: "<div class='alert alert-success' role='alert'>Se ha modificado correctamente el producto.</div>"
               });
            });
          };
        });
      };
    }else{
      res.redirect('/');
    };
  });
};
