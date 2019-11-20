let mongoose = require('mongoose');

let FacturaSchema = new mongoose.Schema({
    cliente: Object,
    numero: String,
    fecha: Object,
    concepto: String,
    base: Number,
    tipo: Number,
    formaPago: String
});

module.exports = mongoose.model('Factura', FacturaSchema);
