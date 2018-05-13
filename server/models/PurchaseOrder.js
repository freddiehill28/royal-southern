const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
  orderFormData: {
    raisedById: {type: String},
    purchaseOrderNumber: {type: String},
    date: {type: Date},
    rsrnDept: {type: String},
    company: {type: String},
    paidOnCc: {type: String},
    items: [{
      quantity: {type: String},
      description: {type: String},
      totalPrice: {type: String},
      unitPrice: {type: String},
      unitNumber: {type: String},
    }],
  }
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
