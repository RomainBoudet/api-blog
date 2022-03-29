import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import router from './App/router.mjs';

const app = express();

const port = process.env.PORT;

app.use(cors());

app.use(express.json()); // le parser JSON qui récupère le payload quand il y en a un et le transforme en objet JS disponible sous request.body

app.use('/v1', router);

app.listen(port, () => {console.log(chalk.magenta(`En écoute sur le port ${port}`))});



