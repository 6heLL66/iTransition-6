import openSocket from 'socket.io-client'

const socket = openSocket()

function updateTasks(callback1, callback2) {
    socket.on("updateTasks", (data) => {
        console.log(data)
        callback1(data.tasks)
        callback2(data.size)
    })
}
function sendTasks(tasks){
    socket.emit("newTasks", tasks)
}
function updateTask(data) {
    socket.emit("updateTask", data)
}


export { updateTasks, sendTasks, updateTask }