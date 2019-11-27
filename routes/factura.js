let express = require('express');
let Factura = require('../models/factura');
let PDFDocument = require('pdfkit');
let fs = require('file-system');

let app = express();

app.get('/', (req, res)=>{
    Factura.find({}).exec((err, data)=>{
        if(err){
            return res.status(500).json({
                error: err
            });
        }
        res.status(200).json({
            facturas: data
        })
    })
})

app.get('/:id', (req, res)=>{
    Factura.findById(req.params.id, (err, data)=>{
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        res.status(200).json({
            factura: data
        })
    })
})

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

        factura.save((err, facturaGuardada)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            const doc = new PDFDocument({
                size: [595,842],
                margins: {
                    top: 42.5,
                    bottom: 42.5,
                    left: 42.5,
                    right: 42.5
                }
            });

            let cliente = facturaGuardada.cliente.nombre;

            let fichero = (`./facturas/${facturaGuardada.numero}.pdf`).toString();

            doc.fontSize(14).text(cliente, 200, 100);

            doc.end();

            doc.pipe(fs.createWriteStream(fichero));

            res.status(200).json({
                mensaje: 'Factura creada correctamente'
            })
        })
    })

})

module.exports = app;