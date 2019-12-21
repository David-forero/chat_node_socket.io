module.exports = function(io) {//exportamos el codigo para el servidor
    let users = {};

    io.on('connection', socket =>{
        console.log('Alquien se conectó');

        //nuevos users
        socket.on('nuevo:usuario', (data, cb) => {
            if (data in users) {
                cb(false);
            }else{
                cb(true);
                socket.user = data;
                users[socket.user] = socket;
                update();
            }
        });

        //desconectado
        socket.on('disconnect', data => {
            if (!socket.user) return;
            delete users[socket.user];
            update();
        });

        socket.on('send:message', (data, cb) => {
            var msg = data.trim();
            
            if (msg.substr(0, 3) === '/w ') {//ver si esta el comando /w
                msg = msg.substr(3);
                const index = msg.indexOf(' '); //determinar donde esta el espacio en blanco
                if (index !== -1) {
                    var name = msg.substring(0, index);
                    var msg = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nickname: socket.user
                        });
                    }else{
                        cb('Error, usuario no existe');
                    }
                }
            }else{
                io.sockets.emit('send:message', {
                    msg: data,
                    nick: socket.user
                });
            }

        });

        function update() {
            io.sockets.emit('nuevo:usuario', Object.keys(users));//lo transformara en arreglo
        }

        //tipiando
        socket.on('chat:typing', (data) => {
            socket.broadcast.emit('chat:typing', {
                nick: socket.user
            }); //enviare a todos execto a mi
        });
    });
}