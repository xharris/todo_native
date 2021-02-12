import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, View, Text, Button, TextInput, Switch} from 'react-native'
import {useFormContext} from 'component/form'

const Input = ({name, type, label, value, onChange, ...props}) => {
  const {active, data, setValue} = useFormContext()

  const InputInner = () =>
    type === 'checkbox' ? (
      <Switch {...props} />
    ) : (
      <TextInput
        defaultValue={active && name ? data[name] : value}
        onChangeText={(v) => (active && name ? setValue(name, v) : onChange(v))}
        {...props}
      />
    )
  return (
    <View>
      <Text>{label}</Text>
      <InputInner />
    </View>
  )
}

export default Input
