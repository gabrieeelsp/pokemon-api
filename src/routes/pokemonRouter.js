const { Router } = require('express');
const pokemonRouter = Router();

const pokemonController = require('../controllers/pokemonContoller');

const { validateName, validateAttack, validateVida, validateDefensa, validateVelocidad, validatePeso, validateAltura } = require("../utils/Validations");

pokemonRouter.get('/', async (req, res) => {

    const { name } = req.query;
    if ( name ) {
        try {
            const pokemon = await pokemonController.getOneByNombre(name);
            return res.status(200).json(pokemon);
        } catch (error) {
            return res.status(404).json({error: error.message});
        }
    }

    try {
        const pokemons = await pokemonController.getAll();
        res.status(200).json(pokemons);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

pokemonRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if ( await pokemonController.remove(id)) {
            res.status(200).json({message: 'Se ha borrado la instancia.'})
        }
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

pokemonRouter.get('/name', async (req, res) => {
    const { name } = req.query;
    
    if ( !name ) return res.status(400).json({error: 'Faltan datos'});

    try {
        const pokemon = await pokemonController.getOneByNombre(name);
        res.status(200).json(pokemon);
    } catch (error) {
        res.status(404).json({error: error.message});
    }
})


pokemonRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pokemon = await pokemonController.getOneById(id);
        res.status(200).json(pokemon);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})


pokemonRouter.post('/', async (req, res) => {
    const {nombre, imagen, vida, ataque, defensa, velocidad, altura, peso, types} = req.body;

    const errors = [];

    const errorName = validateName(nombre);
    if ( errorName !== '' ) errors.push({nombre: errorName});

    const errorVida = validateVida(vida);
    if ( errorVida !== '' ) errors.push({vida: errorVida});

    const errorAtaque = validateAttack(ataque);
    if ( errorAtaque !== '' ) errors.push({ataque: errorAtaque});

    const errorDefensa = validateDefensa(defensa);
    if ( errorDefensa !== '' ) errors.push({defensa: errorDefensa});

    const errorVelocidad = validateVelocidad(velocidad);
    if ( errorVelocidad !== '' ) errors.push({velocidad: errorVelocidad});

    const errorAltura = validateAltura(altura);
    if ( errorAltura !== '' ) errors.push({altura: errorAltura});

    const errorPeso = validatePeso(peso);
    if ( errorPeso !== '' ) errors.push({peso: errorPeso});

    if ( errors.length !== 0 ) return res.status(400).json({errors: errors});

    //if ( !nombre || !imagen || !vida || !ataque || !defensa ) return res.status(400).json({error: 'Faltan datos'})

    try {
        const item = await pokemonController.create({
                nombre, 
                imagen, 
                vida: Number(vida), 
                ataque: Number(ataque), 
                defensa: Number(defensa), 
                velocidad: velocidad === '' ? null :  Number(velocidad), 
                altura: altura === '' ? null :  Number(altura), 
                peso: peso === '' ? null : Number(peso), 
                types
            });
        res.status(203).json(item)
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

pokemonRouter.put('/:id', async (req, res) => {
    //return res.json(req.body.types)
    const { id } = req.params;

    const {nombre, imagen, vida, ataque, defensa, velocidad, altura, peso, types} = req.body;

    const errors = [];

    const errorName = validateName(nombre);
    if ( errorName !== '' ) errors.push({nombre: errorName});

    const errorVida = validateVida(vida);
    if ( errorVida !== '' ) errors.push({vida: errorVida});

    const errorAtaque = validateAttack(ataque);
    if ( errorAtaque !== '' ) errors.push({ataque: errorAtaque});

    const errorDefensa = validateDefensa(defensa);
    if ( errorDefensa !== '' ) errors.push({defensa: errorDefensa});

    const errorVelocidad = validateVelocidad(velocidad);
    if ( errorVelocidad !== '' ) errors.push({velocidad: errorVelocidad});

    const errorAltura = validateAltura(altura);
    if ( errorAltura !== '' ) errors.push({altura: errorAltura});

    const errorPeso = validatePeso(peso);
    if ( errorPeso !== '' ) errors.push({peso: errorPeso});

    if ( errors.length !== 0 ) return res.status(400).json({errors: errors});

    //if ( !nombre || !imagen || !vida || !ataque || !defensa ) return res.status(400).json({error: 'Faltan datos'})


    try {
        const item = await pokemonController.update({
                id,
                nombre, 
                imagen, 
                vida: Number(vida), 
                ataque: Number(ataque), 
                defensa: Number(defensa), 
                velocidad: velocidad === '' ? null :  Number(velocidad), 
                altura: altura === '' ? null :  Number(altura), 
                peso: peso === '' ? null : Number(peso), 
                types
            });
        res.status(203).json(item)
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

module.exports = pokemonRouter;