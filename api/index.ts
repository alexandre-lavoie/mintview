import "reflect-metadata";
import express from 'express';
import next from 'next';
import http from 'http';

const nextApp = next({dev: process.env.ENV !== `production`});
const handle = nextApp.getRequestHandler();

nextApp.prepare()
.then(async () => {
    const app = express() as any;
    const server = http.createServer(app);

    app.use(express.static('public'));

    app.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(80, () => {
        console.log('> Express: http://localhost');
    });
}).catch(ex => {
    console.error(ex.stack);
    process.exit(1);
});