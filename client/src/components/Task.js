import React from 'react'
import "./bootstrap.min.css"
import * as Icon from 'react-bootstrap-icons'
import { useState, useEffect } from "react";
import { updateTask } from "../sockets";
import ReactMarkdown from 'react-markdown'


function Task({ task, index, deleteTask, workSpaceSize }) {
    const [editing, setEditing] = useState("")
    const [color, setColor] = useState(task.color)

    const [changeMode, setChangeMode] = useState(false)
    const [size, setSize] = useState({...task.size})
    const [pos, setPos] = useState({...task.pos})

    const [colorsOpacity, setColorsOpacity] = useState(0)
    const [colorsAnim, setColorsAnim] = useState(0)
    const [isAnimation, setIsAnimation] = useState("")

    const [taskValues, setTaskValues] = useState({ title: task.title, content: task.content })
    const [inputsValues, setInputsValues] = useState({ title: task.title, content: task.content })

    function setEditMode(e) {
        let elem = e.target
        let id = elem.id
        while (id === undefined || id === "") {
            elem = elem.parentNode
            id = elem.id
        }
        setEditing(id)
    }

    useEffect(() => {
        setTaskValues({...task})
        setInputsValues({...task})
        setPos({...task.pos})
        setSize({...task.size})
        setColor(task.color)
    }, [task])
    useEffect(() => {
        document.onmouseup = saveChange.bind(null, changeMode)
        document.onmousemove = e => changeProps (e, changeMode)
    }, [changeMode, saveChange])

    function unsetEditMode(e) {
        if (e.target.textContent === "Save") {
            setTaskValues({...taskValues, ...{
                [editing]: inputsValues[editing]
            }})
            updateTask({ index, task: {...taskValues, [editing]: inputsValues[editing]} })
        }
        setEditing("")
    }

    function inputsHandler(e) {
        setInputsValues({...inputsValues, ...{
            [e.target.name]: e.target.value
        }})
    }
    function changeColor(e) {
        const color = e.target.classList[1] !== "col-1"
                        ? e.target.classList[1]
                        : e.target.childNodes[0].classList[1]
        updateTask({ index, task: {...taskValues, color } })
        setColor(color)
    }
    function saveChange() {
        if (!changeMode) return
        updateTask({index, task: {
                ...taskValues,
                size: { w: size.w, h: size.h },
                pos : { x: pos.x, y: pos.y }
        }})
        setChangeMode(false)
    }

    function changeProps(e, changeMode) {
        if (!changeMode) return
        const deltaX = e.pageX - changeMode.e.pageX
        const deltaY = e.pageY - changeMode.e.pageY
        let x = false, y = false
        if (changeMode.change === "size") {
            if (size.w + deltaX > 300) x = true
            if (size.h + deltaY >= 5) y = true
            if (x && !y) setSize({ ...size, w: size.w + deltaX })
            else if (!x && y) setSize({ ...size, h: size.h + deltaY })
            else if (x && y) setSize({ w: size.w + deltaX, h: size.h + deltaY })
            setChangeMode({ e, change: "size" })
        }
        else if (changeMode.change === "pos") {
            if (pos.x + deltaX > 0 && pos.x + deltaX + size.w <= workSpaceSize.w) x = true
            if (pos.y + deltaY > 0 && pos.y + deltaY + size.h <= workSpaceSize.h) y = true
            if (x && !y) setPos({ ...pos, x: pos.x + deltaX })
            else if (!x && y) setPos({ ...pos, y: pos.y + deltaY })
            else if (x && y) setPos({ x: pos.x + deltaX, y: pos.y + deltaY })
            setChangeMode({ e, change: "pos" })
        }
    }
    function showColors() {
        if (isAnimation === "hide") clearInterval(colorsAnim)
        let opacity = colorsOpacity
        setIsAnimation("show")
        let anim = setInterval(() => {
            if (opacity >= 1) {
                setIsAnimation("")
                clearInterval(anim)
            }
            setColorsOpacity(opacity + 0.03)
            opacity += 0.03
        }, 10)
        setColorsAnim(anim)
    }
    function hideColors() {
        if (isAnimation === "show") clearInterval(colorsAnim)
        let opacity = colorsOpacity
        setIsAnimation("hide")
        let anim = setInterval(() => {
            if (opacity <= 0) {
                setIsAnimation("")
                clearInterval(anim)
            }
            setColorsOpacity(opacity - 0.03)
            opacity -= 0.03
        }, 10)
        setColorsAnim(anim)
    }
    return (
        <div className={`card pt-4 mt-3 ${color}`}
             style={{
                 width: `${String(size.w)}px`,
                 position: "absolute",
                 top: `${pos.y}px`,
                 left: `${pos.x}px`
             }}
             onMouseEnter={showColors}
             onMouseLeave={hideColors}
        >
            <Icon.XCircle className="close"
                    onClick={() => deleteTask(index, editing)}
                    opacity={colorsOpacity}
            />
            <Icon.ArrowsMove className="move"
                             opacity={colorsOpacity}
                             onMouseDown={(e) => setChangeMode({ e, change: "pos" })}
            />
            <Icon.CaretDownFill className="resize"
                                opacity={colorsOpacity}
                                onMouseDown={(e) => setChangeMode({ e, change: "size" })}
            />
            <div className="row colors" style={{ opacity: colorsOpacity }}>
                <div className="color-box col-1" onClick={changeColor}>
                    <div className="color pink"> </div>
                </div>
                <div className="color-box col-1" onClick={changeColor}>
                    <div className="color blue"> </div>
                </div>
                <div className="color-box col-1" onClick={changeColor}>
                    <div className="color yellow"> </div>
                </div>
            </div>
            <div className="card-body">
                <div className="row" style={{ display: editing === "title" ? "flex" : "none"}}>
                    <div className="col-4">
                        <input type="text"
                               className="form-control"
                               value={inputsValues.title}
                               onInput={inputsHandler}
                               name="title"
                        />
                    </div>
                    <div className="col-8">
                        <button className="btn btn-outline-success" onClick={unsetEditMode}>Save</button>
                        <button className="btn btn-outline-danger ms-2" onClick={unsetEditMode}>Cancel</button>
                    </div>
                </div>

                <h5 className="card-title"
                    style={{ display: editing !== "title" ? 'block' : "none", userSelect: 'none'}}
                    id="title"
                    onClick={setEditMode}
                >{taskValues.title}</h5>
                <span className="card-text"
                   style={{
                       display: editing !== "content" ? 'block' : "none",
                       userSelect: 'none',
                       /*height: `${String(size.h)}px`*/
                   }}
                   onClick={setEditMode}
                   id="content"
                ><ReactMarkdown>{taskValues.content}</ReactMarkdown></span>


                <div className="col"
                     style={{
                         display: editing === "content" ? "block" : "none",
                     }}
                >
                    <textarea className="form-control"
                              onInput={inputsHandler}
                              style={{ outline: 'none' }}
                              name="content"
                              value={inputsValues.content}
                    />
                    <div className="col-12 mt-2">
                        <button className="btn btn-outline-success" onClick={unsetEditMode}>Save</button>
                        <button className="btn btn-outline-danger ms-2" onClick={unsetEditMode}>Cancel</button>
                    </div>
                </div>
            </div>
            <div style={{ width: "100%", height: `${String(size.h)}px` }}> </div>
        </div>
    )
}
export default Task