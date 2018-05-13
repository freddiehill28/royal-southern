const mongoose = require('mongoose');

const PurchaseOrderNumbersSchema = new mongoose.Schema({
  purchaseOrderNumber: {
    type: Number,
    min:1000,
    required: true,
  },
});

module.exports = mongoose.model('PurchaseOrderNumbers', PurchaseOrderNumbersSchema);
