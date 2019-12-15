import React, { useReducer, useContext } from 'react';
import { TodoContext } from './todoContext';
import { todoReducer } from './todoReducer';
import { ADD_TODO, REMOVE_TODO, UPDATE_TODO } from '../types';
import { ScreenContext } from '../screen/screenContext';
import { Alert } from 'react-native';

const generateTodo = count => {
  let todos = [];
  for (let i = 0; i < count; i++) {
    todos.push({ id: i, title: `Todo №${i}` })
  }
  return todos;
};

export const TodoState = ({ children }) => {
  const initialState = {
    todos: generateTodo(4)
  };
  const { changeScreen } = useContext(ScreenContext);
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const addTodo = title => dispatch({ type: ADD_TODO, title });

  const removeTodo = id => {
    const todo = state.todos.find(t => t.id === id);
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
            changeScreen(null);
            dispatch({ type: REMOVE_TODO, id })
          }
        }
      ],
      { cancelable: false }
    );
  };

  const updateTodo = (id, title) => dispatch({ type: UPDATE_TODO, id, title });

  return <TodoContext.Provider
    value={{
      todos: state.todos,
      addTodo,
      removeTodo,
      updateTodo
    }}
  >
    { children }
  </TodoContext.Provider>
};
