const methods = require('./index');
const { apiGwProxy } = require('./aws/handler-provider');

module.exports.handler = apiGwProxy(methods);