import React from "react"
import Task from './Task'
import { sendTasks } from '../sockets.js'
import "./bootstrap.min.css"

function WorkSpace({ tasks, size }) {
    function createTask(e) {
        if (e.target.id !== "workSpace") return
        tasks.push({
            title: "New Task",
            content: "Edit Me",
            color: "",
            size: { w: 300, h: 5 },
            pos: { x: e.clientX, y: e.clientY - 25 }
        })
        sendTasks(tasks)
    }
    function deleteTask(index, editing) {
        if (editing !== "") return
        console.log(index)
        tasks.splice(index, 1)
        sendTasks(tasks)
    }
    return (
        <div id="workSpace"
             onMouseDown={createTask}
             style={{ width: `${size.w}px`, height: `${size.h}px`}}
        >
            {tasks.map((e, i) => <Task task={e}
                                       key={i}
                                       index={i}
                                       deleteTask={deleteTask}
                                       workSpaceSize={size}
                                />)}
        </div>
    )
}

export default WorkSpace