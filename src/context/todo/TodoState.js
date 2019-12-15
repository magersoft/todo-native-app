import React, { useReducer, useContext } from 'react';
import { Alert } from 'react-native';
import { TodoContext } from './todoContext';
import { todoReducer } from './todoReducer';
import {
  ADD_TODO,
  CLEAR_ERROR,
  FETCH_TODOS,
  HIDE_LOADER,
  REMOVE_TODO,
  SHOW_ERROR,
  SHOW_LOADER,
  UPDATE_TODO
} from '../types';
import { ScreenContext } from '../screen/screenContext';
import { Api } from '../../api';

export const TodoState = ({ children }) => {
  const initialState = {
    todos: [],
    loading: false,
    error: null
  };
  const { changeScreen } = useContext(ScreenContext);
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const fetchTodos = async () => {
    showLoader();
    clearError();
    try {
      const data = await Api.get('todos');
      const todos =
        data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : [];
      dispatch({ type: FETCH_TODOS, todos });
    } catch (e) {
      showError('Oops! We have problem');
      console.error(e);
    } finally {
      hideLoader();
    }
  };

  const addTodo = async title => {
    const { name } = await Api.post('/todos', { title });
    dispatch({ type: ADD_TODO, title, id: name })
  };

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
          onPress: async () => {
            clearError();
            try {
              await Api.delete('todos', { id });
              changeScreen(null);
              dispatch({ type: REMOVE_TODO, id })
            } catch (e) {
              showError('Oops! We have problem');
              console.error(e);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const updateTodo = async (id, title) => {
    clearError();
    try {
      await Api.patch('todos', { id }, { title });
    } catch (e) {
      showError('Oops! We have problem');
      console.error(e);
    }
    dispatch({ type: UPDATE_TODO, id, title })
  };

  const showLoader = () => dispatch({ type: SHOW_LOADER });

  const hideLoader = () => dispatch({ type: HIDE_LOADER });

  const showError = error => dispatch({ type: SHOW_ERROR, error });

  const clearError = () => dispatch({ type: CLEAR_ERROR });

  return <TodoContext.Provider
    value={{
      todos: state.todos,
      loading: state.loading,
      error: state.error,
      addTodo,
      removeTodo,
      updateTodo,
      fetchTodos
    }}
  >
    { children }
  </TodoContext.Provider>
};
