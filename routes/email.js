let express = require('express');
let app = express();

let Factura = require('../models/factura');

app.get('/factura/:id', (req, res)=>{

    Factura.findById(req.params.id, (err, factura)=>{
        if(err){
            return res.status(500).json({
                error: err
            })
        }
        console.log(factura);
    })

})

module.exports = app;

