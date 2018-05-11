class ValidatePurchaseOrder {
  orderFormData = {
    purchaseOrderNumber: 2,
    date: today,
    quantity: '1',
    rsrnDept: '',
    description: '',
    company: '',
    totalPrice: '0.00',
    paidOnCc: '',
    unitPrice: '0.00',
    unitNumber: 1,
  }

  static isValid(orderFormData) {
    let returnObj = {
      success: true,
      message: "Success",
    };

    // if (!this.isWholeNumber(orderFormData.purchaseOrderNumber)) {
    //   returnObj = {
    //     success: false,
    //     message: "Purchase Order Number is not a whole positive number.",
    //   };
    //   return returnObj;
    // }

    if (!this.isDate(orderFormData.date)) {
      returnObj = {
        success: false,
        message: "Date is not valid, must be in the format yyyy-mm-dd.",
      };
      return returnObj;
    }

    if (!this.isWholeNumber(orderFormData.quantity)) {
      returnObj = {
        success: false,
        message: "Quantity is not a whole positive number.",
      };
      return returnObj;
    }

    if (!this.has2MaxDecimalPlace(orderFormData.unitPrice)) {
      returnObj = {
        success: false,
        message: "Unit price should have only 2 decimal places"
      };
      return returnObj;
    }

    if(!this.has2MaxDecimalPlace(orderFormData.totalPrice)) {
      returnObj = {
        success: false,
        message: "Total price should have only 2 decimal places"
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

  static has2MaxDecimalPlace(n) {
    var re = /[0-9]+(\.[0-9][0-9]?)?/;
    return re.test(String(n));
  }
}

export default ValidatePurchaseOrder;
