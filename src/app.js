const express = require('express');
const morgan = require('morgan');
const path = require('path');
//inilizations
const app = express();

//settings
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(morgan('dev'));

//static files
app.use(express.static(path.join(__dirname, 'public')));

//Server working
const server = app.listen(app.get('port'), () =>{
    console.log('Server trabajando en el puerto', app.get('port'));
});

//websocket
const socketio = require('socket.io');
const io = socketio.listen(server);

require('./socket.js')(io);//extraemos el codigo socket.js