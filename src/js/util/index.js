import { useState, useEffect, useCallback } from "react"
import moment from "moment"

export const timeOfDay = (date) => {
  const hour = moment(date).format("HH")
  return hour >= 3 && hour < 12
    ? "day_start"
    : hour >= 12 && hour < 15
    ? "day_mid"
    : "day_end"
}

export const useTimer = () => {
  const [startTime, setStartTime] = useState()
  const [paused, setPaused] = useState(true)
  const [timeLeft, setTimeLeft] = useState()
  const [realTimeLeft, setRealTimeLeft] = useState()

  const updateRealTime = () => {
    // console.log("update", realTimeLeft, timeLeft && startTime)
    if (timeLeft && startTime)
      setRealTimeLeft(
        !realTimeLeft
          ? moment.duration(timeLeft)
          : moment
              .duration(timeLeft)
              .subtract(moment().diff(moment(startTime), "seconds"), "s")
      )
  }

  useEffect(() => {
    let no_update, interval
    updateRealTime()
    interval = setInterval(() => {
      if (!no_update && !paused) updateRealTime()
    }, 500)
    return () => {
      if (interval) clearInterval(interval)
      no_update = true
    }
  }, [timeLeft, startTime, paused])

  const start = () => {
    if (paused) {
      setStartTime(moment().valueOf())
      setPaused(false)
    }
  }

  const pause = () => {
    if (!paused) {
      if (startTime)
        // remove used minutes
        setTimeLeft(
          // timeLeft - minutes(now - start)
          moment
            .duration(timeLeft)
            .subtract(moment().diff(moment(startTime), "seconds"), "s")
        )
      setStartTime(moment().valueOf())
      setPaused(true)
    }
  }

  const reset = (duration) => {
    setTimeLeft(moment.duration(duration, "minutes"))
    setStartTime(moment().valueOf())
    setPaused(true)
  }

  const clear = () => {
    setPaused(true)
    setRealTimeLeft()
    setTimeLeft()
    setStartTime()
  }

  return {
    timeLeft: realTimeLeft,
    start,
    pause,
    resume: start,
    reset,
    paused,
    clear,
  }
}

export const useTextScramble = (defaultText) => {
  const [text, setText] = useState(defaultText)
  const set = (newText) => setText(newText)
  /*
  const [frame, setFrame] = useState()
  const [frameRequest, setFrameRequest] = useState()
  const [queue, setQueue] = useState()

  const chars = "!<>-_\\/[]{}—=+*^?#________"
  const rand_char = () => chars[Math.floor(Math.random() * chars.length)]

  useEffect(() => {
    
  },[])

  const set = (newText) => {
    const oldText = text
    const length = Math.max(oldText.length, newText.length)
    const newQueue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ""
      const to = newText[i] || ""
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      newQueue.push({ from, to, start, end })
    }
    setQueue(newQueue)
    cancelAnimationFrame(frameRequest)
    setFrameRequest()
    setFrame(0)
    update()
  }

  const update = useCallback(() => {
    let output = ""
    let complete = 0

    for (let i = 0, n = queue.length; i < n; i++) {
      let { from, to, start, end, char } = queue[i]
      if (frame >= end) {
        complete++
        output += to
      } else if (frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = rand_char()
          queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    setText(output)
    setQueue(queue)
    if (complete !== queue.length) {
      setFrameRequest(requestAnimationFrame(update))
      setFrame(frame + 1)
    } else {
      setFrameRequest()
    }
  }, [queue, frame])
*/
  return [text, set]
}
