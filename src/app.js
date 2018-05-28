'use strict';

const express    = require('express');        
const app        = express();                
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const router 	   = express.Router();

//const port 	   = process.env.PORT || 8080;
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(logger('dev'));

require('./routes/routes.js')(router);
app.use('/api', router);


app.listen(app.get('port'),()=>{
		console.log('server on port ', app.get('port'));
});
