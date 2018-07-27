const Company = require('../../models/company');
const Producto = require('../../models/producto');
const User = require('../../models/user');

exports.info = async (req, res) => {
  let urlkey = req.params.urlkey;
  let productoId = req.params.id;
  Company.find({url_key:urlkey},function(err,compania){
    Producto.findById(productoId, function(err, producto){
        if(req.session && req.session.user){
          let productoId = req.params.id;
            res.render('productos/info', { usuario: req.session.user, producto: producto, compania:compania });
        }else{
          res.render('productos/info', { producto: producto, compania:compania });
        }
    });
  });
};
