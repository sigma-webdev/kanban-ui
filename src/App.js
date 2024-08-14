import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import Data from "./Database/Data";
import toast from "react-hot-toast";

const App = () => {
  const { themes, boards: myboards, labels, assignee } = Data;
  const [boards, setBoards] = useState([...myboards]);
  const [currentBoard, setCurrentBoard] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || themes[0]
  );
  const [newBoardName, setNewBoardName] = useState("");
  const [newTaskData, setNewTaskData] = useState({
    id: "",
    label: labels[0],
    title: "",
    description: "",
    date: "",
    assignee: assignee[0],
  });

  // function to store the dragged item details
  const handleDragStart = (event, item, targetColumn) => {
    event.dataTransfer.setData("item", JSON.stringify(item));
    event.dataTransfer.setData("targetColumn", JSON.stringify(targetColumn));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // function to handle the drop functionality
  const handleDrop = (event, targetColumn) => {
    event.preventDefault();
    const item = JSON.parse(event.dataTransfer.getData("item"));
    const originColumn = JSON.parse(event.dataTransfer.getData("targetColumn"));
    if (targetColumn === originColumn) return;
    if (targetColumn === "todos") {
      Data.boards[currentBoard].todos = [
        ...Data?.boards[currentBoard]?.todos,
        item,
      ];
    } else if (targetColumn === "progress") {
      Data.boards[currentBoard].progress = [
        ...Data?.boards[currentBoard]?.progress,
        item,
      ];
    } else if (targetColumn === "review") {
      Data.boards[currentBoard].review = [
        ...Data?.boards[currentBoard]?.review,
        item,
      ];
    } else if (targetColumn === "done") {
      Data.boards[currentBoard].done = [
        ...Data?.boards[currentBoard]?.done,
        item,
      ];
    }

    // deleting the item from originated targeted column
    Data.boards[currentBoard][originColumn] = Data.boards[currentBoard][
      originColumn
    ]?.filter((todo) => {
      return todo?.id !== item?.id;
    });
    setBoards([...myboards]);
  };

  // function to delete the board
  const deleteBoard = () => {
    Data?.boards?.splice(currentBoard, 1);
    setBoards([...Data?.boards]);
    setCurrentBoard(0);
    toast.success("Board deleted successfully");

    // setting the data into local storage
    localStorage.setItem("boards", JSON.stringify(Data.boards));
  };

  // function to add new board
  const addNewBoard = () => {
    if (!newBoardName || newBoardName?.length < 4) {
      toast.error("Please enter a valid board name");
      return;
    }
    Data.boards.push({
      id: uuid(),
      todos: [],
      progress: [],
      done: [],
      review: [],
      name: newBoardName,
    });
    setBoards([...Data?.boards]);
    toast.success("Board added successfully");
    setNewBoardName("");

    // setting the data into local storage
    localStorage.setItem("boards", JSON.stringify(Data.boards));
  };

  // function to handle the addition of new task
  const addNewTask = () => {
    if (!newTaskData?.title || !newTaskData?.description) {
      toast.error("All fields are mandatory");
      return;
    }
    newTaskData.id = uuid();
    newTaskData.date = new Date().toLocaleString();

    Data.boards[currentBoard].todos.push({ ...newTaskData });
    setBoards([...Data?.boards]);
    toast.success("Task added successfully");

    // reset the task data
    setNewTaskData({
      id: "",
      label: labels[0],
      title: "",
      description: "",
      date: "",
      assignee: assignee[0],
    });

    // setting the data into local storage
    localStorage.setItem("boards", JSON.stringify(Data.boards));
  };

  // function to handle the deletion of task
  const handleTaskDelete = (operation, index) => {
    Data.boards[currentBoard][operation].splice(index, 1);
    localStorage.setItem("boards", JSON.stringify(Data?.boards));
    setBoards([...Data?.boards]);
    toast.success(`Task from ${operation} deleted successfully`);
  };

  return (
    <div className="flex" data-theme={currentTheme}>
      {/* sidebar */}
      <div className="drawer lg:drawer-open w-fit">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="fixed flex flex-col items-center self-start justify-center drawer-content top-6 left-3">
          {/* button for drawer toggle in smaller screen */}
          <label
            htmlFor="my-drawer-2"
            className="text-white btn btn-accent drawer-button btn-sm lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </label>
        </div>
        <div className="z-50 drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay" />
          <div className="flex flex-col justify-between min-h-full p-4 border-r-2 border-gray-100 bg-base-100 lg:bg-none menu w-72 text-base-content">
            {/* for heading and board list */}
            <div className="space-y-5">
              <h1 className="text-2xl font-bold text-center text-accent">
                Kanban UI Board
              </h1>
              {/* displaying all the boards */}
              <ul className="space-y-2">
                {boards &&
                  boards?.map((board, index) => {
                    return (
                      <li
                        key={board?.id}
                        className="flex items-start text-base font-semibold rounded-md cursor-pointer"
                        onClick={() => setCurrentBoard(index)}
                      >
                        <div
                          className={`w-full hover:text-accent ${
                            currentBoard === index && "text-accent bg-gray-200"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                            />
                          </svg>{" "}
                          <span>{board?.name}</span>
                          {/* modal to delete the board */}
                          <button
                            className={`text-red-500 ${
                              currentBoard === index ? "block" : "hidden"
                            }`}
                            onClick={() =>
                              document.getElementById("my_modal_1").showModal()
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                          <dialog
                            id="my_modal_1"
                            className="modal modal-bottom sm:modal-middle"
                            key={board?.id}
                          >
                            <div className="w-full text-black sm:w-72 md:w-96 modal-box">
                              <div className="flex items-center justify-center py-5 bg-red-100 rounded-lg">
                                <div className="p-5 text-white bg-red-500 rounded-full">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-16 h-16 lg:w-20 lg:h-20"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <h3 className="mt-5 text-lg font-bold">
                                Delete Board
                              </h3>
                              <p className="py-0 lg:py-4">
                                Are you sure you want to delete this board ?
                              </p>
                              <div className="modal-action">
                                <form
                                  method="dialog"
                                  className="flex flex-col w-full gap-3"
                                >
                                  <button
                                    type="submit"
                                    className="text-white bg-red-500 btn hover:bg-red-600"
                                    onClick={deleteBoard}
                                  >
                                    delete
                                  </button>
                                  <button className="btn" type="submit">
                                    Close
                                  </button>
                                </form>
                              </div>
                            </div>
                          </dialog>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>

            {/* button to add new board and its dialog */}
            <button
              type="button"
              className="py-2 font-semibold text-white btn btn-md btn-accent"
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              Add new board
            </button>
            <dialog
              id="my_modal_2"
              className="modal modal-bottom sm:modal-middle"
            >
              <div className="w-full text-black sm:w-72 md:w-96 modal-box">
                <div className="flex items-center justify-center py-5 bg-teal-100 rounded-lg">
                  <div className="p-5 text-white bg-teal-500 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-16 h-16 lg:w-20 lg:h-20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-5 text-lg font-bold">Board name</h3>
                <label htmlFor="newBoardName" className="w-full">
                  <input
                    type="text"
                    name="newBoardName"
                    id="newBoardName"
                    placeholder="Default board"
                    className="w-full p-2 mt-2"
                    onChange={(event) => setNewBoardName(event.target.value)}
                    value={newBoardName}
                  />
                </label>
                <div className="modal-action">
                  <form method="dialog" className="flex flex-col w-full gap-3">
                    <button
                      type="submit"
                      className="text-white bg-teal-500 btn hover:bg-teal-600"
                      onClick={addNewBoard}
                    >
                      create
                    </button>
                    <button className="btn" type="submit">
                      Close
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>

      {/* kanban container */}
      <main className="container flex flex-col gap-5 py-5 overflow-x-hidden">
        {/* for header */}
        <header className="flex items-center self-end px-5 space-x-5">
          {/* add new todo and its dialog box */}
          <button
            type="button"
            className={`font-semibold text-white btn lg:btn-md btn-sm btn-accent ${
              Data?.boards?.length ? "block" : "hidden"
            }`}
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            Add new task
          </button>
          <dialog
            id="my_modal_3"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="flex flex-col w-full gap-2 text-black sm:w-72 md:w-96 modal-box">
              <h3 className="text-lg font-bold">Add new task</h3>
              {/* for task name */}
              <label htmlFor="taskName" className="w-full">
                Task name
                <input
                  type="text"
                  name="taskName"
                  id="taskName"
                  placeholder="Work on provided data"
                  className="w-full p-2 mt-1"
                  required
                  minLength={4}
                  onChange={(event) =>
                    setNewTaskData({
                      ...newTaskData,
                      title: event?.target?.value,
                    })
                  }
                  value={newTaskData?.title}
                />
              </label>

              {/* for task description */}
              <label htmlFor="taskDescription" className="w-full">
                Task Description
                <textarea
                  name="taskDescription"
                  id="taskDescription"
                  className="w-full h-20 p-2 mt-1 resize-none"
                  placeholder="Enter the task description"
                  required
                  minLength={20}
                  onChange={(event) =>
                    setNewTaskData({
                      ...newTaskData,
                      description: event?.target?.value,
                    })
                  }
                  value={newTaskData?.description}
                />
              </label>

              {/* for task priority */}
              <label htmlFor="taskPriority">
                <select
                  name="taskPriority"
                  id="taskPriority"
                  className="w-full max-w-xs select select-bordered"
                  required
                  onChange={(event) =>
                    setNewTaskData({
                      ...newTaskData,
                      label: JSON.parse(event?.target?.value),
                    })
                  }
                  value={newTaskData?.label}
                >
                  {labels?.length &&
                    labels?.map((label) => {
                      return (
                        <option key={label?.id} value={JSON.stringify(label)}>
                          {label?.name}
                        </option>
                      );
                    })}
                </select>
              </label>

              {/* for assigned to */}
              <label htmlFor="assignedTo">
                <select
                  name="assignedTo"
                  id="assignedTo"
                  className="w-full max-w-xs select select-bordered"
                  required
                  onChange={(event) =>
                    setNewTaskData({
                      ...newTaskData,
                      assignee: JSON.parse(event.target.value),
                    })
                  }
                  value={newTaskData?.assignee}
                >
                  {assignee?.length &&
                    assignee?.map((user) => {
                      return (
                        <option key={user?.id} value={JSON.stringify(user)}>
                          {user?.name}
                        </option>
                      );
                    })}
                </select>
              </label>

              <div className="modal-action">
                <form method="dialog" className="w-full space-y-2">
                  <button
                    type="submit"
                    className="w-full text-white bg-teal-500 btn hover:bg-teal-600"
                    onClick={addNewTask}
                  >
                    create
                  </button>
                  <button className="w-full btn" type="submit">
                    Close
                  </button>
                </form>
              </div>
            </div>
          </dialog>

          {/* for changing the theme */}
          <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
            <label
              tabIndex={0}
              className="m-1 font-semibold btn btn-sm lg:btn-md text-accent"
            >
              <span className="hidden lg:block">Theme</span>{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 lg:w-8"
              >
                <path d="M8.997 13.985c.01 1.104-.88 2.008-1.986 2.015-1.105.009-2.005-.88-2.011-1.984-.01-1.105.879-2.005 1.982-2.016 1.106-.007 2.009.883 2.015 1.985zm-.978-3.986c-1.104.008-2.008-.88-2.015-1.987-.009-1.103.877-2.004 1.984-2.011 1.102-.01 2.008.877 2.012 1.982.012 1.107-.88 2.006-1.981 2.016zm7.981-4.014c.004 1.102-.881 2.008-1.985 2.015-1.106.01-2.008-.879-2.015-1.983-.011-1.106.878-2.006 1.985-2.015 1.101-.006 2.005.881 2.015 1.983zm-12 15.847c4.587.38 2.944-4.492 7.188-4.537l1.838 1.534c.458 5.537-6.315 6.772-9.026 3.003zm14.065-7.115c1.427-2.239 5.846-9.748 5.846-9.748.353-.623-.429-1.273-.975-.813 0 0-6.572 5.714-8.511 7.525-1.532 1.432-1.539 2.086-2.035 4.447l1.68 1.4c2.227-.915 2.868-1.04 3.995-2.811zm-12.622 4.806c-2.084-1.82-3.42-4.479-3.443-7.447-.044-5.51 4.406-10.03 9.92-10.075 3.838-.021 6.479 1.905 6.496 3.447l1.663-1.456c-1.01-2.223-4.182-4.045-8.176-3.992-6.623.055-11.955 5.466-11.903 12.092.023 2.912 1.083 5.57 2.823 7.635.958.492 2.123.329 2.62-.204zm12.797-1.906c1.059 1.97-1.351 3.37-3.545 3.992-.304.912-.803 1.721-1.374 2.311 5.255-.591 9.061-4.304 6.266-7.889-.459.685-.897 1.197-1.347 1.586z" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 overflow-y-scroll h-60 flex-nowrap"
            >
              {themes?.map((theme) => {
                return (
                  <li
                    key={uuid()}
                    onClick={() => {
                      setCurrentTheme(theme);
                      localStorage.setItem("theme", theme);
                    }}
                  >
                    <a
                      href="#"
                      className={`hover:text-accent hover:font-semibold ${
                        currentTheme === theme &&
                        "bg-gray-200 font-semibold text-accent"
                      }`}
                    >
                      {theme}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </header>

        {/* columns container */}
        {boards?.length ? (
          <div className="flex items-start justify-between gap-5 p-5 overflow-x-scroll ">
            {/* todos container */}
            <div
              className="self-stretch flex-1 rounded-md shadow-md min-w-[300px]"
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, "todos")}
            >
              <h2 className="flex items-center justify-center gap-1 py-2 text-lg font-bold text-teal-500 border-b-[1.5px] border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <p>Todo</p>
              </h2>
              {/* for todos list */}
              <ul className="flex flex-col gap-5 p-4" id="todo">
                {boards[currentBoard]?.todos?.map((todo, index) => {
                  return (
                    <li
                      key={todo?.id}
                      draggable="true"
                      onDragStart={(event) =>
                        handleDragStart(event, todo, "todos")
                      }
                      className="p-2 text-teal-500 rounded-md shadow-sm cursor-move item"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{ backgroundColor: todo?.label?.colorCode }}
                          className="px-2 py-1 text-xs font-semibold text-white rounded-md w-fit"
                        >
                          {todo?.label?.name}
                        </span>
                        <button
                          className="text-red-500"
                          onClick={() => handleTaskDelete("todos", index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="my-2 font-medium">
                        <h5>{todo?.title}</h5>
                        <p className="text-sm">{todo?.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold"> {todo?.date}</p>
                        <div
                          className="tooltip tooltip-accent"
                          data-tip={todo?.assignee?.name}
                        >
                          <img
                            src={todo?.assignee?.avatar}
                            alt="user profile"
                            className="rounded-full w-7 h-7"
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* in progress container */}
            <div
              className="self-stretch flex-1 rounded-md shadow-md min-w-[300px]"
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, "progress")}
            >
              <h2 className="flex items-center justify-center gap-1 py-2 text-lg font-bold text-teal-500 border-b-[1.5px] border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                  />
                </svg>
                <p>In Progress</p>
              </h2>
              {/* for todo list */}
              <ul className="flex flex-col gap-5 p-4" id="progress">
                {boards[currentBoard]?.progress?.map((todo, index) => {
                  return (
                    <li
                      key={todo?.id}
                      draggable="true"
                      onDragStart={(event) =>
                        handleDragStart(event, todo, "progress")
                      }
                      className="p-2 text-teal-500 rounded-md shadow-sm cursor-move item"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{ backgroundColor: todo?.label?.colorCode }}
                          className="px-2 py-1 text-xs font-semibold text-white rounded-md w-fit"
                        >
                          {todo?.label?.name}
                        </span>
                        <button
                          className="text-red-500"
                          onClick={() => handleTaskDelete("progress", index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="my-2 font-medium">
                        <h5>{todo?.title}</h5>
                        <p className="text-sm">{todo?.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold"> {todo?.date}</p>
                        <div
                          className="tooltip tooltip-accent"
                          data-tip={todo?.assignee?.name}
                        >
                          <img
                            src={todo?.assignee?.avatar}
                            alt="user profile"
                            className="rounded-full w-7 h-7"
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* for review container */}
            <div
              className="self-stretch flex-1 rounded-md shadow-md min-w-[300px]"
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, "review")}
            >
              <h2 className="flex items-center justify-center gap-1 py-2 text-lg font-bold text-teal-500 border-b-[1.5px] border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <p>Review</p>
              </h2>
              {/* for todo list */}
              <ul className="flex flex-col gap-5 p-4" id="review">
                {boards[currentBoard]?.review?.map((todo, index) => {
                  return (
                    <li
                      key={todo?.id}
                      draggable="true"
                      onDragStart={(event) =>
                        handleDragStart(event, todo, "review")
                      }
                      className="p-2 text-teal-500 rounded-md shadow-sm cursor-move item"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{ backgroundColor: todo?.label?.colorCode }}
                          className="px-2 py-1 text-xs font-semibold text-white rounded-md w-fit"
                        >
                          {todo?.label?.name}
                        </span>
                        <button
                          className="text-red-500"
                          onClick={() => handleTaskDelete("review", index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="my-2 font-medium">
                        <h5>{todo?.title}</h5>
                        <p className="text-sm">{todo?.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold"> {todo?.date}</p>
                        <div
                          className="tooltip tooltip-accent"
                          data-tip={todo?.assignee?.name}
                        >
                          <img
                            src={todo?.assignee?.avatar}
                            alt="user profile"
                            className="rounded-full w-7 h-7"
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* completed container */}
            <div
              className="self-stretch flex-1 rounded-md shadow-md min-w-[300px]"
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, "done")}
            >
              <h2 className="flex items-center justify-center gap-1 py-2 text-lg font-bold text-teal-500 border-b-[1.5px] border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
                  />
                </svg>
                <p>Done</p>
              </h2>
              {/* for todo list */}
              <ul className="flex flex-col gap-5 p-4" id="completed">
                {boards[0]?.done?.map((todo, index) => {
                  return (
                    <li
                      key={todo?.id}
                      draggable="true"
                      onDragStart={(event) =>
                        handleDragStart(event, todo, "done")
                      }
                      className="p-2 text-teal-500 rounded-md shadow-sm cursor-move item"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{ backgroundColor: todo?.label?.colorCode }}
                          className="px-2 py-1 text-xs font-semibold text-white rounded-md w-fit"
                        >
                          {todo?.label?.name}
                        </span>
                        <button
                          className="text-red-500"
                          onClick={() => handleTaskDelete("done", index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="my-2 font-medium">
                        <h5>{todo?.title}</h5>
                        <p className="text-sm">{todo?.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold"> {todo?.date}</p>
                        <div
                          className="tooltip tooltip-accent"
                          data-tip={todo?.assignee?.name}
                        >
                          <img
                            src={todo?.assignee?.avatar}
                            alt="user profile"
                            className="rounded-full w-7 h-7"
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-xl font-bold">
            Create a new board to start{" "}
            <span className="ml-2 text-2xl text-accent">:)</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
