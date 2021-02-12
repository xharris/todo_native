import React, { useState, useEffect, useRef } from "react"
import { cx, css, block, pickFontColor } from "style"
import Text from "component/text"
import { useTasks } from "util/storage"
import OverflowDialog from "component/overflowdialog"
import Input, { Label } from "component/input"
import Form from "component/form"
import { useInteractions } from "util/mobile"
import Button from "component/button"
import Select from "component/select"

const bss = block("tasklist")

const Task = ({ id }) => {
  const {
    tasks,
    updateTask,
    addTask,
    editing,
    setEditing,
    selecting,
    select,
    selected,
  } = useTasks()
  const {
    color = "#E0E0E0",
    text,
    parts_total,
    parts_done,
    dline,
    has_dline,
    exclude_all,
    day_start,
    day_mid,
    day_end,
    only_at_home,
    recur_amt,
    recur_type,
    feeling,
    children,
    archived,
  } = tasks[id] || {}
  const completion = parts_total ? (parts_done / parts_total) * 100 : 100
  const [expanded, setExpanded] = useState(true)
  const { ref, events } = useInteractions({
    onLongPress: () => !selecting && setEditing(id),
    onClickOutside: (e) => {
      /*if (editing && editing == id) {
        setEditing()
      }*/
    },
  })
  const [hasDline, setHasDline] = useState(has_dline === true)
  const disabled = editing && editing != id

  return (
    <li
      className={bss(children ? "folder" : "task", {
        editing: editing == id,
        disabled,
        archived,
      })}
    >
      <div
        className={cx(
          bss("content"),
          css({
            background: `linear-gradient(to right, ${color} ${completion}%, transparent 0%)`,
            borderColor: color, // children ? pickFontColor(color, color) : color
          })
        )}
      >
        <div
          className={bss("hitbox")}
          ref={ref}
          onClick={() => {
            if (!(disabled || selecting)) {
              if (!editing) {
                setEditing(id)
                if (ref.current)
                  setTimeout(() =>
                    ref.current.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  )
              }
            }
            if (selecting) {
              if (children && !expanded) setExpanded(true)
              else select(id)
            }
          }}
          {...events}
        >
          <Text
            className={cx(
              bss("text"),
              css({
                background: color,
                color: pickFontColor(color),
              })
            )}
          >
            {selecting && (selected[id] ? "X " : "O ")}
            {`${text}${children ? ` (${children.length})` : ""}`}
          </Text>

          {editing == id && (
            <Form
              className={cx(
                bss("form"),
                css({
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                })
              )}
              onSubmit={(data) =>
                updateTask({
                  id,
                  ...data,
                }) || setEditing()
              }
            >
              <Label text={children ? "Folder" : "Task"}>
                <Input name="text" defaultValue={text} />
              </Label>
              {children && [
                <Input
                  key="color"
                  name="color"
                  type="color"
                  defaultValue={color}
                />,
                <Label key="exclude_all" text="Exclude from 'All'?">
                  <Input
                    type="checkbox"
                    name="exclude_all"
                    defaultValue={exclude_all}
                  />
                </Label>,
              ]}
              {!children && [
                <Label key="feeling" text="Feeling">
                  <Select
                    name="feeling"
                    defaultValue={feeling || 2}
                    values={{
                      1: "Relaxing",
                      2: "Neutral",
                      3: "Important",
                    }}
                  />
                </Label>,
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
                  <Label text="/">
                    <Input
                      name="parts_total"
                      type="number"
                      min="0"
                      defaultValue={parts_total}
                    />
                  </Label>
                </div>,
                <Label key="has_dline" text="Has deadline?">
                  <Input
                    type="checkbox"
                    name="has_dline"
                    defaultValue={has_dline === true}
                    onChange={(e) => setHasDline(e.target.checked)}
                  />
                </Label>,
                hasDline && (
                  <Label key="dline" text="When?">
                    <Input type="date" name="dline" defaultValue={dline} />
                  </Label>
                ),
                <Label key="day_start" text="Morning">
                  <Input
                    type="checkbox"
                    name="day_start"
                    defaultChecked={day_start}
                  />
                </Label>,
                <Label key="day_mid" text="Afternoon">
                  <Input
                    type="checkbox"
                    name="day_mid"
                    defaultChecked={day_mid}
                  />
                </Label>,
                <Label key="day_end" text="Night">
                  <Input
                    type="checkbox"
                    name="day_end"
                    defaultChecked={day_end}
                  />
                </Label>,
                <div
                  key="recur"
                  className={cx(bss("form"), css({ display: "flex" }))}
                >
                  <Label key="recur" text="Occurs every">
                    <Input
                      type="number"
                      min="0"
                      name="recur_amt"
                      defaultValue={recur_amt}
                    />
                    <select name="recur_type" defaultValue={recur_type}>
                      <option value="none">N/A</option>
                      <option value="daily">days</option>
                      <option value="weekly">weeks</option>
                      <option value="monthly">months</option>
                      <option value="yearly">years</option>
                    </select>
                  </Label>
                </div>,
                <Label key="only_at_home" text="Only at home?">
                  <Input
                    type="checkbox"
                    name="only_at_home"
                    defaultValue={only_at_home}
                  />
                </Label>,
              ]}
              <div className={bss("footer")}>
                <Button submit value="Ok" />
                <Button onClick={() => setEditing()}>Cancel</Button>
              </div>
            </Form>
          )}
        </div>
        {children && !editing && (
          <Button onClick={(e) => setExpanded(!expanded) || e.preventDefault()}>
            {expanded ? "-" : "+"}
          </Button>
        )}
      </div>

      {children && expanded && <TaskChildren list={children} />}
      {children && (
        <Button
          className={bss("add")}
          onClick={() => !(editing || disabled) && addTask(id)}
        >
          +
        </Button>
      )}
    </li>
  )
}

const TaskChildren = ({ list }) => {
  const { tasks } = useTasks()
  return (
    <ul className={bss("children")}>
      {!list
        ? null
        : list
            .sort((a, b) =>
              tasks[a].archived == tasks[b].archived ? 0 : tasks[a] ? -1 : 1
            )
            .map((t) => <Task key={t} id={t} />)}
    </ul>
  )
}

const TaskList = () => {
  const {
    tasks,
    addTask,
    editing,
    setEditing,
    selecting,
    selected,
    toggleSelecting,
    deleteSelected,
  } = useTasks()
  return !tasks._root ? null : (
    <div className={bss({ editingroot: !!editing })}>
      <div className={bss("ctrls")}>
        <Button
          className={bss("root-edit")}
          onClick={() => toggleSelecting()}
          disabled={editing}
        >
          {selecting ? "x" : "o"}
        </Button>
        {selecting && [
          <Button key="mv">Mv</Button>,
          <Button
            key="del"
            onClick={() =>
              window.confirm(
                `Delete ${
                  Object.keys(selected).filter((id) => selected[id]).length
                } tasks?`
              ) && deleteSelected()
            }
          >
            Del
          </Button>,
        ]}
      </div>
      <TaskChildren list={tasks._root.children} root={true} />
      <Button
        className={bss("root-add")}
        onClick={() => (editing ? setEditing() : addTask(null, true))}
      >
        +
      </Button>
    </div>
  )
}

export default TaskList
