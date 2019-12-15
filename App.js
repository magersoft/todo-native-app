import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { THEME } from './src/theme';

import { Navbar } from './src/components/Navbar';
import { MainScreen } from './src/screens/MainScreen';
import { TodoScreen } from './src/screens/TodoScreen';

async function loadApplication() {
  await Font.loadAsync({
    'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf')
  })
}

const generateTodo = count => {
  let todos = [];
  for (let i = 0; i < count; i++) {
    todos.push({ id: i, title: `Todo №${i}` })
  }
  return todos;
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [todoId, setTodoId] = useState(null);
  const [todos, setTodos] = useState(generateTodo(4));

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadApplication}
        onError={err => console.log(err)}
        onFinish={() => setIsReady(true)}
      />)
  }

  const addTodo = title => {
    setTodos(prev => [...prev, {
      id: Date.now().toString(),
      title
    }])
  };
  const updateTodo = (id, title) => {
    setTodos(old => old.map(todo => {
      if (todo.id === id) {
        todo.title = title;
      }
      return todo;
    }))
  };
  const removeTodo = id => {
    const todo = todos.find(todo => todo.id === id);
    Alert.alert(
      'Deleting todo',
      `Todo "${todo.title}" will be delete, You are sure?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTodoId(null);
            setTodos(prev => prev.filter(todo => todo.id !== id))
          }
        }
      ],
      { cancelable: false }
    );
  };

  let content = (
    <MainScreen
      todos={todos}
      addTodo={addTodo}
      removeTodo={removeTodo}
      openTodo={setTodoId}
    />
  );

  if (todoId) {
    const todo = todos.find(todo => todo.id === todoId);
    content = <TodoScreen todo={todo} goBack={() => setTodoId(null)} onRemove={removeTodo} onSave={updateTodo} />
  }

  return (
    <View>
      <Navbar title="Todo App" />
      <View style={styles.container}>
        { content }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.PADDING_HORIZONTAL,
    paddingVertical: 20
  }
});
