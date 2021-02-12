import React from 'react'
import {StyleSheet, Button as RnButton} from 'react-native'
import {useFormContext} from 'component/form'

const Button = ({submit, onPress, ...props}) => {
  const {active, submit: submitForm} = useFormContext()
  return (
    <RnButton
      onPress={(e) => {
        if (submit && active) {
          submitForm()
        }
        if (onPress) {
          onPress(e)
        }
      }}
      {...props}
    />
  )
}

export default Button
