import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from 'react'
import {InteractionManager} from 'react-native'
import {nanoid} from 'nanoid/non-secure'
import moment from 'moment'
import {choicew} from 'util/math'
import {timeOfDay} from '.'
import AsyncStorage from '@react-native-async-storage/async-storage'

const most = (arr) => {
  const occur = {}
  let max_occur = 0
  let max_v
  arr.forEach((v) => {
    v = v.toString()
    if (v != null) {
      if (!occur[v]) occur[v] = 0
      occur[v]++
      if (occur[v] > max_occur) {
        max_occur = occur[v]
        max_v = v
      }
    }
  })
  return max_v
}

export const StorageCtx = createContext({
  loaded: false,
  data: {},
  updateData: () => {},
  state: {},
  updateState: () => {},
})

export const StorageProvider = ({name, data: _data, dev, ...props}) => {
  const [loaded, setLoaded] = useState()
  const [data, setData] = useState(_data || {})
  const [state, setState] = useState({})
  const full_name = `${name}_data`

  const {getItem, setItem} = AsyncStorage

  useEffect(() => {
    if (!dev) {
      if (data && loaded)
        setItem(full_name, JSON.stringify(data)).catch(() => {})
      if (!loaded)
        getItem(full_name)
          .then((d) => {
            if (d) setData(JSON.parse(d))
          })
          .catch(() => {})
          .finally(() => {
            setLoaded(true)
          })
    }
  }, [data, dev, full_name, loaded, getItem, setItem])

  return (
    <StorageCtx.Provider
      value={{
        loaded,
        data,
        updateData: (d) => setData({...data, ...d}),
        state,
        updateState: (s) => setState({...state, ...s}),
      }}
      {...props}
    />
  )
}

export const useStorage = () => useContext(StorageCtx)

export const TaskProvider = ({...props}) => (
  <StorageProvider
    name="todo"
    data={{tasks: {_root: {children: []}}}}
    {...props}
  />
)

