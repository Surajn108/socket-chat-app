import http from 'node:http';
import { Server} from 'socket.io';
import path from 'node:path';
import express from 'express';

async function main(){

    const app = express();
    app.use(express.static(path.resolve('./public')));
    const server = http.createServer(app);
    const io = new Server();

    io.attach(server);

    server.listen(9000 , ()=>{
        console.log(`HTTP server is running on PORT 9000`)
    });
}

main();