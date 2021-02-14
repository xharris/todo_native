import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react'
import {KeyboardAvoidingView, Platform} from 'react-native'
import {style, useColor} from 'util/style'

const FormContext = createContext({
  active: false,
  data: {},
  initialData: {},
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
        initialData: _data || {},
        setValue: (k, v) =>
          setData({
            ...data,
            [k]: v,
          }),
        submit: () => onSubmit(data),
      }}>
      <KeyboardAvoidingView
        style={styles('Form')}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        {...props}>
        {typeof children === 'function' ? children(data) : children}
      </KeyboardAvoidingView>
    </FormContext.Provider>
  )
}
export default Form

const styles = style({
  Form: {
    padding: 5,
  },
})
