import React, {useState, useEffect, useRef, useCallback} from 'react'
import {style, useColor} from 'util/style'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Switch,
  Pressable,
} from 'react-native'
import {useFormContext} from 'component/form'
import Icon from 'component/icon'
import {Picker} from '@react-native-picker/picker'
import Button from 'component/button'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

const Input = ({
  name,
  icon,
  type,
  label,
  value: _value,
  onChange,
  choices,
  colors,
  ...props
}) => {
  const {active, data, setValue} = useFormContext()
  const {level1, ...color} = useColor()
  const styleInner = styles('Inner', {
    marginLeft: 8,
  })
  const [showDateTime, setShowDateTime] = useState()
  const el_input = useRef()
  const setNewValue = useCallback(
    (v) =>
      active && name
        ? setValue(name, v)
        : onChange
        ? onChange(v)
        : console.warn('Useless input'),
    [active, name, setValue, onChange],
  )

  const value = active && name ? data[name] : _value

  return (
    <View
      style={styles('Input', {
        backgroundColor: level1,
      })}>
      {icon && <Icon name={icon} />}
      {type === 'checkbox' && (props.placeholder || label) && (
        <Text style={styles('SelectLabel')}>{props.placeholder || label}</Text>
      )}
      {type === 'checkbox' ? (
        <Switch
          ref={el_input}
          style={styles('Inner')}
          value={value}
          onValueChange={setNewValue}
          {...props}
        />
      ) : type === 'select' ? (
        <Picker
          style={styles('Inner')}
          itemStyle={styleInner}
          selectedValue={value}
          onValueChange={setNewValue}
          {...props}>
          {choices && choices.map((c) => <Picker.Item {...c} />)}
        </Picker>
      ) : type === 'date' || type === 'time' ? (
        <Pressable
          android_ripple={true}
          style={styles('DatePressable')}
          onPress={() => setShowDateTime(true)}>
          <Text
            style={styles('Inner', {
              flexGrow: 0,
            })}>
            {value
              ? moment(value).format('ddd, MMMM Do YYYY')
              : props.placeholder}
          </Text>
        </Pressable>
      ) : type === 'color' ? (
        <View style={styleInner}>
          {(colors || ['red500', 'blue500']).map((c) => (
            <Pressable
              key={c}
              android_ripple={true}
              style={styles('Color', {
                backgroundColor: color[c],
                marginRight: 5,
                borderWidth: value === c ? 2 : 0,
              })}
              onPress={() => setNewValue(c)}
            />
          ))}
        </View>
      ) : (
        <TextInput
          ref={el_input}
          style={styleInner}
          value={value && value.toString()}
          onChangeText={setNewValue}
          {...props}
        />
      )}
      {showDateTime && (
        <DateTimePicker
          value={new Date(value)}
          onChange={(e, v) => {
            setShowDateTime(false)
            setNewValue(v)
          }}
        />
      )}
      {!type && (
        <Pressable
          style={styles('ButtonClear')}
          onPress={() => {
            el_input.current.clear()
            el_input.current.focus()
            setValue(name, null)
          }}>
          <Icon name="close-circle" />
        </Pressable>
      )}
    </View>
  )
}

const styles = style({
  Input: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 16,
    borderRadius: 4,
    marginBottom: 5,
  },
  SelectLabel: {
    flexGrow: 1,
  },
  DatePressable: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Inner: {
    flexDirection: 'row',
    flexGrow: 1,
    fontSize: 16,
    padding: 0,
  },
  ButtonClear: {
    flexShrink: 0,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Color: {
    width: 30,
    height: 30,
    borderRadius: 3,
  },
})

export default Input
