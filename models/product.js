class Product {
    constructor(id,
        name,
        priceId,
        unitDescr,
        pricePerUnit,
        quantity,
        imageUrl,
        type,
        metadata) {
        this.productId = id || '';
        this.priceId = priceId || 0.00;
        this.unitDescr = unitDescr || '';
        this.pricePerUnit = pricePerUnit || 0.00;
        this.quantity = quantity || 7;
        this.imageUrls = typeof imageUrl === 'string' ? [imageUrl] : imageUrl || [];
        this.type = type || '';
        this.productName = name || '';
        this.metadata = metadata || {};
    }
}
exports.Product = Product;