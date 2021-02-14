import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, useColorScheme, Platform, PlatformColor} from 'react-native'

const themes = {
  light: {
    headerTint: '#424242',
    groundTint: '#424242',
    uiBg: '#90A4AE',
    uiFg: '#F5F5F5',
    antiBg: '#000000',
    ground: '#FAFAFA',
    level1: '#E0E0E0',
    level2: '#757575',
    level3: '#9E9E9E',
    level4: '#BDBDBD',
  },
  dark: {
    headerTint: '#F5F5F5',
    groundTint: '#F5F5F5',
    uiBg: '#607D8B',
    uiFg: '#F5F5F5',
    antiBg: '#FAFAFA',
    ground: '#000000',
    level1: '#212121',
    level2: '#303030',
    level3: '#424242',
    level4: '#757575',
  },
  any: {
    uiRipple: '#78909C',
    red300: '#e57373',
    red500: '#f44336',
    red700: '#d32f2f',
    pink300: '#F06292',
    pink500: '#E91E63',
    pink700: '#C2185B',
    purple300: '#9575CD',
    purple500: '#673AB7',
    purple700: '#512DA8',
    blue300: '#64B5F6',
    blue500: '#2196F3',
    blue700: '#1976D2',
    green300: '#81C784',
    green500: '#4CAF50',
    green700: '#388E3C',
    yellow300: '#FFF176',
    yellow500: '#FFEB3B',
    yellow700: '#FBC02D',
    orange300: '#FFB74D',
    orange500: '#FF9800',
    orange700: '#F57C00',
    brown300: '#A1887F',
    brown500: '#795548',
    brown700: '#5D4037',
    grey300: '#E0E0E0',
    grey500: '#9E9E9E',
    grey700: '#616161',
  },
}

export const useColor = () => {
  const scheme = useColorScheme()
  const [colors, setColors] = useState({})
  useEffect(() => {
    setColors({...themes.any, ...themes[scheme], isDark: scheme === 'dark'})
  }, [scheme])

  return colors
}

export const style = (...args) => {
  const s = StyleSheet.create(...args)
  return (name, ...overrides) =>
    overrides.length === 0
      ? s[name]
      : overrides.length > 1
      ? StyleSheet.flatten([s[name], ...overrides])
      : StyleSheet.compose(s[name], ...overrides)
}

export const styleCombine = (...args) => StyleSheet.flatten(...args)

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
