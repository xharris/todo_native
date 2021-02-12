import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react'
import {StyleSheet, KeyboardAvoidingView, Platform} from 'react-native'

const FormContext = createContext({
  active: false,
  data: {},
  setValue: () => {},
  submit: () => {},
})
export const useFormContext = () => useContext(FormContext)

const Form = ({data: _data, onSubmit, children, ...props}) => {
  const [data, setData] = useState(_data || {})
  return (
    <FormContext.Provider
      value={{
        active: true,
        data,
        setValue: (k, v) =>
          setData({
            ...data,
            [k]: v,
          }),
        submit: () => onSubmit(data),
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        {...props}>
        {typeof children === 'function' ? children(data) : children}
      </KeyboardAvoidingView>
    </FormContext.Provider>
  )
}
export default Form
