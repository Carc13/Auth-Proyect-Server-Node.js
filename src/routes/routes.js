'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const login = require('../functions/login');
const profile = require('../functions/profile');
const config = require('../config/config.json');

module.exports = router => {


router.get('/', (req, res) => res.end('Welcome to FSS !'));

	router.post('/authenticate', (req, res) => {
		
		const credentials = auth(req); //Aqui se toma el usuario y la contrasena de req, que es la cabezera de autenticacion en http. leer sobre el middleware authe-basic 

		if (!credentials) {  //Aqui se validad de que no sea un objeto vacio

			res.status(400).json({ message: 'Invalid Request !' });

		} else {
			
			login.loginUser(credentials.name, credentials.pass) // esto es un promise que esta en la funcion login y retorna un objeto que tiene status y un mensaje, el mensaje puede ser el email si todo esta bien o un mensaje de error si paso algo 

			.then(result => { //result es el objeto con el estado y el mensaje anterior

				const token = jwt.sign(result, config.secret, { expiresIn: 1440 }); // 224 min de expirasion 1440/60

				res.status(result.status).json({ message: result.message, token: token });

			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});


	router.get('/users/:id', (req,res) => { //esta es util ya que me da como resultado el objeto en la base de datos 

		if (checkToken(req)) {  // una ves logeado el usuario todo lo que el haga necesitara confirmar el token 

			profile.getProfile(req.params.id)

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});


	router.post('/users', (req, res) => {  

		const name = req.body.name;
		const email = req.body.email;
		const password = req.body.password;

		if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			register.registerUser(name, email, password)

			.then(result => {

				res.setHeader('Location', '/users/'+email);
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});
	

function checkToken(req) {  

		const token = req.headers['x-access-token'];

		if (token) {

			try {

  				var decoded = jwt.verify(token, config.secret);

  				return decoded.message === req.params.id;

			} catch(err) {

				return false;
			}

		} else {

			return false;
		}
	}

}
