import Head from "next/head";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Notification from "./components/Notification";
import ActionButton from "./components/ActionButton";
import MongoApi from "../service/MongoApi";

const Listing = ({ initial_todos }) => {
  const [data, setData] = useState("");
  const [todos, setToDos] = useState(initial_todos);
  const [action, setAction] = useState(false);
  const [target, setTarget] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClasses =
    "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ";

  useEffect(() => {
    setLoading(false);
  }, [todos]);

  const addItem = async () => {
    const newTodo = {
      uid: uuidv4(),
      desc: data,
      done: false,
    };
    setTarget(newTodo);
    setLoading(true);

    const res = await MongoApi.addItem(newTodo, setErrorMessage);
    if (res) {
      setToDos([newTodo, ...todos]);
      setAction("ADD");
    } else {
      setAction("ERROR");
      setTarget(false);
    }
  };

  const removeItem = async (toRemove) => {
    const changedTodos = todos.filter((todo) => todo.uid !== toRemove.uid);
    setTarget(toRemove);
    setLoading(true);

    const res = await MongoApi.removeItem(toRemove, setErrorMessage);
    if (res) {
      setToDos(changedTodos);
      setAction("REMOVE");
    } else {
      setAction("ERROR");
      setTarget(false);
    }
  };

  const editItem = (toEdit) => {
    setEditMode(toEdit.uid);
    setEditData(toEdit);
  };

  const saveEditItem = async (toSaveEdit) => {
    let toSaveEditItem = null;
    const changedTodos = todos.map((item) => {
      if (item.uid == toSaveEdit.uid && item.desc !== toSaveEdit.desc) {
        toSaveEditItem = {
          ...item,
          desc: toSaveEdit.desc,
        };
        return toSaveEditItem;
      }
      return item;
    });

    if (toSaveEditItem) {
      setTarget(toSaveEditItem);
      setLoading(true);
      const res = await MongoApi.saveEditItem(toSaveEditItem, setErrorMessage);

      if (res) {
        setAction("EDIT");
        setToDos(changedTodos);
      } else {
        setAction("ERROR");
      }
    }
    setEditMode(false);
  };

  const toggleProgress = async (uid) => {
    let toEditItem = null;
    const changedTodos = todos.map((item) => {
      if (item.uid == uid) {
        !item.done ? setAction("COMPLETE") : setAction("INCOMPLETE");
        toEditItem = {
          ...item,
          done: !item.done,
        };
        return toEditItem;
      }
      return item;
    });
    setTarget(toEditItem);
    setLoading(true);

    const res = await MongoApi.saveEditItem(toEditItem, setErrorMessage);
    if (res) {
      setToDos(changedTodos);
    } else {
      setAction("ERROR");
      setTarget(false);
    }

    setEditMode(false);
  };

  const spinner = () => {
    return loading ? (
      <svg
        role="status"
        className="z-0 hover:z-50 absolute w-full h-full items-center mr-2 text-black-200 animate-spin dark:text-gray-600 fill-yellow-300"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    ) : null;
  };

  return (
    <div className="relative container mx-auto px-4 mt-6">
      {spinner()}
      <Head>
        <title>ToDo App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex-col space-y-4 text-center">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
            Simple TODO List
          </h5>
          <div className="flex flex-row">
            <div className="p-6 w-full text-center bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className={inputClasses}
                  required
                  placeholder={"Add TODO Item..."}
                />
                <button
                  disabled={data.length === 0}
                  className="bg-yellow-300  hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded"
                  onClick={addItem}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap flex-row">
            <div className="w-full md:basis-1/2 xs:basis-1">
              <div className="flex flex-col space-y-4">
                {todos.filter((item) => !item.done).length === 0 ? (
                  <p className="uppercase text-lg md:text-base">
                    You're Free Of ToDos!
                  </p>
                ) : (
                  <p className="uppercase text-lg md:text-base">ToDo</p>
                )}
                {todos
                  .filter((item) => !item.done)
                  .map((item) => {
                    return (
                      <div className="flex flex-row mb-4" key={item.uid}>
                        <div className="basis-1/8">
                          <input
                            uid={item.uid}
                            aria-describedby="checkbox-1"
                            type="checkbox"
                            className="w-6 h-6 text-yellow-300 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            checked={item.done}
                            onChange={() => toggleProgress(item.uid)}
                          />
                        </div>
                        <div className="basis-2/4">
                          <div className="flex flex-col space-x-4">
                            <label
                              htmlFor={item.uid}
                              className={
                                "ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 " +
                                (editMode == item.uid && " hidden")
                              }
                            >
                              {item.desc}
                            </label>
                            <input
                              type="text"
                              value={editData.desc || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  desc: e.target.value,
                                })
                              }
                              className={
                                inputClasses +
                                (editMode != item.uid && " hidden")
                              }
                              required
                              placeholder={"Edit " + item.desc}
                            />
                          </div>
                        </div>
                        <div className="basis-1/4">
                          <div className="flex flex-row-reverse space-x-3 space-x-reverse">
                            <ActionButton
                              CTA={removeItem}
                              data={item}
                              className={editMode == item.uid && " hidden"}
                              action={"remove"}
                            />
                            <ActionButton
                              CTA={editItem}
                              data={item}
                              className={editMode == item.uid && " hidden"}
                              action={"edit"}
                            />
                            <ActionButton
                              CTA={saveEditItem}
                              data={editData}
                              className={editMode != item.uid && " hidden"}
                              action={"confirm-edit"}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="w-full md:basis-1/2 xs:basis-1">
              <div className="flex flex-col space-y-4">
                <p className="uppercase text-lg md:text-base">Done</p>
                {todos
                  .filter((item) => item.done)
                  .map((item, uid) => {
                    return (
                      <div className="flex flex-row mb-4" key={item.uid}>
                        <div className="basis-1/8">
                          <input
                            uid={item.uid}
                            aria-describedby="checkbox-1"
                            type="checkbox"
                            className="w-6 h-6 text-yellow-300 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            checked={item.done}
                            onChange={() => toggleProgress(item.uid)}
                          />
                        </div>
                        <div className="basis-2/4">
                          <label
                            htmlFor={item.uid}
                            className={
                              "ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 " +
                              (item.done && "completed")
                            }
                          >
                            {item.desc}
                          </label>
                        </div>
                        <div className="basis-1/4">
                          <div className="flex flex-row-reverse space-x-4 space-x-reverse">
                            <ActionButton
                              CTA={removeItem}
                              data={item}
                              className={editMode == item.uid && " hidden"}
                              action={"remove"}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <Notification
          todos={todos}
          target={target}
          action={action}
          errorMessage={errorMessage}
        />
      </footer>
    </div>
  );
};

export async function getStaticProps() {
  let initial_todos = await MongoApi.getItemList();

  return {
    props: {
      initial_todos,
    },
  };
}

export default Listing;
