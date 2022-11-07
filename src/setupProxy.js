const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
	app.use(
    createProxyMiddleware('/database', {
      target: 'https://script.google.com/macros/s/AKfycbwesrsULT_ERfAPmqsTAaX34zWTqhdMRHa0ytCsJzdlF8lyvR7gVOGInOtmcTLa48U/exec', // API endpoint 1
      changeOrigin: true,
      pathRewrite: {
        "^/database": "",
      },
      headers: {
        Connection: "keep-alive"
      }
    })
  );

  
}