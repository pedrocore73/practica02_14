let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cors = require('cors');

let app = express();

let cliente = require('./routes/cliente');

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

app.listen(3000, ()=>{
    console.log('Servidor escuchando en http://localhost:3000');
})
