class ValidatePurchaseOrder {

  static isValid(orderFormData) {
    let returnObj = {
      success: true,
      message: "Success",
    };

    if (!this.isDate(orderFormData.date)) {
      returnObj = {
        success: false,
        message: "Date is not valid, must be in the format yyyy-mm-dd.",
      };
      return returnObj;
    }

    for (let i = 0; i < orderFormData.items.length ; i++) {
      let item = orderFormData.items[i]
      if (!this.isWholeNumber(item.quantity)) {
        returnObj = {
          success: false,
          message: "Item " + [i+1] + ": Quantity is not a whole positive number.",
        };
        return returnObj;
      }

      if (!this.isWholeNumber(item.unitNumber)) {
        returnObj = {
          success: false,
          message: "Item " + [i+1] + ": Unit number is not a whole positive number.",
        };
        return returnObj;
      }

      if (!this.has2MaxDecimalPlace(item.unitPrice)) {
        returnObj = {
          success: false,
          message: "Item " + [i+1] + ": Unit price should have only 2 decimal places"
        };
        return returnObj;
      }

      if (!this.has2MaxDecimalPlace(item.totalPrice)) {
        returnObj = {
          success: false,
          message: "Item " + [i+1] + ": Total price should have only 2 decimal places"
        };
        return returnObj;
      }
    }

    return returnObj;
  }

  static isDate(n) {
    var re = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    return re.test(String(n));
  }

  static isWholeNumber(n) {
    var re = /^(0|[1-9][0-9]*)$/;
    return re.test(String(n));
  }

  // TODO this validation doesnt work
  static has2MaxDecimalPlace(n) {
    var re =  /^\s*\d+\.\d{2}\s*$/;
    return re.test(String(n));
  }
}

export default ValidatePurchaseOrder;
