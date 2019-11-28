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
            html: `
                <body style="margin: 0; padding: 20px; background-color: #cacaca;">
                    <table style="background-color: white; display: block; width: 600px; max-width: calc(100% - 40px); padding: 20px; margin: 20px auto;">
                        <tbody style="display: block; width: 100%">
                            <tr style="display: block; width: 100%">
                                <td style="display: block; width: 100%; text-align: center;">
                                    <img src="http://localhost:3000/imagenes/logo.svg" style="height: 80px">
                                </td>
                            </tr>
                            <tr style="display: block; width: 100%">
                                <td style="display: block; width: 100%;">
                                    <p style="font-family: Arial, Helvetica, sans-serif;">
                                        Estimado cliente,
                                    </p>
                                    <p style="font-family: Arial, Helvetica, sans-serif;">
                                        Adjunto a la presente le remitimos la factura por los servicios prestados recientemente.
                                    </p>
                                </td>
                            </tr>
                            <tr style="display: block; width: 100%">
                                <td style="display: block; width: 100%; text-align: center;">
                                    <a href="#" target="_blank" style="text-decoration: none; border: none; border-radius: 5px; background-color: #eb642a; color: white; font-family: Arial, Helvetica, sans-serif; padding: 12px 18px; margin: 40px 0;">Descargar factura</a>
                                </td>
                            </tr>
                            <tr style="display: block; width: 100%">
                                <td style="display: block; width: 100%;">
                                    <p style="font-family: Arial, Helvetica, sans-serif;">
                                        Atentamente.
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </body>
            `
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

