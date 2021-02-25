import React, {useState, useEffect, useRef, useCallback} from 'react'
import {StyleSheet, useColorScheme, Platform, PlatformColor} from 'react-native'
import tinycolor from 'tinycolor2'

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
    deeppurple300: '#7986CB',
    deeppurple500: '#3F51B5',
    deeppurple700: '#303F9F',
    indigo300: '#7986CB',
    indigo500: '#3F51B5',
    indigo700: '#303F9F',
    blue300: '#64B5F6',
    blue500: '#2196F3',
    blue700: '#1976D2',
    lightblue300: '#4FC3F7',
    lightblue500: '#03A9F4',
    lightblue700: '#0288D1',
    cyan300: '#4DD0E1',
    cyan500: '#00BCD4',
    cyan700: '#0097A7',
    teal300: '#4DB6AC',
    teal500: '#009688',
    teal700: '#00796B',
    green300: '#81C784',
    green500: '#4CAF50',
    green700: '#388E3C',
    lightgreen300: '#AED581',
    lightgreen500: '#8BC34A',
    lightgreen700: '#689F38',
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

  const list = useCallback(
    (...shades) => {
      if (shades.length === 0) shades = ['500']
      return Object.keys(colors).filter((c) =>
        shades.some((s) => c.includes(s)),
      )
    },
    [colors],
  )

  return {...colors, list}
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

const clamp = (x, min, max) => Math.min(max, Math.max(min, x))

export const pickFontColor = (bg) => {
  const color = tinycolor(bg)
  const l = color.getLuminance()
  const amt = clamp(l, 0.4, 0.5) * 100
  const pick = l * 100 > 31
  console.log(
    `%c ${color} ${l} -> ${amt} (${pick ? 'darken' : 'lighten'})`,
    `color: ${bg}`,
  )
  return pick ? color.darken(amt).toString() : color.lighten(amt).toString()
}

// export const pickFontColor = (bg, amt, opposite) => {
//   amt = amt || 30
//   if (!bg) return '#ffffff'
//   var match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(bg)
//   const rgb = {
//     r: parseInt(match[1], 16) ** 2,
//     g: parseInt(match[2], 16) ** 2,
//     b: parseInt(match[3], 16) ** 2,
//   }
//   const brightness = Math.sqrt(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b)
//   return brightness > 150 && !opposite ? '#212121' : '#F5F5F5'
// }
