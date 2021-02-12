import { useState, useEffect, useRef, useCallback } from "react"

export const useWindowEvent = (name, fn) => {
  useEffect(() => {
    window.addEventListener(name, fn)
    return () => {
      window.removeEventListener(name, fn)
    }
  }, [])
}