export const useTasks = () => {
  const {loaded, data, updateData, state, updateState} = useStorage()
  useEffect(() => {
    if (loaded && (!data.tasks || !data.tasks._root)) {
      console.log('loaded')
      updateData({tasks: {_root: {children: []}}})
    }
    // console.log(loaded, data.tasks)
  }, [loaded, data, updateData])
  const getTask = useCallback(
    (id) => {
      const {feeling, children, parts_done, parts_total, ...task} = data.tasks[
        id
      ]
      return task
        ? {
            ...task,
            id: id,
            children,
            feeling: feeling == null && !children ? 2 : parseInt(feeling, 10),
            parts_done: parts_total ? parseInt(parts_done || 0, 10) : null,
            parts_total,
          }
        : {}
    },
    [data],
  )
  const getTasks = () => {
    const tasks = data.tasks
    Object.keys(data.tasks).forEach((t) => (tasks[t] = getTask(t)))
    return tasks
  }
  const updateTask = ({id, ...props}) => {
    const old_data = getTask(id)

    if (props.parts_done) props.parts_done = parseInt(props.parts_done)
    if (props.parts_total) props.parts_total = parseInt(props.parts_total)

    updateData({
      tasks: {...data.tasks, [id]: {...old_data, ...props}},
    })
  }
  const addTask = (id, is_folder) => {
    const parentid = id || '_root'
    const newid = nanoid(5)
    const tasks = getTasks()
    if (!tasks[parentid] && parentid === '_root') {
      tasks._root = {
        children: [],
      }
    }
    const children = tasks[parentid].children || []
    updateData({
      tasks: {
        ...tasks,
        [parentid]: {
          ...tasks[parentid],
          children: [...children.filter((oldid) => oldid != newid), newid],
        },
        [newid]: {
          text: is_folder ? 'new list' : 'new task',
          children: is_folder ? [] : null,
          feeling: is_folder
            ? null
            : most(children.map((c) => tasks[c].feeling)),
        },
      },
    })
  }
  const moveTask = (id, new_parent_id) => {
    // remove from any previous parent
    // add to new parent
  }
  const deleteSelected = () => {
    const tasks = getTasks()
    const selected = state.selected
      ? Object.keys(state.selected).filter((s) => state.selected[s])
      : []
    Object.keys(tasks).forEach((t) => {
      const task = tasks[t]
      // remove from child arrays
      if (task.children)
        task.children = task.children.filter((c) => !state.selected[c])
    })
    selected.forEach((id) => {
      // remove from list
      delete tasks[id]
    })
    updateData({tasks})
  }
  const archiveSelected = () => {
    const tasks = getTasks()
    const selected = state.selected
      ? Object.keys(state.selected).filter((s) => state.selected[s])
      : []
    selected.forEach((id) => {
      if (!tasks[id].children) tasks[id].archived = true
    })
    updateData({tasks})
  }
  const unarchiveSelected = () => {
    const tasks = getTasks()
    const selected = state.selected
      ? Object.keys(state.selected).filter((s) => state.selected[s])
      : []
    selected.forEach((id) => {
      if (!tasks[id].children) tasks[id].archived = false
    })
    updateData({tasks})
  }
  const getLastCompleted = () => {
    const tasks = getTasks()
    let max_last_done = 0
    let max_task
    Object.keys(tasks).forEach((t) => {
      const task = tasks[t]
      if ((!max_last_done && task.last_done) || task.last_done < max_task) {
        max_last_done = task.last_done
        max_task = {...task, id: t}
      }
    })
    return max_task
  }
  return {
    loaded,
    tasks: data.tasks,
    getTask,
    updateTask,
    addTask,
    editing: state.editing,
    setEditing: (id) => updateState({editing: id}),
    selecting: state.selecting,
    toggleSelecting: () =>
      updateState({selected: {}, selecting: !state.selecting}),
    select: (id) => {
      const selected = {...state.selected}
      const is_folder = data.tasks[id].children != null
      const tasks = getTasks()
      selected[id] = selected[id] == null ? true : !selected[id]

      if (is_folder) {
        const ids = tasks[id].children
        ids.forEach((c) => (selected[c] = selected[id]))
      } else {
        if (!selected[id])
          Object.entries(tasks).forEach(([t, task]) => {
            if (task.children && task.children.includes(id)) selected[t] = false
          })
      }

      updateState({
        tasks,
        selected,
      })
    },
    completeTask: (id, opt) => {
      let {
        parts_done,
        parts_total,
        recur_amt,
        recur_type,
        has_dline,
        dline,
        completed,
      } = opt

      // (deadline or parts) and no recurrence -> archive
      if (
        (has_dline === true || parts_total) &&
        (!recur_type || recur_type === 'none')
      ) {
        console.log('update a')
        updateTask({
          id,
          parts_done: parts_total ? parts_done : null,
          archived: parts_done >= parts_total || completed,
          last_done: moment().valueOf(),
        })
      }
      // recurrence -> reset dline if exists (or do nothing)
      else if (recur_type !== 'none' && has_dline === true) {
        console.log('update b')
        updateTask({
          id,
          parts_done: parts_total ? 0 : null,
          dline: moment(dline).add(recur_amt, recur_type).valueOf(),
          last_done: moment().valueOf(),
        })
      } else {
        console.log('update c')
        updateTask({id, last_done: moment().valueOf()})
      }
    },
    selected: state.selected || {},
    deleteSelected,
    getLastCompleted,
    archiveSelected,
    unarchiveSelected,
    chooseTask: (options) => {
      console.log('### CHOOSING ###')
      const tasks = getTasks()
      const time_of_day = timeOfDay()

      // get feeling to use
      const feelings = options.relax ? [1] : [1, 2, 3]
      const last_completed = getLastCompleted()
      const focus = options.relax
        ? 1
        : last_completed
        ? (last_completed.feeling % feelings.length) + 1
        : feelings[0]

      const list_ids = Object.keys(tasks).filter((id) => tasks[id].children)
      let task_list = Object.keys(tasks)
        .map((t) => ({
          ...tasks[t],
          id: t,
        }))
        // filter out irrelevant tasks
        .filter(
          (task) =>
            // not completed/archived
            !task.archived &&
            (!task.parts_total || task.parts_done < task.parts_total) &&
            !task.children && // no folders
            (feelings.includes(task.feeling) || options.list !== 'all') && // focus
            // time of day
            (options.ignore_time ||
              task[time_of_day] === true ||
              task[time_of_day] == null) &&
            // list
            (options.list === 'all' ||
              tasks[options.list].children.includes(task.id)) &&
            (options.list !== 'all' ||
              list_ids.every(
                (id) =>
                  !(
                    tasks[id].children.includes(task.id) &&
                    tasks[id].exclude_all
                  ),
              )),
        )

      // mean_norm
      const key_cache = {}
      let mean_norm = (task, key, fn, inverse) => {
        let [min, max, sum, avg] = key_cache[key] || []
        if (!key_cache[key]) {
          avg = 0
          sum = 0
          task_list.forEach((task) => {
            if (fn) task[key] = fn(task)
            max = max == null ? task[key] : Math.max(task[key], max)
            min = min == null ? task[key] : Math.min(task[key], min)
            avg += task[key]
          })
          avg /= task_list.length
        }
        key_cache[key] = [min, max, sum, avg]
        const x = task[key]
        let n = (x - min) / (max - min)
        if (inverse) n = 1 - n
        return Math.max(isNaN(n) ? 1 : n, 0.1)
      }
      // pick a weight method
      let weight = (t) => 1
      if (task_list.some((task) => task.has_dline === true)) {
        const now = moment().valueOf()
        const longest_due_date = Math.max(
          ...task_list.map((task) =>
            task.has_dline === true ? moment(task.dline).valueOf() : now,
          ),
        )
        weight = (task) => {
          const time_left = (task2) => {
            const recur2time = {
              daily: 'd',
              weekly: 'w',
              monthly: 'M',
              yearly: 'y',
            }
            const last_done = moment(task2.last_done)
            const due_date =
              task2.has_dline === true
                ? // use dline
                  moment(task2.dline)
                : // today + recurrence_amt
                task2.recur_type && task2.recur_type !== 'none'
                ? last_done.add(task2.recur_amt, recur2time[task2.recur_type])
                : // no deadline, use longest deadline
                  moment(longest_due_date)
            return Math.round(
              Math.abs(
                moment.duration(moment().startOf('day') - due_date).asDays(),
              ),
            )
          }
          // relation to current 'focus'
          const feeling = (task2) => Math.abs(task2.feeling - focus)
          const moore_x = (task2) =>
            mean_norm(task2, 'feeling', feeling, true) /
            mean_norm(task2, 'time_left', time_left, true)
          /*
          console.log(task.text, {
            feeling: mean_norm(task, "feeling", feeling, true),
            time_left: mean_norm(task, "time_left", time_left, true),
          })
          */
          return moore_x(task)
        }
      }
      // calculate weights
      let weight_sum = 0
      task_list = task_list
        .map((task) => {
          const {id, text} = task
          const w = weight(task)
          weight_sum += w
          return {
            id,
            text,
            w,
          }
        })
        .map((task) => ({
          ...task,
          w: task.w / weight_sum,
        }))
      // choose randomly using calculated weights
      const weights = {}
      task_list.forEach((task) => (weights[task.id] = task.w))
      let choice = options.last_choice
      let weight_count = Object.keys(weights).length
      while (weight_count > 1 && choice === options.last_choice)
        choice = choicew(weights)
      if (weight_count === 1) choice = Object.keys(weights)[0]
      Object.keys(tasks).forEach((t) => {
        console.log(tasks[t])
      })
      console.log({
        last_completed: last_completed ? last_completed.id : null,
        task_list,
        focus,
        options,
        weights,
      })
      return choice
    },
  }
}
