import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import router from './App/router.mjs';
import helmet from 'helmet';

const app = express();

const port = process.env.PORT;

// Swagger doc : https://swagger.io/specification/
import swaggerConfig from './swagger-config.json' assert { type: 'json' }; //! Expérimental ! Seul la version Node 17.8 permet ça !
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
const openapiSpecification = await swaggerJsdoc(swaggerConfig);

app.set('trust proxy', true);

//app.use(helmet());

/* app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"],
            "script-src": ["'none'"],
            "font-src": ["'none'"],
            "style-src": ["'none'"],
            "base-uri": ["'none'"],
            "object-src": ["'none'"],
            "connect-src": ["'none'"],
            "form-action": ["'none'"],
            upgradeInsecureRequests: []
        },
        // reportOnly: true
    }),
    helmet.dnsPrefetchControl({
        allow: true, 
    }),
) */

/* app.use((req, res, next) => {
    res.setHeader(
        "Permissions-Policy",
        "geolocation=(), fullscreen=(), autoplay=(), camera=(), display-capture=(), document-domain=(), fullscreen=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), screen-wake-lock=(), xr-spatial-tracking=()"
      );
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
}); */

// app.set('x-powered-by', false);

// Cross-Origin Resource Sharing => by pass le Access-Control-Allow-Origin headers
app.use(cors({
    optionsSuccessStatus: 200,
    credentials: false, // pour envoyer des cookies et des en-têtes d'autorisations faut rajouter une autorisation avec l'option credential
    origin: "*",//! => remplacer par le bon nom de domaine en prod..
    methods: "GET, HEAD, POST, OPTION",

}));
app.use(express.json()); // le parser JSON qui récupère le payload quand il y en a un et le transforme en objet JS disponible sous request.body

app.use('/v1', router);

/* app.use((req, res) => {res.status(404).json({"Routes disponible GET /posts": "https://api-blog.romainboudet.fr/v1/posts",
"Routes disponible GET /post/:id":"https://api-blog.romainboudet.fr/v1/post/1",
"Routes disponible GET /posts/category/:id":"https://api-blog.romainboudet.fr/v1/posts/category/1",
"Routes disponible GET /category":"https://api-blog.romainboudet.fr/v1/category",
"Routes disponible POST /posts" : "https://api-blog.romainboudet.fr/v1/posts"})} ) */


// 404
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use((_, res) => {
    res.status(404).redirect(`/api-docs`, swaggerUi.serve, swaggerUi.setup(openapiSpecification));
  });



app.listen(port, () => {
    console.log(chalk.magenta(`En écoute sur le port ${port}`))
});