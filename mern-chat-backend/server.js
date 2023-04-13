const express = require('express');
const app = express();

// get .env variables
const dotenv = require ('dotenv');
dotenv.config();

const cloudinary = require('./cloudinary');

const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

// middleware
// an Express built-in middleware to parse form data as strings or arrays
app.use(express.urlencoded({extended: true}));
// an Express built-in middleware to recognize the incoming Request Object as a JSON Object
app.use(express.json());
// use the cors middleware to allow fontend and backend to communicate
app.use(cors());

require('./connection');

// use the userRoutes middleware on /users routes
app.use('/users', userRoutes);

const Message = require('./models/MessageModel');
const User = require('./models/UserModel');

const rooms = ['general', 'tech', 'finance', 'crypto'];
app.get('/rooms', (request, response) => {
    response.json(rooms);
});


const getLastMsgsFromRoom = async (roo) => {
    let roomMsgs = await Message.aggregate([
        { $match: { to: roo } },
        { $group: { _id: '$date', msgsByDate: {$push: '$$ROOT'} } },
        { $sort: { "_id": 1 } }
    ]);
    return roomMsgs;
};

// socket.io Server Initialization
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    // will not have any cross origin errors while building our app
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// socket connection
io.on('connection', (socket) => {
    // handle different events
    socket.on('new-user', async () => {
        const members = await User.find().sort({"_id": -1});  // get all members in db
        io.emit('new-user', members);
    })

    socket.on('join-room', async (newRoom, previousRoom) => {
        socket.join(newRoom);
        socket.leave(previousRoom);
        let roomMsgs = await getLastMsgsFromRoom(newRoom);
        socket.emit('room-messages', roomMsgs);
    })

    // Handle file messages
    socket.on('file-message', async (room, imgFile, sender, time, date) => {
        try{
            // upload file to cloudinary 
            const result = await cloudinary.uploader.upload(imgFile, {
                folder: `messageImgs/${room}`,
                width: 300,
                crop: "scale"
            });
            console.log('result.secure_url:', result.secure_url);
            // create img message to db
            const imgMessage = await Message.create({
                image: {
                    public_id: result.public_id,
                    url: result.secure_url
                },
                from: sender, 
                to: room, 
                time, 
                date
            });
            // get room messages from db
            let roomMsgs = await getLastMsgsFromRoom(room);
            // sending message to room
            io.to(room).emit('room-messages', roomMsgs);
            socket.broadcast.emit('notifications', room);
        } catch (err) {
            console.log(err);
        }
    })

    socket.on('room-newMessage', async (room, content, sender, time, date) => {
        console.log('new message', content);
        const newMsg = await Message.create({
            content, 
            from: sender, 
            to: room, 
            time, 
            date
        });
        let roomMsgs = await getLastMsgsFromRoom(room);
        // sending message to room
        io.to(room).emit('room-messages', roomMsgs);
        socket.broadcast.emit('notifications', room);
    })

    app.delete('/logout', async (request, response) => {
        try {
            const { id, newMessages } = request.body;
            const user = await User.findById(id);
            // update user in db
            user.status = "offline";
            user.newMessages = newMessages;
            await user.save();
            // update members and response to frontend
            const members = await User.find();
            socket.broadcast.emit('new-user', members);
            response.status(200).send();
        } catch(err) {
            console.log(err);
            response.status(400).send();
        }
    })
});


server.listen(process.env.PORT, () => {
    console.log('listening to port', process.env.PORT);
})
