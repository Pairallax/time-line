const server = require('./server.js');
var port = process.env.PORT || 4000;
server.listen(port, function () {
    console.log("API is up on port " + port);
});
