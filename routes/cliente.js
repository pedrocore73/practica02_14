let express = require('express');
let Cliente = require('../models/cliente');

let app = express();

app.post('/', (req, res)=>{
    let body = req.body;
    let cliente = new Cliente({
        nombre: body.nombre,
        cif: body.cif,
        direccion: body.direccion,
        email: body.email,
        formaPago: body.formaPago
    });
    cliente.save((err, data)=>{
        if (err) {
            return res.status(400).json({
                error: err
            });
        }

        res.status(200).json({
            mensaje: 'Cliente creado correctamente'
        });
    })
})

module.exports = app;