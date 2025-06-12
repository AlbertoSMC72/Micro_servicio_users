import Express from 'express';
import Cors from 'cors';
import dotenv from 'dotenv';
import routerIndex from './src/routes/index.router.js';
import confing from './src/config/config.js';
import { createServer } from 'http';
const app = new Express();

app.use(Cors(
    {
        origin: "*",
        methods: "GET,POST,PUT,DELETE",
    }
));

dotenv.config();

app.use(Express.json());

app.use("/", routerIndex);

app.set('port', process.env.PORT);

app.all('*', (req, res) => {
    res.status(404).send("Ruta equivocada");
});

confing.connect().then(() => {
    console.log("Base de datos conectada en qa");
    const httpServer = createServer(app);
    httpServer.listen(process.env.PORT, () => {
        console.log(`Servidor en ejecución en el puerto ${process.env.PORT}`);
    });

}).catch((error) => {
    console.log(error);
})
