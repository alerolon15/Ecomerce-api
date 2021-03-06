module.exports = function Carrito(oldCart) {

    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.totalVenta * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.totalVenta;
    };

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.totalVenta;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.totalVenta;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.generateArrayCompany = function(urlkey) {
        var arr = [];
        for (var id in this.items) {
            if(this.items[id].item.urlcompanias == urlkey){
              arr.push(this.items[id]);
            };
        }
        return arr;
    };

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};
