let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cors = require('cors');

let app = express();

let cliente = require('./routes/cliente');
let factura = require('./routes/factura');
let email = require('./routes/email');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/erp', {useNewUrlParser: true})
            .then(()=>{
                console.log('Conexión ok database')
            })
            .catch(err=>{
                console.log(err);
            })

app.use(cors());

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({'extended':'false'}));

app.use('/cliente', cliente);
app.use('/factura', factura);
app.use('/email', email);

app.use('/imagenes', express.static('imagenes'));
app.use('/facturas', express.static('facturas'));

app.listen(3000, ()=>{
    console.log('Servidor escuchando en http://localhost:3000');
})

