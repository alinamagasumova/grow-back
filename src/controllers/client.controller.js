const { models: { Client }} = require('../database');

module.exports = { 
    getAll: (req, res) => {
        Client.findAll()
        .then((data)=>res.status(200).send())
        .catch(err=>console.error(err));
    },

    registration: (req, res) => {

    },

    login: () => {

    }
};