import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

export const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editedTask, setEditedTask] = useState('');

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(savedTodos);
  }, []);

  const addTodo = (todo) => {
    if (todo.length > 0) {
      const newTodos = [
        ...todos,
        { id: uuidv4(), task: todo, isEditing: false },
      ];
      setTodos(newTodos);
      localStorage.setItem('todos', JSON.stringify(newTodos));
      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const editTodo = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
    );
    setTodos(newTodos);
    setEditedTask('');
  };

  const saveTask = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task: editedTask, isEditing: false } : todo
    );
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    setEditedTask('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (newTodo.length > 0) {
        addTodo(newTodo);
      }
    }
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveTask(id);
    }
  };

  return (
    <div className="text-center">
      <div className="bg-[#1A1A40] mt-20 p-8 rounded-lg">
        <h1 className="text-white text-2xl mb-4">Things To Do!</h1>
        <div className="mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What is the task for today?"
            className="todo-input"
          />
          <button
            type="button"
            onClick={() => addTodo(newTodo)}
            className="bg-[#04C8DE] text-white border-none px-2 py-2.5 cursor-pointer rounded-xl m-2"
            disabled={newTodo.length <= 0}
          >
            Add Task
          </button>
        </div>
        {todos.map((todo, index) => (
          <div
            className={`Todo`}
            key={index}
          >
            {todo.isEditing ? (
              <div>
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                  onKeyPress={(e) => handleEditKeyPress(e, todo.id)}
                  placeholder={todo.task} // Display the current task.
                  className="todo-input" // Apply the same class as the new task input
                />
                <button
                  type="button"
                  onClick={() => saveTask(todo.id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <p onClick={() => editTodo(todo.id)}>
                  {todo.task}
                </p>
                <div>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => editTodo(todo.id)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deleteTodo(todo.id)}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
