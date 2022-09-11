import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import router from './App/router.mjs';
import helmet from 'helmet';

const app = express();

const port = process.env.PORT;

// Swagger doc : https://swagger.io/specification/
// (Plus de ressource dans le fichier router.mjs)

// ancienne méthode mais plante sur un server tournant avec la LTS. Et si on passe en 17.8.0 : erreur au build....
// source => https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
// import swaggerConfig from './swagger-config.json' assert { type: 'json' }; //! Expérimental ! Seul la version Node 17.8 permet ça !

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerConfig = require("./swagger-config.json");

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
const openapiSpecification = await swaggerJsdoc(swaggerConfig);

app.set('trust proxy', true);

// CSP pour swagger !
// Faillible ? https://bhavesh-thakur.medium.com/content-security-policy-csp-bypass-techniques-e3fa475bfe5d 
// test : 1. https://csp-evaluator.withgoogle.com/  2. https://cspvalidator.org/
app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"],
            "script-src": ["'self'"],
            "font-src": ["'none'"],
            "style-src": ["'self'"], // reste du rouge en console avec des inlines style de swagger..
            "base-uri": ["'none'"],
            "object-src": ["'none'"],
            "connect-src": ["'self'"], //si 'none', je peux plus utiliser curl avec la doc swagger ! 
            "form-action": ["'none'"],
            upgradeInsecureRequests: []
        },
        // reportOnly: true
    }),
    helmet.dnsPrefetchControl({
        allow: true, 
    }),
)

// Cross-Origin Resource Sharing => by pass le Access-Control-Allow-Origin headers
app.use(cors({
    optionsSuccessStatus: 200,
    credentials: false, // pour envoyer des cookies et des en-têtes d'autorisations faut rajouter une autorisation avec l'option credential
    origin: ["https://api-blog.romainboudet.fr", "https://blog.romainboudet.fr"],//! => remplacer par le bon nom de domaine en prod..
    methods: "GET, HEAD, POST, OPTION",
}));

app.use(express.json()); // le parser JSON qui récupère le payload quand il y en a un et le transforme en objet JS disponible sous request.body

app.use('/v1', router);

// 404 => la doc swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use((_, res) => {
    res.status(404).redirect(`/api-docs`, swaggerUi.serve, swaggerUi.setup(openapiSpecification));
  });

app.listen(port, () => {
    console.log(chalk.magenta(`En écoute sur le port ${port}`))
});