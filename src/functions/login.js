'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');
//exactamente no se que es esto en si retorna una promesa pero esta forma de exportarla no la conosco
exports.loginUser = (email, password) => 

	new Promise((resolve,reject) => {
			// ver aqui como es que user.find().then 
		user.find({email: email})
		// Se busca al usuario
		.then(users => {

			if (users.length == 0) { // si no se encuentra un usuario

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return users[0]; // si se encuientra retorna al usuario y pasa como parametro a la siguente promesa

			}
		})

		.then(user => {
            //user aqui es el usuario encontrado 
			const hashed_password = user.hashed_password; // hace un hash con la contrasena, para compararla con el hash que que esta en la base de datos ya que seguardan contrasena encriptadas

			if (bcrypt.compareSync(password, hashed_password)) {
					// se asegura que el hash de la contrasena pasada sea igual que el hash que esta en la base de datos
				resolve({ status: 200, message: email }); // si todo esta bien retorna un objeto, con un stado http OK y retorna el email 

			} else {

				reject({ status: 401, message: 'Invalid Credentials !' });
			}
		})

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});