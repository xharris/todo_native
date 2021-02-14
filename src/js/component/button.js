import React from 'react'
import {StyleSheet, Text, Button as RnButton} from 'react-native'
import {useFormContext} from 'component/form'
import ReactIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const Button = ({icon, label, submit, onPress, textStyle, style, ...props}) => {
  const {active, submit: submitForm} = useFormContext()
  return icon ? (
    <ReactIcon.Button name={icon} style={style} {...props}>
      {label && <Text style={textStyle}>{label}</Text>}
    </ReactIcon.Button>
  ) : (
    <RnButton
      onPress={(e) => {
        if (submit && active) {
          submitForm()
        }
        if (onPress) {
          onPress(e)
        }
      }}
      style={style || textStyle}
      {...props}
    />
  )
}

export default Button
