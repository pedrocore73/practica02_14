let express = require('express');
let Cliente = require('../models/cliente');

let app = express();

app.get('/', (req, res)=>{
    Cliente.find({}).exec((err, data)=>{
        if(err){
            return res.status(500).json({
                error: err
            });
        }
        res.status(200).json({
            clientes: data
        })
    })
})

app.get('/search/:nombre', (req, res)=>{
    let termino = (req.params.nombre).normalize('NFD').replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").normalize().toLowerCase();
    Cliente.find({termino: {$regex: termino}}).exec((err, data)=>{
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        res.status(200).json({
            clientes: data
        })
    })

})

app.get('/:id', (req, res)=>{
    Cliente.findById(req.params.id, (err, data)=>{
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        if(data === null) {
            return res.status(200).json({
                cliente: null,
                mensaje: 'El cliente ya no existe'
            })
        }
        res.status(200).json({
            cliente: data
        })
    })
})


app.post('/', (req, res)=>{
    let body = req.body;
    let cliente = new Cliente({
        nombre: body.nombre,
        termino: (body.nombre).normalize('NFD').replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").normalize().toLowerCase(),
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

app.put('/:id', (req, res)=>{
    let body = req.body;

    Cliente.findById(req.params.id, (err, cliente)=>{
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        if(cliente === null) {
            return res.status(200).json({
                cliente: null,
                mensaje: 'El cliente ya no existe'
            })
        }
        cliente.nombre = body.nombre;
        cliente.termino = (body.nombre).normalize('NFD').replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").normalize().toLowerCase();
        cliente.direccion = body.direccion;
        cliente.email = body.email;
        cliente.formaPago = body.formaPago;

        cliente.save((err, clienteMod)=>{
            if(err) {
                res.status(500).json({
                    error: err
                })
            }
            res.status(200).json({
                mensaje: 'El cliente ' + clienteMod.nombre + ' fue modificado.'
            })
        })
    })

})

app.delete('/:id', (req, res)=>{
    Cliente.findByIdAndRemove(req.params.id, (err, data)=>{
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            mensaje: 'Cliente eliminado correctamente'
        })
    })
})

module.exports = app;