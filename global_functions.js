pe = require('parse-error'); //parse error para facilitar handling
to = promise => {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [pe(err)]);
};

//throw error
TE = (err_message, log) => {
  if (log === true) {
    console.log(err_message);
  }

  throw new Error(err_message);
};

//Response Error
ReE = (res, err, code) => {
  //en caso de que el error sea un objecto que contiene un mensaje
  if (typeof err == 'object' && typeof err.message != 'undefined') {
    err = err.message;
  }
  //si existe un codigo
  if (typeof code !== 'undefined') {
    res.statusCode = code;
  }

  return res.json({ success: false, error: err });
};

//Response success
ReS = (res, data, code) => {
  let body = { success: true, data };

  //si existe un codigo
  if (typeof code !== 'undefined') {
    res.statusCode = code;
  }
  return res.json(body);
};

// handle todas la promesas que no fueron catcheadas

NSTR = str =>
  str
    .split(' ')
    .join('')
    .toLowerCase();
