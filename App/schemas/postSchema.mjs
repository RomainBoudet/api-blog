import Joi from 'joi';

const postschema = Joi.object({
    title: Joi.string()
    .max(100)
    .min(2)
    .trim()
    .pattern(new RegExp(/^[^<>&#=+*/"|{}]*$/))
    .required()
    .messages({
        'string.max': `Votre titre doit avoir une longeur maximum de {#limit} caractéres !`,
        'string.min': `Votre titre doit avoir une longeur mmin de {#limit} caractéres !`,
        'string.pattern.base': 'Le format de votre titre est incorrect : Il ne doit pas être composé d\'un de ces caractéres spéciaux : [<>&#=+*/"|]',
        'any.required': 'Le champs de votre titre ne peut pas être vide !',
        'string.empty': `Le champs de votre titre ne peut être vide !`,
    }),

    slug: Joi.string()
    .regex(/^[^<>&#=+*/"|{}]*$/)
    .max(100)
    .min(2)
    .trim()
    .required()
    .messages({
        'string.max': `Votre slug doit avoir une longeur maximum de {#limit} caractéres !`,
        'string.min': `Votre slug doit avoir une longeur mmin de {#limit} caractéres !`,
        'string.pattern.base': 'Le format de votre slug est incorrect : Il ne doit pas être composé d\'un de ces caractéres spéciaux : [<>&#=+*/"|]',
        'any.required': 'Le champs de votre slug ne peut pas être vide !',
        'string.empty': `Le champs de votre slug ne peut être vide !`,
    }),

    content: Joi.string()
    .regex(/^[^<>&#=+*/"|{}]*$/)
    .min(10)
    .trim()
    .required()
    .messages({
        'string.min': `Votre content doit avoir une longeur mmin de {#limit} caractéres !`,
        'string.pattern.base': 'Le format de votre content est incorrect : Il ne doit pas être composé d\'un de ces caractéres spéciaux : [<>&#=+*/"|]',
        'any.required': 'Le champs de votre content ne peut pas être vide !',
        'string.empty': `Le champs de votre content ne peut être vide !`,

    }),

    excerpt: Joi.string()
    .regex(/^[^<>&#=+*/"|{}]*$/) 
    .min(10)
    .trim()
    .required()
    .messages({
        'string.min': `Votre excerpt doit avoir une longeur mmin de {#limit} caractéres !`,
        'string.pattern.base': 'Le format de votre excerpt est incorrect : Il ne doit pas être composé d\'un de ces caractéres spéciaux : [<>&#=+*/"|]',
        'any.required': 'Le champs de votre excerpt ne peut pas être vide !',
        'string.empty': `Le champs de votre excerpt ne peut être vide !`,

    }),
    

    category: Joi.string()
    .regex(/^[^<>&#=+*/"|{}]*$/)
    .max(25)
    .min(2)
    .trim()
    .messages({
        'string.max': `Votre category doit avoir une longeur maximum de {#limit} caractéres !`,
        'string.min': `Votre category doit avoir une longeur mmin de {#limit} caractéres !`,
        'string.pattern.base': 'Le format de votre category est incorrect : Il ne doit pas être composé d\'un de ces caractéres spéciaux : [<>&#=+*/"|]',
    }),

    categoryId: Joi.number()
    .integer()
    .positive()
    .messages({
        'number.integer': `Votre category doit ere un chiffre entier !`,
        'number.positive': `Le champs de votre category doit être un entier positif !`,
    }),

}).xor('category', 'categoryId');

//xor permet d'accepter seulement une des deux entrée mis en paramétres
// https://joi.dev/api/?v=17.6.0#objectxorpeers-options

export default postschema;

