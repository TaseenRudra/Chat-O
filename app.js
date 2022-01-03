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
const { notify } = require('./router/auth.route');

const io = require('socket.io')(http, {
     cors: {
          origin: '*'
     }
})


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

io.on('connection', (socket) => {

     socket.on('online', async (data) => {
          await authModel.updateOne({ _id: data.id }, {
               $set: {
                    isActive: true
               }
          })
          socket.join(data.id)
          socket.broadcast.emit('online')
          socket.on("disconnect", async() => {
               await authModel.updateOne({ _id: data.id }, {
                    $set: {
                         isActive: false,
                         lastSeen:Date.now() 
                    }
               })
               socket.broadcast.emit('online')
          })
     })
     socket.on('join', (data) => {
          socket.join(data.id)
          socket.join(data.roomid);
          socket.on('send', (data) => {
               console.log("sender:"+data.senderid)
               socket.broadcast.to(data.senderid).emit('notifyme',data.id)
               socket.broadcast.to(data.roomid).emit('recieved', data)
          })
     })

});

http.listen( process.env.PORT ||3000 , () => {
     console.log('listening on *:3000');
});




//handle all routes error
app.use(errorHandler)


// module.exports = app;
