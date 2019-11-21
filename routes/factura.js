let express = require('express');
let Factura = require('../models/factura');

let app = express();

app.post('/', (req, res)=>{
    let body = req.body;
    let factura = new Factura({
        cliente: body.cliente,
        fecha: body.fecha,
        concepto: body.concepto,
        base: body.base,
        tipo: body.tipo,
        formaPago: body.formaPago
    })
    Factura.find({}).exec((err, data)=>{
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        let ultimaFra;
        if(data.length > 0) {
            ultimaFra = (data[data.length - 1]).numero.substring(0,4);
            ultimaFra = Number(ultimaFra);
        } else {
            ultimaFra = 0;
        }
        factura.numero = ('0000' + (ultimaFra + 1)).slice(-4) + '-19';
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

})

module.exports = app;