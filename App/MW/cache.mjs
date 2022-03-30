import chalk from 'chalk';
import {
    createClient
} from 'redis';



// Connexion à REDIS V4 !
let redis;
(async () => {
    redis = createClient();
    redis.on('error', (err) => console.log(chalk.magentaBright('Redis client Error', err)));
    await redis.connect();

})();

// L'objet Set (Ensemble en français) permet de stocker des valeurs uniques, 
// Une valeur donnée ne peut apparaître qu'une seule fois par Set
// mémoire qui manque a REDIS pour reetenir toutes clés clés utilisées par REDIS.
// pourquoi pas client.keys('*'); parce que c'est lent ! et pour un SGBD le plus rapide du monde, bof...
// Et trés lent si le nombre de clé augmente, car REDIS ne tient pas de registre de clé. Parcout toute sa mémoire a la recherche de clé sinon.
// Index utile pour flusher en cas d'écriture ! On pourra boucler sur cet index !
const keysIndex = new Set();

/**
 * Un objet contenant deuw MW por la mise en cache et le flush
 * @typedef {object} CacheObject
 * @property {Middleware} cache - un middleware pour la mise en cache
 * @property {Middleware} flush - un middleware pour flusher les données à chaque nouvelle insertion
 */
/**
 * Une fonction qui génére un MW prêt a l'emploi.
 * @param {object} options - Un objet "option" pour fournir la configuration du TTL et du préfix de la clé (config dans le router)
 * @returns {CacheObject} Les 2 middlewares configurés.
 */
const cacheGenerator = (options) => {

    return {
        cache: async (req, res, next) => {
            console.log(chalk.magentaBright("Redis On (cache)"));


            // le prefix devient paramétrable via l'objet options
            const theKey = `${options.prefix}:${req.originalUrl}`;


            if (await redis.exists(theKey)) {
                // on la sort du registre et on la parse en json puis on la renvoie
                const theValue = await redis.get(theKey).then(JSON.parse);
                //console.log("clé REDIS ==> ", theKey);
                console.log(chalk.magentaBright(`la valeur ${theKey} est déja dans Redis, on la renvoie depuis Redis`));
                // et on répond directement à l'utilisateur
                res.status(200).json(theValue);

            } else {

                const originalResponseSend = res.send.bind(res);

                res.send = (theResponse) => {

                    // en fait response.json fait appel à response.send
                    // tout ce que fait response.json, c'est appliquer JSON.stringify et définir le Content-Type de la réponse, avant d'appeler response.send

                    // donc en "piégeant" response.send plutôt que response.json, on s'assure de couvrir absolument tous les cas
                    // et en prime, plus besoin d'utiliser JSON.stringify plus bas, car c'est déjà appliqué au moment où response.json fait appel à response.send
                    // et inutile quand nos usagers feront directement response.send (puisqu'ils passeront alors une string)

                    // on garde une trace des clés qu'on utilise

                    keysIndex.add(theKey);

                    // on stocke la réponse dans le cache, sans la stringifier (plus besoin)
                    //sinon example :  await redis.set(`key`, JSON.stringify(value));
                    redis.SETEX(theKey, options.ttl, theResponse);

                    console.log(chalk.magentaBright(`la valeur ${theKey} n'est pas dans Redis, on la renvoie depuis postgreSQL`));

                    originalResponseSend(theResponse);
                }

                next();
            }
        },

        flush: async (req, res, next) => {

            console.log(chalk.magentaBright("Redis On (flush)"));
            //on boucle sur toutes les clés dans Redis, et pour chaque clés détenu dans l'index des clés, 
            //on la supprime et sans attendre ,
            //on passse a la prochaine clé a supprimer.
            //on supprime aussi l'index des clés a la fin.
            console.log(chalk.magentaBright("on s'aprete a flush dans Redis..."));

            for (const key of keysIndex) {
                await redis.del(key);
                console.log(chalk.magentaBright("on flush dans Redis"));
                keysIndex.delete(key);

            }

            next();
        }


    }
};

export default cacheGenerator;