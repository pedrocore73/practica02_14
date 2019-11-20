let express = require('express');
let Factura = require('../models/factura');

let app = express();

app.post('/', (req, res)=>{
    let body = req.body;
    let factura = new Factura({
        cliente: body.cliente,
        numero: '001-19',
        fecha: body.fecha,
        concepto: body.concepto,
        base: body.base,
        tipo: body.tipo,
        formaPago: body.formaPago
    })
    factura.save((err, data)=>{
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            mensaje: 'Factura creada correctamente'
        })
    })
})

module.exports = app;