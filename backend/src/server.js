const express = require('express');//defini rotas
const mongoose = require('mongoose');//defini rotas
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

//o correto seria usar um banco rapido para armazenar
//esses usuarios como o Redis

mongoose.connect('mongodb+srv://ericlys:ericlys@ericyscluster-4wgfb.mongodb.net/semana09?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connectedUsers = {};

io.on('connection', socket => {
   const {user_id} = socket.handshake.query;

   connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

//GET, POST, PUT, DELETE

//req.query = Acessar query params (para filtros)
//req.params = Acessar route params (para edicao, delete)
//req. body = Acessar corpo da requisicao (para criacao, edicao)
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);


server.listen(3333);