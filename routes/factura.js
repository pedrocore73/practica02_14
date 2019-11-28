let express = require('express');
let Factura = require('../models/factura');
let PDFDocument = require('pdfkit');
let fs = require('file-system');

let app = express();

function getRedond(valor, decimales) {
    let valorRedond;
    let factor = Math.pow(10, decimales);
    if(valor < 0) {
      valorRedond = (Math.round(valor * -1 * factor) / factor) * -1;
    } else {
      valorRedond = Math.round(valor * factor) / factor;
    }
    return Number(valorRedond);
}

function getFormat(valor, decimales) {
    let valorFormat = new Intl.NumberFormat("en-EN", {minimumFractionDigits: decimales}).format(valor) + ' €';
    valorFormat = valorFormat.replace(/[,.]/g, char => (char === ',' ? '.': ','));
    return valorFormat;
}

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
            let calle = facturaGuardada.cliente.direccion.calle;
            let cp = facturaGuardada.cliente.direccion.cp;
            let localidad = facturaGuardada.cliente.direccion.localidad;
            let cif = facturaGuardada.cliente.cif;
            let email = facturaGuardada.cliente.email;
            let numero = facturaGuardada.numero;
            let fechaUTC = new Date(facturaGuardada.fecha);
            let fecha = fechaUTC.getDate() + '/' + (fechaUTC.getMonth() + 1) + '/' + fechaUTC.getFullYear();
            let concepto = facturaGuardada.concepto;
            let formaPago = facturaGuardada.formaPago;
            let base = getRedond(facturaGuardada.base, 2);
 
            let tipo = facturaGuardada.tipo;
 
            let importeIVA = getRedond(facturaGuardada.base * facturaGuardada.tipo, 2);

            let total = getRedond(facturaGuardada.base + (facturaGuardada.base * facturaGuardada.tipo), 2);

            let baseFormat = getFormat(base, 2);
            let tipoFormat = (tipo * 100) + ' %';
            let importeIVAFormat = getFormat(importeIVA, 2);
            let totalFormat = getFormat(total, 2);
            
            let fichero = (`./facturas/${facturaGuardada.numero}.pdf`).toString();
            doc.margins = { top: 72, bottom: 72, left: 72, right: 72};

            doc.path("M64.47,79.1,89.58,54l-10,2.73a57.63,57.63,0,0,0-26,14.63L45.86,79.1a13.15,13.15,0,0,0,18.61,0ZM56.1,73.86A53.19,53.19,0,0,1,77.54,61L62,76.6a9.53,9.53,0,0,1-6.8,2.82,9.63,9.63,0,0,1-3.84-.79Z").fillAndStroke("#ec652a");
            doc.path("M61.06,117.28,68.8,125a13.16,13.16,0,0,0,0-18.62L43.7,81.3l2.73,10A57.63,57.63,0,0,0,61.06,117.28Zm5.24-8.38a9.65,9.65,0,0,1,2,10.64l-4.77-4.77A53.12,53.12,0,0,1,50.73,93.33Z").fillAndStroke("#1e2a38");
            doc.path("M105.44,98.29a13.11,13.11,0,0,0-9.3,3.85L71,127.25l10-2.73a57.65,57.65,0,0,0,26-14.64l7.74-7.74a13.08,13.08,0,0,0-9.31-3.85Zm-.93,9.09a53,53,0,0,1-21.44,12.83l15.57-15.57a9.61,9.61,0,0,1,10.64-2Z").fillAndStroke("#ec652a");
            doc.path("M91.81,74.84,116.91,100l-2.73-10A57.63,57.63,0,0,0,99.55,64l-7.74-7.74A13.16,13.16,0,0,0,91.81,74.84Zm.48-13.13,4.76,4.76a53.12,53.12,0,0,1,12.83,21.44L94.31,72.34A9.63,9.63,0,0,1,92.29,61.71Z").fillAndStroke("#1e2a38");

            doc.font('Helvetica-Bold').fontSize(16).fill('#68676f').text('ACME, S.A.', 415, 60);
            doc.font('Helvetica').fontSize(14).fill('#68676f').text('Serrano Galvache, 56', 415, 82);
            doc.fontSize(14).text('28033 Madrid', 415, 104);
            doc.fontSize(14).text('CIF A12345678', 415, 126);

            doc.fontSize(20).fill('#eb642a').text('Factura', 250, 140);

            doc.rect(40, 170, 515, 120).stroke('#68676f');
            doc.fontSize(14).fill('#68676f').text(`Cliente: ${cliente}`, 50, 180);
            doc.fontSize(14).text(`Domicilio: ${calle}`, 50, 202);
            doc.fontSize(14).text(`C.P.: ${cp} Localidad: ${localidad}`, 50, 224);
            doc.fontSize(14).text(`CIF: ${cif}`, 50, 246);
            doc.fontSize(14).text(`Correo electrónico: ${email}`, 50, 268);

            doc.rect(40, 290, 150, 30).stroke('#68676f');
            doc.rect(190, 290, 365, 30).stroke('#68676f');
            doc.fontSize(14).text(`Número fra.: ${numero}`, 50, 300);
            doc.fontSize(14).text(`Fecha: ${fecha}`, 200, 300);

            doc.rect(40, 320, 515, 360).stroke('#68676f');
            doc.fontSize(14).text(concepto, 50, 330);

            doc.rect(40, 680, 300, 90).stroke('#68676f');
            doc.fontSize(14).text('Forma de pago:', 50, 690);
            doc.fontSize(14).text(formaPago, 50, 712);

            doc.rect(340, 680, 215, 30).stroke('#68676f');
            doc.fontSize(14).text('Base imponible:', 350, 690);
            doc.fontSize(14).text(baseFormat, 425, 690, {width: 120, align: 'right'});

            doc.rect(340, 710, 215, 30).stroke('#68676f');
            doc.fontSize(14).text(`IVA ${tipoFormat}:`, 350, 720);
            doc.fontSize(14).text(importeIVAFormat, 425, 720, {width: 120, align: 'right'});

            doc.rect(340, 740, 215, 30).stroke('#68676f');
            doc.fontSize(14).text('Total factura:', 350, 750);
            doc.fontSize(14).text(totalFormat, 425, 750, {width: 120, align: 'right'});


            doc.end();


            doc.pipe(fs.createWriteStream(fichero));

            res.status(200).json({
                mensaje: 'Factura creada correctamente'
            })
        })
    })

})

module.exports = app;