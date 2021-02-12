import { useState, useEffect, useRef, useCallback } from "react"

export const useInteractions = ({ onLongPress, onClickOutside }) => {
  const [longPress, setLongPress] = useState()

  const startLongPress = () => {
    if (!longPress) {
      setLongPress(
        setTimeout(() => {
          if (onLongPress) onLongPress()
          setLongPress()
        }, 1000)
      )
    }
  }

  const stopLongPress = () => {
    if (longPress) {
      clearTimeout(longPress)
      setLongPress()
    }
  }

  const el_ref = useRef()

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        onClickOutside &&
        el_ref.current &&
        !el_ref.current.contains(e.target)
      )
        onClickOutside(e)
    }
    document.addEventListener("pointerdown", handleOutsideClick)
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick)
    }
  }, [el_ref, onClickOutside])

  return {
    ref: el_ref,
    onClickOutside,
    events: {
      onPointerDown: startLongPress,
      onPointerUp: stopLongPress,
      onPointerLeave: stopLongPress,
    },
  }
}
