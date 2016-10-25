var app=require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get("/",function(req,res){
   res.send("<h1>hello World</h1>"); 
});

var ConnectionCount = 0;
io.on('connection', function(socket){
    ConnectionCount++;
    io.emit('ConnectionCount', ConnectionCount);
  console.log('a user connected total : '+ ConnectionCount);
  socket.on('player', function(msg){
    console.log('message: ' + JSON.stringify(msg));
  });
  socket.on('disconnect', function(){
      ConnectionCount--;
    console.log('user disconnected');
  });
});




http.listen(8080 || process.env.PORT, '0.0.0.0' || process.env.IP, function(){
  console.log("listening on "+process.env.PORT); 
});

