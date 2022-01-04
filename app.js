const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./models/db.model')()
const auth = require('./router/auth.route')
const message = require('./router/messaging.route')
const app = express();
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const http = require('http').createServer(app)
const { authModel } = require('./models/auth.model');

// const io = require('socket.io')(http, {
//      cors: {
//           origin: '*'
//      }
// })


//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public/messaging')));




//Routes
app.use('/api/auth', auth)
app.use('/api/msg', message)


/**
 * Listen on provided port, on all network interfaces.
 */


//Socket connection
const io = require("socket.io")(http, {
     cors: {
       origin: "https://rudramessage.herokuapp.com",
       methods: ["GET", "POST"]
     }
   });
io.on('connection', (socket) => {

     socket.on('online', async (data) => {
          await authModel.updateOne({ _id: data.id }, {
               $set: {
                    isActive: true
               }
          })
          console.log(data.id+"online")
          socket.broadcast.emit('online',"online")
          socket.on("disconnect", async () => {
               console.log("offline")
               await authModel.updateOne({ _id: data.id }, {
                    $set: {
                         isActive: false,
                         lastSeen: Date.now()
                    }
               })
               socket.broadcast.emit('offline',"offline")
          })
     })

     socket.on('join', (data) => {
          socket.join(data.id)
          console.log("join room "+data.id)
          socket.on('send', (data) => {
               socket.broadcast.to(data.senderid).emit('notifyme', data.id)
               socket.broadcast.to(data.senderid).emit('recieved', data);
          })
     })

});

http.listen(process.env.PORT || 3000,'192.168.1.23', () => {
     console.log('listening on *:3000');
});




//handle all routes error
app.use(errorHandler)


// module.exports = app;
