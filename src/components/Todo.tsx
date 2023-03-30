import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

interface List {
  id: string;
  title: string;
  createdAt: string;
  todos: Todo[];
}

interface Todo {
  id: string;
  listId: string;
  title: string;
  content: string;
  deadline: string;
  completed: boolean;
}

type ListFormData = Pick<List, "title" | "id" | "todos">;
type TodoFormData = Pick<
  Todo,
  "title" | "listId" | "deadline" | "content" | "completed"
> & { listId: string };

const Todo = () => {
  const {
    register: listRegister,
    handleSubmit: handleListSubmit,
    reset: resetListForm,
  } = useForm<ListFormData>();
  const {
    register: todoRegister,
    handleSubmit: handleTodoSubmit,
    reset: resetTodoForm,
  } = useForm<TodoFormData>();
  const [lists, setLists] = useState<List[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchLists = async () => {
      const { data } = await axios.get<List[]>(
        "https://64227d0877e7062b3e1ab3e7.mockapi.io/list"
      );
      setLists(data);
    };
    const fetchTodos = async () => {
      const { data } = await axios.get<Todo[]>(
        "https://64227d0877e7062b3e1ab3e7.mockapi.io/todo"
      );
      setTodos(data);
    };
    fetchLists();
    fetchTodos();
  }, []);

  const onSubmitList = async (data: ListFormData) => {
    const { data: newList } = await axios.post<List>(
      "https://64227d0877e7062b3e1ab3e7.mockapi.io/list",
      data
    );
    setLists((lists) => [...lists, newList]);
    resetListForm();
  };

  const onDeleteList = async (id: string) => {
    await axios.delete(
      `https://64227d0877e7062b3e1ab3e7.mockapi.io/list/${id}`
    );
    setLists((lists) => lists.filter((list) => list.id !== id));
  };

  const onSubmitTodo = async (data: TodoFormData) => {
    const title = data.title;
    const deadline = data.deadline;
    const content = data.content;
    const listId = data.listId;
    console.log(listId);
    const completed = false;
    const { data: newTodo } = await axios.post<Todo>(
      "https://64227d0877e7062b3e1ab3e7.mockapi.io/todo",
      { title, listId, deadline, content, completed }
    );
    setTodos((todos) => [...todos, newTodo]);
    resetTodoForm();
  };

  const onDeleteTodo = async (id: string) => {
    await axios.delete(
      `https://64227d0877e7062b3e1ab3e7.mockapi.io/todo/${id}`
    );
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  };

  const onCheckTodo = async (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      const completed = !todo.completed;
      await axios.put(
        `https://64227d0877e7062b3e1ab3e7.mockapi.io/todo/${id}`,
        { completed }
      );
      setTodos((todos) =>
        todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      );
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Todo App</h1>
      <form onSubmit={handleListSubmit(onSubmitList)} className="mb-6">
        <div className="flex">
          <input
            {...listRegister("title")}
            placeholder="Enter list title"
            className="rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
          />
          <button
            type="submit"
            className="px-8 rounded-r-lg bg-green-500 text-gray-100 font-bold p-4 uppercase border-green-500 border-t border-b border-r"
          >
            Add List
          </button>
        </div>
      </form>
      <ul>
        {lists.map((list) => (
          <li key={list.id} className="mb-6">
            <div className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-4">
              <h2 className="font-bold text-xl">{list.title}</h2>
              <button
                onClick={() => onDeleteList(list.id)}
                className="text-gray-500 hover:text-red-500 font-bold uppercase"
              >
                Delete List
              </button>
            </div>
            <ul>
              {todos
                .filter((todo) => todo.listId === list.id)
                .map((todo) => (
                  <li
                    key={todo.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onCheckTodo(todo.id)}
                        className="mr-2"
                      />
                      <span>{todo.title}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">{todo.deadline}</span>
                      <span className="mr-2">{todo.content}</span>
                      <button
                        onClick={() => onDeleteTodo(todo.id)}
                        className="text-gray-500 hover:text-red-500 font-bold uppercase"
                      >
                        Delete Todo
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </li>
        ))}
        <form
          onSubmit={handleTodoSubmit(onSubmitTodo)}
          className="flex items-center"
        >
          <input
            {...todoRegister("title")}
            placeholder="Enter todo title"
            type={"text"}
            className="rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
          />
          <input
            {...todoRegister("deadline")}
            type="date"
            className="p-4 border-t border-b border-l text-gray-800 border-gray-200 bg-white"
          />
          <input
            {...todoRegister("content")}
            placeholder="Enter todo content"
            type={"text"}
            className="p-4 border-t border-b border-l text-gray-800 border-gray-200 bg-white"
          />
          <select
            {...todoRegister("listId")}
            className="rounded-r-lg bg-white p-4 border-t border-b border-r text-gray-800 border-gray-200"
          >
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-8 rounded-r-lg bg-blue-500 text-gray-100 font-bold p-4 uppercase border-blue-500 border-t border-b border-r"
          >
            Add Todo
          </button>
        </form>
      </ul>
    </div>
  );
};

export default Todo;
