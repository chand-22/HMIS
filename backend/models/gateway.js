const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentGatewaySchema = new Schema({
    gateway_name: String,
    status :{type: String, enum:["active", "inactive"]},
    gateway_url: String,
    api_key: String
});

const PaymentGateway = mongoose.model('PaymentGateway', PaymentGatewaySchema);

export default PaymentGateway;