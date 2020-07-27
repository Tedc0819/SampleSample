class SaleRecord extends MongooseModel {
  static schema() {
    return {
      userName: { type: String },
      age: { type: Number },
      height: { type: Number },
      saleAmount: { type: Number },
      lastPurchasedAt: { type: Date }
    }
  }
}

module.exports = SaleRecord
