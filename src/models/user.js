'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({ 

	name 			: String,
	email			: String, 
	hashed_password	: String,
	created_at		: String,
	temp_password	: String,
	temp_password_time: String

});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/node-login').then(db => console.log('db is connected')).catch(err => console.log(err));

module.exports = mongoose.model('users', userSchema); /// aqui tiene user, pero puse users porque asi es como esta en la base de datos el nombre de la coleccion