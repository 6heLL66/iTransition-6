import openSocket from 'socket.io-client'

const socket = openSocket()

function updateTasks(callback) {
    socket.on("updateTasks", (tasks) => {
        console.log(tasks)
        callback(tasks)
    })
}
function sendTasks(tasks){
    socket.emit("newTasks", tasks)
}
function updateTask(data) {
    socket.emit("updateTask", data)
}


export { updateTasks, sendTasks, updateTask }