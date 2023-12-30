const axios = require('axios');
const { Sequelize } = require('sequelize');

const { Pokemon, Type } = require('../db');

const getAll = async () => {
    const pokemonsDB = await getAllDB();
    const pokemonsAPI = await getAllAPI();

    return [...pokemonsDB, ...pokemonsAPI];
}

const getOneByNombre = async (nombre) => {
    const items = await Pokemon.findAll({
        where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('pokemon.nombre')), '=', nombre.toLowerCase()),
        include: {
            model: Type,
        }
    });
    if ( items.length !== 0 ) return parsePokemonLocal(items[0]); 

    const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
    return {...parsePokemon(resp.data), origin: 'remote'}
}

const getOneById = async (id) => {
    let pokemon = await Pokemon.findByPk(id, {
        include: Type
    });
    if (pokemon) return parsePokemonLocal(pokemon);

    const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return {...parsePokemon(resp.data), origin: 'remote'}
}

const validateNameApi = async (nombre) => {
    try {
        await axios.get(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
        throw new Error('Ya existe un pokemon con ese nombre.')
    } catch (error) {
        if ( error.message === 'Ya existe un pokemon con ese nombre.') return true;
    }
    return false;
}

const create = async ({nombre, imagen, vida, ataque, defensa, velocidad, altura, peso, types}) => {

    // reviso que en la api externa no exista un pokemon con ese nombre
    if ( await validateNameApi(nombre) ) throw new Error('Ya existe un pokemon con ese nombre.');

    let resp;
    try {
        resp = await Pokemon.create({nombre, imagen, vida, ataque, defensa, velocidad, altura, peso});
    } catch (error) {
        if ( error.name === 'SequelizeUniqueConstraintError') throw new Error('Ya existe un pokemon con ese nombre.');
        
        throw new Error(error.message);
    }
    if ( types ) {
        for ( let t of types ) {
            await resp.addType(t.typeId, { through: { slot: t.slot } });
        }
    }
    
    const newPokemon = await Pokemon.findByPk(resp.id,{
        include: Type
    });

    return {
        ...newPokemon.dataValues,
        types: newPokemon.dataValues.types.map(t => {return {id: t.id, nombre: t.nombre, slot: t.pokemon_type.slot}}),
        origin: 'local'
    }
};

const remove = async (id) => {
    const pokemon = await Pokemon.findByPk(id);
    if ( pokemon ) {
        await pokemon.destroy();
        return true;
    }
    throw new Error('No se encontro la instancia.')
}

const update = async ({id, nombre, imagen, vida, ataque, defensa, velocidad, altura, peso, types}) => {
    const pokemon = await Pokemon.findByPk(id, {
        include: Type,
    });

    // reviso que en la api externa no exista un pokemon con ese nombre
    if ( await validateNameApi(nombre) ) throw new Error('Ya existe un pokemon con ese nombre.');

    let resp;
    try {

        resp = await pokemon.update({nombre, imagen, vida, ataque, defensa, velocidad, altura, peso});
    } catch (error) {
        if ( error.name === 'SequelizeUniqueConstraintError') throw new Error('Ya existe un pokemon con ese nombre.');
        
        throw new Error(error.message);
    }

    const typesIds = pokemon.types.map(item => item.id);
    await pokemon.removeTypes(typesIds);
    if ( types ) {
        
        for ( let t of types ) {
            await pokemon.addType(Number(t.typeId), { through: { slot: t.slot } });
        }
    }

    await pokemon.save();    
    const newPokemon = await Pokemon.findByPk(resp.id,{
        include: Type
    });

    return {
        ...newPokemon.dataValues,
        types: newPokemon.dataValues.types.map(t => {return {id: t.id, nombre: t.nombre, slot: t.pokemon_type.slot}}),
        origin: 'local'
    }
    
};

const parsePokemonLocal = (pokemon) => {
    return {   
        ...pokemon.dataValues, 
        types: pokemon.dataValues.types.map(t => {return {id: t.id, nombre: t.nombre, slot: t.pokemon_type.slot}}),
        origin: 'local'
    }
}

const parsePokemon = (pokemon) => {
    return {
        id: pokemon.id,
        nombre: pokemon.name,
        imagen: pokemon.sprites.other['official-artwork'].front_shiny,
        vida: pokemon.stats.find(item => item.stat.name === 'hp').base_stat,
        ataque: pokemon.stats.find(item => item.stat.name === 'attack').base_stat,
        defensa: pokemon.stats.find(item => item.stat.name === 'defense').base_stat,
        velocidad: pokemon.stats.find(item => item.stat.name === 'speed').base_stat,
        altura: pokemon.height,
        peso: pokemon.weight,
        types: pokemon.types.map(type => { return {id: Number(type.type.url.split('/')[6]), slot: type.slot, nombre: type.type.name}}),
    }
}

const getAllDB = async () => {
    //hay que ver uales son los atributos que tengoque traer
    const items = await Pokemon.findAll({
        attributes: ['id', 'nombre', 'ataque', 'imagen'],
        include: {
            model: Type,
        }
    });
    
    const response = [];
    for ( let p of items) {
        response.push({
            ...p.dataValues,
            types: p.types.map(t => {return {id: t.id, nombre: t.nombre, slot: t.pokemon_type.slot}}),
            origin: 'local'    
        })
    }
    return response;
}

const getAllAPI = async () => {
    //hay que ver uales son los atributos que tengoque traer
    const resp = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');

    const requests = resp.data.results.map(item => axios.get(`https://pokeapi.co/api/v2/pokemon/${item.url.split('/')[6]}`));

    let response = []

    await Promise.all(requests)
        .then(values => response = values.map(item =>  { 
            return {
                id: item.data.id,
                nombre: item.data.name,
                ataque: item.data.stats.find(s => s.stat.name === 'attack').base_stat,
                imagen: item.data.sprites.other['official-artwork'].front_shiny,
                types: item.data.types.map(type => { return {id: Number(type.type.url.split('/')[6]), slot: type.slot, nombre: type.type.name}}),
                origin: 'remote',
            }
        }) )
        .catch(error => console.log(error))
    
    // for ( let item of resp.data.results ) {
    //     const id = item.url.split('/')[6];
    //     const r = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    //     response.push({
    //         id: id,
    //         nombre: r.data.name,
    //         ataque: r.data.stats.find(item => item.stat.name === 'attack').base_stat,
    //         imagen: r.data.sprites.other['official-artwork'].front_shiny,
    //         types: r.data.types.map(type => { return {id: Number(type.type.url.split('/')[6]), slot: type.slot, nombre: type.type.name}}),
    //         origin: 'remote',
    //     })
    // }
    return response;
}

module.exports = {
    getAll,
    getOneById,
    create,
    getOneByNombre,
    update,
    remove,
}
