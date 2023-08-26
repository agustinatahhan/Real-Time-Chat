import express from 'express'
import morgan from 'morgan'
import {Server as SocketServer} from 'socket.io'
import http from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import router from './routes/message.js'
import bodyParser from 'body-parser'

//Mongoose configuration **********************************************************
let url = "mongodb+srv://agustahhan:atahhan24@cluster0.hgylyzz.mongodb.net/?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;

const app = express()
const PORT = 4000;
const server = http.createServer(app)
const io = new SocketServer(server, {
    cors: {
        origin: '*'
    }
})

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

io.on('connection', (socket) =>{

    socket.on('message', (message, nickname) => {
        console.log(message)
        socket.broadcast.emit('message', {
            body: message,
            from: nickname
        })
    })
})

app.use('/', router);

mongoose.connect(url, { useNewUrlParser: true }).then(() =>{
    
    server.listen(PORT, () =>{
		console.log(`Servidor ejecutándose en el puerto ${PORT}`);
	});
})