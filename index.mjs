import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import router from './App/router.mjs';
import helmet from 'helmet';

const app = express();

const port = process.env.PORT;

app.set('trust proxy', true);

app.use(helmet());

app.use(helmet.contentSecurityPolicy({
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
    helmet.expectCt({
        maxAge: 0,
        enforce: true, 
    }),
    helmet.hsts({
        maxAge: 31536000,
        preload: true,
        includeSubDomains: true,

    }),
    helmet.frameguard({
        action: "deny",
    }),
    helmet.expectCt({
        maxAge: 86400,
        enforce: true,
    })

)

app.use((req, res, next) => {
    res.setHeader(
        "Permissions-Policy",
        "geolocation=(), fullscreen=(), autoplay=(), camera=(), display-capture=(), document-domain=(), fullscreen=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), screen-wake-lock=(), xr-spatial-tracking=()"
      );
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
});

app.set('x-powered-by', false);

// Cross-Origin Resource Sharing => by pass le Access-Control-Allow-Origin headers
app.use(cors({
    optionsSuccessStatus: 200,
    credentials: false, // pour envoyer des cookies et des en-têtes d'autorisations faut rajouter une autorisation avec l'option credential
    origin: "*",//! => remplacer par le bon nom de domaine en prod..
    methods: "GET, HEAD, POST, OPTION",

}));
app.use(express.json()); // le parser JSON qui récupère le payload quand il y en a un et le transforme en objet JS disponible sous request.body

app.use('/v1', router);

app.listen(port, () => {
    console.log(chalk.magenta(`En écoute sur le port ${port}`))
});