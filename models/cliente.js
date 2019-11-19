let mongoose = require('mongoose');
let unique = require('mongoose-unique-validator');

let ClienteSchema = new mongoose.Schema({
    nombre: String,
    cif: {type: String, unique: true},
    direccion: {
        calle: String,
        cp: String,
        localidad: String
    },
    email: String,
    formaPago: String
});

ClienteSchema.plugin(unique, {message: 'Ya existe un cliente con ese CIF'});

module.exports = mongoose.model('Cliente', ClienteSchema);