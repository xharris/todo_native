import React, { useState, useEffect, useRef } from "react"
import { cx, css, block, pickFontColor } from "style"
import OverflowDialog from "component/overflowdialog"
import { useTasks } from "util/storage"
import Input, { Label } from "component/input"
import Form from "component/form"
import Button from "component/button"

const bss = block("taskupdatedialog")

const TaskUpdateDialog = ({ id, open, onOk }) => {
  const { tasks, completeTask } = useTasks()
  const { text } = tasks[id] || {}

  useEffect(() => {
    const task = tasks[id]
    if (task && open && !task.parts_total && !task.has_dline) {
      completeTask(id, task)
      onOk()
    }
  }, [id, open])

  return (
    <OverflowDialog className={bss()} open={open} centered>
      <div className={bss("task-text")}>{text}</div>
      {tasks[id] && (
        <Form
          data={tasks[id]}
          onSubmit={(data) => {
            console.log(data)
            completeTask(id, data)
            onOk()
          }}
        >
          {({ parts_done, parts_total, has_dline }) => (
            <>
              {parts_total && (
                <div
                  key="parts"
                  className={cx(bss("form"), css({ display: "flex" }))}
                >
                  <Label text="Parts">
                    <Input
                      name="parts_done"
                      type="number"
                      min="0"
                      defaultValue={parts_done}
                    />
                  </Label>
                  {`/${parts_total}`}
                </div>
              )}
              {has_dline === true && !parts_total && (
                <Label text="Completed?">
                  <Input
                    name="completed"
                    type="checkbox"
                    defaultValue={false}
                  />
                </Label>
              )}
              <Button submit>Ok</Button>
            </>
          )}
        </Form>
      )}
    </OverflowDialog>
  )
}

export default TaskUpdateDialog
