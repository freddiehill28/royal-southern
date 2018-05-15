class PurchaseOrders {
  static saveOrder(purchaseOrder) {
    return new Promise ((ret) => {
      fetch('api/purchaseOrder/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderFormData: purchaseOrder,
        })
      }).then(res => res.json())
        .then(json => {
          if (!json.success) {
            ret(Promise.resolve(false))
          }
          else {
            ret(Promise.resolve(true))
          }
        });
    })
  }

  static getNumber() {
    return new Promise ((ret) => {
      fetch('api/purchaseOrder/number')
        .then(res => res.json())
        .then(json => {

          console.log(json);
          if (!json.success) {
            ret(Promise.resolve(false))
          }
          else {
            ret(Promise.resolve(json.message))
          }
        }
      )
    })
  }

  static getAllForName (name) {
    return new Promise ((ret) => {
      fetch('/api/purchaseOrder/name/?name='+name)
        .then(res => res.json())
        .then(json => {
          if (!json.success) {
            ret(Promise.resolve(false))
          }
          else {
            ret(Promise.resolve(json.message))
          }
        })
    })
  }
}

export default PurchaseOrders;
