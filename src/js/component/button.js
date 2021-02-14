import React from 'react'
import {StyleSheet, Text, Button as RnButton, Pressable} from 'react-native'
import {style, styleCombine, useColor} from 'util/style'
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
  title,
  ...props
}) => {
  const {uiBg, uiFg} = useColor()
  const {active, submit: submitForm} = useFormContext()
  const just_icon = icon && !(title || label)
  const just_text = !icon && (title || label)
  return (
    <Pressable
      style={styles('Button', {
        backgroundColor: just_icon ? 'transparent' : uiBg,
        width: just_icon ? 30 : '100%',
        borderRadius: just_icon ? 15 : 3,
        paddingHorizontal: title || label ? 10 : 0,
        ...(_style || textStyle),
      })}
      android_ripple={{
        color: '#78909C',
        borderless: false,
        radius: just_icon ? 15 : undefined,
      }}
      onPress={(e) => {
        if (submit && active) {
          submitForm()
        }
        if (onPress) {
          onPress(e)
        }
      }}
      {...props}>
      <ReactIcon
        name={icon}
        style={[
          styles('Icon', {
            color: !just_icon ? uiFg : undefined,
          }),
          iconStyle,
        ]}
      />
      {(title || label) && (
        <Text
          style={[
            styles('Text', {
              color: uiFg,
              marginLeft: just_text ? 0 : 10,
            }),
            textStyle,
          ]}>
          {title || label}
        </Text>
      )}
    </Pressable>
  )
}

const styles = style({
  Button: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  Icon: {
    fontSize: 20,
  },
  Text: {},
})

export default Button
