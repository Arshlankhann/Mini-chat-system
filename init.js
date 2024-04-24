const mongoose = require("mongoose");
const Chat = require("./models/chat.js");
main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp')
}

let allChats = [
    {
        from: "arsh",
        to: "Ashish",
        msg: "whats up bro",
        created_at: new Date(),
    },
    {
        from: "arshlan khan",
        to: "chandu",
        msg: "i am fine what about you",
        created_at: new Date(),
    },
    {
        from: "safal",
        to: "chandu",
        msg: "where are you going",
        created_at: new Date(),
    },
    {
        from: "sakir",
        to: "arsh",
        msg: "send me details about you",
        created_at: new Date(),
    },
    {
        from: "wasey",
        to: "ashish",
        msg: "every thing is good",
        created_at: new Date(),
    }
]

Chat.insertMany(allChats);