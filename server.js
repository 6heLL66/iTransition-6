const express = require("express")
const path = require("path")
const app = express()
const server = require("http").createServer(app)

const PORT = process.env.PORT || 5000

let allTasks = []
let WorkSpaceSize = { w: 1920, h: 1080 }

server.listen(PORT, () => {
    console.log("server has been started on port 5000")
})

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "client", "build")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

const io = require("socket.io")(server)

io.on("connection", socket => {
    socket.on("newTasks", tasks => {
        allTasks = tasks
        socket.broadcast.emit("updateTasks", { tasks: allTasks, size: WorkSpaceSize })
        socket.emit("updateTasks", { tasks: allTasks, size: WorkSpaceSize })
    })
    socket.on("updateTask", data => {
        allTasks[data.index] = {...data.task}
        socket.broadcast.emit("updateTasks", { tasks: allTasks, size: WorkSpaceSize })
        socket.emit("updateTasks", { tasks: allTasks, size: WorkSpaceSize })
    })
    socket.emit("updateTasks", { tasks: allTasks, size: WorkSpaceSize })
})