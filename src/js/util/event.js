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
