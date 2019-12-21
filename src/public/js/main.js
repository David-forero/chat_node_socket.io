$(function() {
    const socket = io();

    //DOM
    const $messageForm = $('#message-form');
    const $mensaje = $('#mensaje');
    const $chat = $('#chat');
    const $usuarios = $('#usuarios')

    //DOM form
    const $error = $('#error');
    const $login = $('#login');
    const $usuario = $('#usuario');

    //validaciones
    $login.submit(e => {
        e.preventDefault();
       socket.emit('nuevo:usuario', $usuario.val(), data => {
            if (data) {
                $('#login').hide();
                $('.chat-container').show();
                $('.conectados').show();
            }else{
                $error.html(`
                <p>*Ese usuario esta en uso</p>
                `);
            }
            $usuario.val('');
       });
    });

    //Events
    $messageForm.submit(e =>{
        e.preventDefault();
        socket.emit('send:message', $mensaje.val(), data => {
            $chat.append(`<p class='error'>${data}</p>`)
        });

        $mensaje.val('');
    });

    socket.on('send:message', function(data) {
        $('#accion').html('');
        $chat.append('<strong>' + data.nick + '</strong>:' + data.msg + '</br></br>');
    });

    socket.on('nuevo:usuario', data => {
        let html = "";
        for(let i = 0; i < data.length; i++){
            html += `<p><b class="verde">*</b>${data[i]}</p><br>`
        }
        $usuarios.html(html);
    });

    //mensaje privado
    socket.on('whisper', data => {
        $chat.append(`<p class="private"><b>${data.nickname}: </b> ${data.msg}</p> <br><br>`);
    });

    //tipiando
    $mensaje.on('keypress', function() {
        socket.emit('chat:typing', $mensaje.val());
    });

    socket.on('chat:typing', function(data) {
        let typing = "";
        typing += `<p><em>${data.nick} está escribiendo...</em></p>`;
        $('#accion').html(typing);
    }); 
});