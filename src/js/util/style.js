import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, Appearance, useColorScheme} from 'react-native'

const themes = {
  light: {
    ground: '#F5F5F5',
    level1: '#E0E0E0',
    level2: '#BDBDBD',
  },
  dark: {
    ground: '#212121',
    level1: '#424242',
    level2: '#757575',
  },
  any: {
    red300: '#e57373',
    red500: '#f44336',
    red700: '#d32f2f',
    blue300: '#64B5F6',
    blue500: '#2196F3',
    blue700: '#1976D2',
    grey300: '#E0E0E0',
    grey500: '#9E9E9E',
    grey700: '#616161',
  },
}

export const useColor = () => {
  const scheme = useColorScheme()
  const [colors, setColors] = useState({})
  useEffect(() => {
    setColors({...themes.any, ...themes[scheme]})
  }, [scheme])

  return colors
}

export const style = (...args) => {
  const s = StyleSheet.create(...args)
  return (name, override) => StyleSheet.compose(s[name], override)
}

export const pickFontColor = (bg, amt, opposite) => {
  amt = amt || 30
  if (!bg) return '#ffffff'
  var match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(bg)
  const rgb = {
    r: parseInt(match[1], 16) ** 2,
    g: parseInt(match[2], 16) ** 2,
    b: parseInt(match[3], 16) ** 2,
  }
  const brightness = Math.sqrt(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b)
  return brightness > 130 && !opposite ? '#212121' : '#F5F5F5'
}
