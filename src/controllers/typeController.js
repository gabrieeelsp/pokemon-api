const axios = require('axios');

const { Type } = require('../db');

const getAll = async () => {

    if ( await Type.count() === 0 ) {
        console.log('Buscando types... -> https://pokeapi.co/api/v2/type');
        const resp = await axios.get('https://pokeapi.co/api/v2/type');
        console.log('Procesando types...');
        const types = resp.data.results.map(item => {
            return {
                id: Number(item.url.split('/')[6]),
                nombre: item.name
            }
        })
        const a = await Type.bulkCreate(types);        
    }

    const items = await Type.findAll();
    return items;
}

module.exports = {
    getAll,
}