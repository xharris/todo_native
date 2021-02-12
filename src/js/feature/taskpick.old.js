import React, { useState, useEffect, useRef } from "react"
import { cx, css, block, pickFontColor } from "style"
import { useTasks } from "util/storage"
import Button from "component/button"
import Input, { Label } from "component/input"
import Form from "component/form"
import Select from "component/select"
import { useTextScramble } from "util"
import { timeOfDay, useTimer } from "util"
import moment from "moment"
import TaskUpdateDialog from "feature/taskupdatedialog"

const bss = block("taskpick")

const TaskPick = () => {
  const { tasks, chooseTask } = useTasks()
  const [location, setLocation] = useState()
  const [randTask, setRandTask] = useState()
  const [taskText, setTaskText] = useTextScramble("What to do?")
  const [taskFinished, setTaskFinished] = useState()

  // TODO: do this in service worker?
  const { timeLeft, paused, pause, resume, reset, clear } = useTimer()

  useEffect(() => {
    // TODO: get if current location is home or NOT
    setLocation("home")
  }, [])

  useEffect(() => {
    if (randTask && tasks[randTask]) setTaskText(tasks[randTask].text)
  }, [randTask])

  useEffect(() => {
    if (timeLeft) console.log(timeLeft.seconds())
    if (timeLeft && !paused && timeLeft.seconds() <= 0) {
      pause()
      // show notification
    }
  }, [timeLeft, paused])

  return (
    <div className={bss()}>
      <TaskUpdateDialog
        id={randTask}
        open={taskFinished}
        onOk={() => {
          setRandTask()
          setTaskText("What to do?")
          setTaskFinished()
          clear()
        }}
      />
      {timeLeft ? (
        <div className={bss("started-container")}>
          <div className={bss("task")}>
            {taskText}
            <br />
            {
              /*`for ${timeLeft.humanize()}` */
              `for ${timeLeft.minutes()} min ${timeLeft.seconds()} sec`
            }
          </div>
          <div className={bss("ctrls")}>
            <Button onClick={() => (paused ? resume() : pause())}>
              {paused ? ">" : "||"}
            </Button>
            <Button
              onClick={() => {
                if (window.confirm("Stop the task completely?")) {
                  pause()
                  setTaskFinished(true)
                }
              }}
            >
              {"STOP"}
            </Button>
          </div>
        </div>
      ) : (
        <Form
          className={bss("container")}
          data={{
            list: "all",
            opposite_loc: false,
            limit: "60",
            relax: false,
            ignore_time: false,
          }}
        >
          {({ list, limit, relax, ignore_time }) => (
            <>
              <div className={bss("roll-container")}>
                <Button
                  className={bss("pick")}
                  onClick={() => {
                    setRandTask(
                      chooseTask({ list, relax, last_choice: randTask })
                    )
                  }}
                >
                  {taskText}
                </Button>
                {randTask && [
                  <div key="reroll" className={bss("reroll-text")}>
                    (Click to reroll)
                  </div>,
                  <Button
                    key="start"
                    onClick={() => {
                      reset(0.2) // parseInt(limit))
                    }}
                  >
                    {"✔"}
                  </Button>,
                ]}
              </div>
              <div className={bss("inputs")}>
                <Label text="Which list?">
                  <select name="list">
                    <option value="all" key="all">
                      Any
                    </option>
                    {Object.keys(tasks)
                      .filter(
                        (t) =>
                          t !== "_root" &&
                          !tasks[t].exclude_all &&
                          tasks[t].children &&
                          tasks[t].children.length > 0
                      )
                      .map((t) => (
                        <option value={t} key={t}>
                          {tasks[t].text}
                        </option>
                      ))}
                  </select>
                </Label>
                <Label text="Need to relax?">
                  <Input type="checkbox" name="relax" defaultValue={relax} />
                </Label>
                <Label text={`Ignore time of day (${timeOfDay()})?`}>
                  <Input
                    type="checkbox"
                    name="ignore_time"
                    defaultValue={ignore_time}
                  />
                </Label>
                <Label
                  text={
                    location === "home" ? "I'm going out" : "I'm going home"
                  }
                >
                  <Input type="checkbox" name="opposite_loc" />
                </Label>
                <Label text="Time limit?">
                  <select name="limit" defaultValue={limit}>
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="60">1 hr</option>
                    <option value="0">None</option>
                  </select>
                </Label>
              </div>
            </>
          )}
        </Form>
      )}
    </div>
  )
}

export default TaskPick
