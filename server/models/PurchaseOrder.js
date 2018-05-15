const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
    raisedBy: {type: String},
    raisedById: {type: String},
    purchaseOrderNumber: {type: String},
    date: {type: Date},
    rsrnDept: {type: String},
    company: {type: String},
    paidOnCc: {type: String},
    status: {type: String, default: 'Pending'},
    onCcBill: {type: Boolean, default: false},
    completed: {type: Boolean, default: false},
    items: [{
      quantity: {type: String},
      description: {type: String},
      totalPrice: {type: String},
      unitPrice: {type: String},
      unitNumber: {type: String},
    }],
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
