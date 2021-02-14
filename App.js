import 'react-native-gesture-handler'
import React from 'react'
import {StyleSheet, View, Text, Button, StatusBar} from 'react-native'
import {Colors} from 'react-native/Libraries/NewAppScreen'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {TaskProvider} from 'util/storage'
import TaskList from 'feature/tasklist'
import TaskPick from 'feature/taskpick'
import TaskEdit from 'feature/taskedit'
import {useColor} from 'util/style'

const Stack = createStackNavigator()

const App = () => {
  const {ground, uiFg} = useColor()
  return (
    <TaskProvider>
      <NavigationContainer>
        <StatusBar translucent backgroundColor="transparent" />
        <Stack.Navigator
          screenOptions={{
            title: '',
            cardStyle: {
              backgroundColor: ground,
            },
            headerTintColor: uiFg,
          }}>
          <Stack.Screen name="TaskList" component={TaskList} />
          <Stack.Screen name="TaskEdit" component={TaskEdit} />
          <Stack.Screen name="TaskPick" component={TaskPick} />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
})

export default App
