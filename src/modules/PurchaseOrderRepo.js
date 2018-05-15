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
          ret(Promise.resolve(json.success))
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

  static getOrderById (id) {
    return new Promise ((ret) => {
      fetch('/api/purchaseOrder/id/?id='+id)
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

  static updateOrderById (id, purchaseOrder) {
    return new Promise ((ret) => {
      fetch('/api/purchaseOrder/update/?id='+id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderFormData: purchaseOrder,
        })
      }).then(res => res.json())
        .then(json => {
          ret(Promise.resolve(json.success))
        });
    })
  }

  static deleteOrderById (id) {
    return new Promise ((ret) => {
      fetch('/api/purchaseOrder/delete/?id='+id, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(json => {
            ret(Promise.resolve(json.success))
        });
    })
  }
}

export default PurchaseOrders;
