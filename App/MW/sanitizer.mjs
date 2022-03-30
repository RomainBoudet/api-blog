import validator from 'validator';
import chalk from 'chalk';

const capital = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
/**
 * function  capitalize : Met en majuscule la premiére lettre d'un paragraphe ou d'un mot
 * @function 
 * 
 */
const capitalize = (paragrapheOrWord) => {
    // Je découpe la string en mot que je met dans un tableau
    const allWords = paragrapheOrWord.split(' ');
    // J'enléve et récupére le 1er mot
    const firstWord = allWords.shift();
    // Je remet dans le tableau le premier mot que j'ai mis en majuscule
    allWords.unshift(capital(firstWord));
    // Je fusionne mon tableau pour retrouver une string.
   const result = allWords.join(' ');

    return result;
}

/**
 * Sanitizer Middleware
 * / Met également une majuscule sur la premiére lettre de toutes les entrée de type string.
 * @module middleware/clean
 * 
 */
const clean = (req, res, next) => {

    try {
        //On boucle sur chaque propriétées du body et on supprime tous caractéres interdit ! 
        // blacklist porte bien son nom et trim supprime les espaces avant et apres.https://www.npmjs.com/package/validator
        // on aurait pu utiliser la méthode escape plutot que blacklist mais escape enléve aussi les apostrophes et je veux les garder... et je préfére une suppression des caractéres plutot que leur conversion en entité HTML...
        // j'aurais bien mis un tableau de caractéres comme ceci: ['>','<', '&', '"', '/', '|', '#', '{', '}','='] mais blacklist me prend aussi la virgule que je veux garder...
        //a l'avenir, une regex serait peut être préférable plutot qu'un module entrainant un package en plus avec ses potentielles failles...
        //a l'avenir il faudrait également logger les cas ou on a tenté d'insérer des caractéres spéciaux.

        // String only pour le validator, je boucle sur les valeur de mon req.body et je convertie tous mon body en string.
        const theBody = Object.fromEntries(Object.entries(req.body).map(([key, value]) => [key, value.toString()]));

        for (let prop in theBody) {
            theBody[prop] = validator.blacklist(theBody[prop], ['>']);
            theBody[prop] = validator.blacklist(theBody[prop], ['<']);
            theBody[prop] = validator.blacklist(theBody[prop], ['&']);
            theBody[prop] = validator.blacklist(theBody[prop], ['"']);
            theBody[prop] = validator.blacklist(theBody[prop], ['/']);
            theBody[prop] = validator.blacklist(theBody[prop], ['|']);
            theBody[prop] = validator.blacklist(theBody[prop], ['#']);
            theBody[prop] = validator.blacklist(theBody[prop], ['{']);
            theBody[prop] = validator.blacklist(theBody[prop], ['}']);
            theBody[prop] = validator.blacklist(theBody[prop], ['[']);
            theBody[prop] = validator.blacklist(theBody[prop], [']']);
            theBody[prop] = validator.blacklist(theBody[prop], ['=']);
            theBody[prop] = validator.blacklist(theBody[prop], ['*']);
            theBody[prop] = validator.blacklist(theBody[prop], ['$']);
            theBody[prop] = validator.blacklist(theBody[prop], ['%']);
            theBody[prop] = validator.blacklist(theBody[prop], ['_']);

            // Joi trim également en backup..
            theBody[prop] = validator.trim(theBody[prop]);

            // on met en capital tout entrée en format string
            // pas d'effet sur les chiffres..
            theBody[prop] = capitalize(theBody[prop])

        }

        req.body = theBody;

        next();

    } catch (err) {

        console.trace(chalk.bgRed('Erreur dans la méthode clean du sanitizer :',
            err));

        return res.status(500).end();

    }

}

export default clean;