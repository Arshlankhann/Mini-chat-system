const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override")
const ExpressError = require("./ExpressError.js")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
    .then(() => {
        console.log("connection is successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

//index route

app.get("/chats", async (req, res) => {
    try {
        let chats = await Chat.find();
        // console.log(chats);
        res.render("index.ejs", { chats })
    } catch (err) {
        next(err);
    }
})

//new route
app.get("/chats/new",(req, res) => {
    new ExpressError(404, "Page not found")
    res.render("new.ejs");
})

//Create Route
app.post("/chats", (req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    });
    //saving new chat db
    newChat
        .save()
        .then((res) => {
            console.log("chat was saved");
        })
        .catch((err) => {
            console.log(err)
        })
    res.redirect("/chats");
})

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}


// NEW - show Route
app.get("/chats/:id", asyncWrap(async (req, res) => {
   
        let { id } = req.params;
        let chat = await Chat.findById(id);
        if (!chat) {
            next(new ExpressError(404, "Chat not found"));
        }
        res.render("edit.ejs", { chat })
    } 
))

//Edit Route
app.get("/chats/:id/edit", asyncWrap(async (req, res) => {

        let { id } = req.params;
        let chat = await Chat.findById(id)
        res.render("edit.ejs", { chat });
    } 
))

//update route
app.put("/chats/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let { msg: newmsg } = req.body;
        console.log(newmsg);
        let updatedChat = await Chat.findByIdAndUpdate(id, { msg: newmsg }, { runValidators: true, new: true });
        console.log(updatedChat);
        res.redirect("/chats");
    } catch (err) {
       next(err)
    }
})
//destroy route
app.delete("/chats/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let deletedChat = await Chat.findByIdAndDelete(id);
        console.log(deletedChat);
        res.redirect("/chats");
    } catch (err) {
        next(err);
    }
})

app.get("/", (req, res) => {
    res.send("Root is working !");
})

// error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Some error Occured" } = err;
    res.status(status).send(message);
})

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});