import React from 'react'
import {StyleSheet, Text, Button as RnButton, Pressable} from 'react-native'
import {style, useColor} from 'util/style'
import {useFormContext} from 'component/form'
import ReactIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const Button = ({
  icon,
  label,
  submit,
  onPress,
  textStyle,
  style: _style,
  iconStyle,
  ...props
}) => {
  const {active, submit: submitForm} = useFormContext()
  return icon ? (
    <Pressable
      style={styles('Button', _style)}
      onPress={onPress}
      android_ripple={{
        borderless: true,
      }}
      {...props}>
      <ReactIcon name={icon} style={styles('Icon', iconStyle)} />
      {label && <Text style={textStyle}>{label}</Text>}
    </Pressable>
  ) : (
    <RnButton
      style={styles('Button', _style)}
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

const styles = style({
  Button: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Icon: {
    fontSize: 20,
  },
})

export default Button
