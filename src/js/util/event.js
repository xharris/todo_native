import {useEffect} from 'react'
import {Platform, Alert, ToastAndroid} from 'react-native'

export const useWindowEvent = (name, fn) => {
  useEffect(() => {
    window.addEventListener(name, fn)
    return () => {
      window.removeEventListener(name, fn)
    }
  }, [])
}

export const toast = ({msg, duration = 'short', title = ''}) =>
  Platform.OS === 'android'
    ? ToastAndroid.show(
        msg,
        duration === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT,
      )
    : Alert.alert(title, msg, [
        {
          text: 'Ok',
        },
      ])

export const confirm = (title, desc) =>
  new Promise((res, rej) => {
    Alert.alert(title, desc, [
      {
        text: 'Cancel',
        onPress: () => res(false),
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => res(true),
      },
    ])
  })
