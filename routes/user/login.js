var express = require('express');
var router = express.Router();
var User = require('../../models/user');


/* GET home page. */
router.get('/', function(req, res) {
  req.session.reset();
  res.render('login/login', { title: 'Aquosa', bgClass:'bg-dark' });
});

router.post('/',function(req,res){

	var email = req.body.email.toLowerCase();
	var password = req.body.password;

	User.findOne({email: email, password: password}, function(err,users){
		if(err){
			console.log(err);
			return res.status(500).send();
			req.session.reset();
		}
		if(!users) {
			req.session.reset();
			var options = {
				title: 'Aquosa',
        bgClass:'bg-dark',
        error: "<div class='alert alert-danger' role='alert'>El usuario o la contraseña no son correctas</div>"
			}
			return res.render('login/login',options)
		}
		if(users) {
			req.session.user = users;
			return res.redirect('/index')}
    });
});

module.exports = router;
