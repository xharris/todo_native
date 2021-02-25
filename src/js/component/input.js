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
  className,
  ...props
}) => {
  const {active, data, setValue} = useFormContext()
  const {
    level1,
    level2,
    level3,
    level4,
    groundTint,
    uiFg,
    list,
    ...color
  } = useColor()
  const textColor = groundTint
  const styleInner = styles('Inner', {
    marginLeft: 8,
    flexWrap: type === 'color' ? 'wrap' : 'nowrap',
    color: textColor,
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
    <Pressable
      style={[
        styles('Input', {
          backgroundColor: level1,
          height: type === 'color' || props.multiline ? 'auto' : 40,
          paddingTop: type === 'color' ? 4 : 0,
        }),
        className,
      ]}
      onPress={() => {
        if (type === 'checkbox') {
          setNewValue(!value)
        }
      }}>
      {icon ? (
        <Icon
          name={icon}
          style={styles('Icon', {
            color: textColor,
          })}
        />
      ) : null}
      {type === 'checkbox' && (props.placeholder || label) ? (
        <Text
          style={styles('SelectLabel', {
            color: textColor,
          })}>
          {props.placeholder || label}
        </Text>
      ) : null}
      {type === 'checkbox' ? (
        <Switch
          ref={el_input}
          style={styles('Inner', {
            color: textColor,
          })}
          value={value}
          onValueChange={setNewValue}
          {...props}
        />
      ) : type === 'select' ? (
        <Picker
          style={styles('Inner', {
            color: textColor,
          })}
          itemStyle={styleInner}
          selectedValue={value && value.toString()}
          onValueChange={setNewValue}
          {...props}>
          {choices &&
            choices.map((c) => (
              <Picker.Item {...c} value={c.value.toString()} />
            ))}
        </Picker>
      ) : type === 'date' || type === 'time' ? (
        <Pressable
          android_ripple={true}
          style={styles('DatePressable')}
          onPress={() => setShowDateTime(true)}>
          <Text
            style={styles('Inner', {
              flexGrow: 0,
              color: textColor,
            })}>
            {value
              ? moment(value).format('ddd, MMMM Do YYYY')
              : props.placeholder}
          </Text>
        </Pressable>
      ) : type === 'color' ? (
        <View style={styleInner}>
          {(colors || list('500')).map((c) => (
            <Pressable
              key={c}
              android_ripple={true}
              style={styles('Color', {
                backgroundColor: color[c],
                marginRight: 5,
                borderWidth: value === c ? 3 : 0,
                borderColor: textColor,
              })}
              onPress={() => setNewValue(c)}
            />
          ))}
        </View>
      ) : (
        <TextInput
          ref={el_input}
          style={styleInner}
          value={value != null ? value.toString() : value}
          onChangeText={setNewValue}
          placeholderTextColor={level4}
          {...props}
        />
      )}
      {showDateTime ? (
        <DateTimePicker
          value={value != null ? new Date(value) : new Date()}
          onChange={(e, v) => {
            setShowDateTime(false)
            setNewValue(v)
          }}
        />
      ) : null}
      {!type && value && value.length > 0 && !props.multiline ? (
        <Pressable
          style={styles('ButtonClear')}
          onPress={() => {
            el_input.current.clear()
            el_input.current.focus()
            setValue(name, null)
          }}>
          <Icon
            name="close-circle"
            style={styles('Icon', {
              color: textColor,
            })}
          />
        </Pressable>
      ) : null}
    </Pressable>
  )
}

const styles = style({
  Input: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40,
    fontSize: 16,
    borderRadius: 4,
    marginBottom: 5,
  },
  Icon: {
    width: 30,
    flexShrink: 0,
    textAlign: 'center',
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
    flexShrink: 1,
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
    marginBottom: 4,
  },
})

export default Input
