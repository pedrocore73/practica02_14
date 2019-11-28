let express = require('express');
let app = express();
let nodemailer = require('nodemailer');

let Factura = require('../models/factura');
let env = require('../env');

app.get('/factura/:id', (req, res)=>{

    Factura.findById(req.params.id, (err, factura)=>{
        if(err){
            return res.status(500).json({
                error: err
            })
        }
        
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'japanlenovo19@gmail.com',
                pass: env.GMAIL_KEY
            }
        });

        // Autorizar (solo para Google) desde https://myaccount.google.com/lesssecureapps

        let mailOptions = {
            from: 'japanlenovo19@gmail.com',
            to: 'pjimenez@corenetworks.es',
            subject: 'Test email',
            html: `<h1>Test de email</h1>`
        }

        transporter.sendMail(mailOptions, (err, info)=>{
            if(err) {
                console.log(err);
            } else {
                console.log('Éxito total' + info.response);
            }
        })

    })

})

module.exports = app;

