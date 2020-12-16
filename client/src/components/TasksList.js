import React from "react"
import Task from './Task'
import { sendTasks } from '../sockets.js'
import "./bootstrap.min.css"

function TasksList({ tasks }) {
    function createTask(e) {
        tasks.push({
            title: "New Task",
            content: "Edit Me",
            color: "",
            size: { w: 1, h: 5 }
        })
        sendTasks(tasks)
    }
    function deleteTask(index, editing) {
        if (editing !== "") return
        tasks.splice(index, 1)
        sendTasks(tasks)
    }
    function raiseTask(index, editing) {
        if (index === 0 || editing !== "") return
        const buffer = tasks[index]
        tasks[index] = tasks[index - 1]
        tasks[index - 1] = buffer
        sendTasks(tasks)
    }
    function lowerTask(index, editing) {
        if (index === tasks.length - 1 || editing !== "") return
        const buffer = tasks[index]
        tasks[index] = tasks[index + 1]
        tasks[index + 1] = buffer
        sendTasks(tasks)
    }
    return (
        <div className="container" id="box">
            {tasks.map((e, i) => <Task task={e}
                                       key={i}
                                       index={i}
                                       deleteTask={deleteTask}
                                       raiseTask={raiseTask}
                                       lowerTask={lowerTask} />)}
            <div className="row text-center">
                <button className="btn btn-outline-success mt-4 m-auto col-4" onClick={createTask}>Create Task</button>
            </div>
        </div>
    )
}

export default TasksList