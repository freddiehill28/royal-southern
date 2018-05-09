class ValidatePurchaseOrder {
  orderFormData = {
    purchaseOrderNumber: '',
    date: '',
    quantity: '',
    rsrnDept: '',
    description: '',
    company: '',
    unitPrice: '',
    price: '',
    paidOnCc: '',
  }

  static isValid (orderFormData) {
    let returnObj = {
      success: true,
      message: "Success",
    };

    if(!this.isWholeNumber(orderFormData.purchaseOrderNumber)) {
      returnObj = {
        success: false,
        message: "Purchase Order Number is not a whole positive number.",
      };
      return returnObj;
    }

    if(!this.isDate(orderFormData.date)) {
      returnObj = {
        success: false,
        message: "Date is not valid, must be in the format yyyy-mm-dd.",
      };
      return returnObj;
    }

    if(!this.isWholeNumber(orderFormData.quantity)) {
      returnObj = {
        success: false,
        message: "Quantity is not a whole positive number.",
      };
      return returnObj;
    }
  }

  static isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  static isDate(n) {
    var re = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    return re.test(String(n));
  }

  static isWholeNumber(n) {
    var re = /^(0|[1-9][0-9]*)$/;
    return re.test(String(n));
  }
}

export default ValidatePurchaseOrder;
