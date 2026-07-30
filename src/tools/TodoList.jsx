import { useState } from "react";

const Item = ({ s, onComplete }) => {
  return (
    <>
      <div className="flex flex-row m-1">
        <input
          type="checkbox"
          className="mr-1 mt-1"
          onChange={onComplete}
        ></input>
        <p className="text-2xl">{s}</p>
      </div>
    </>
  );
};
const CompletedItem = ({ s, onUncomplete }) => {
  return (
    <>
      <div className="flex flex-row m-1">
        <input
          type="checkbox"
          className="mr-1 mt-1"
          checked={true}
          onChange={onUncomplete}
        ></input>
        <p className="text-2xl">{s}</p>
      </div>
    </>
  );
};
export const ToDoList = () => {
  const [items, setItems] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemCheck, setItemCheck] = useState(true);
  if (
    JSON.parse(localStorage.getItem("UncompletedTasks")) != null &&
    itemCheck
  ) {
    setItems(JSON.parse(localStorage.getItem("UncompletedTasks")));
    setItemCheck(false);
  }
  const textFollow = (e) => {
    setItemName(e.currentTarget.value);
  };
  const addToArray = () => {
    items.push(itemName);
    setItems(items);
    setItemName("");
    saveData();
  };

  const handleComplete = (itemIndex) => {
    const itemToMove = items[itemIndex];
    const newItems = items.filter((_, index) => index !== itemIndex);
    setItems(newItems);
    setCompleted([...completed, itemToMove]);
    saveDataUsingIndex(newItems);
  };
  const handleUncomplete = (itemIndex) => {
    const itemToMove = completed[itemIndex];
    setCompleted(completed.filter((_, index) => index !== itemIndex));
    const newItems = [...items, itemToMove];
    setItems(newItems);
    saveDataUsingIndex(newItems);
  };
  const saveData = () => {
    localStorage.setItem("UncompletedTasks", JSON.stringify(items));
  };
  const saveDataUsingIndex = (store) => {
    localStorage.setItem("UncompletedTasks", JSON.stringify(store));
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-xl m-2">This is a To-Do List!</h3>
        <input
          type="text"
          value={itemName}
          onChange={textFollow}
          className="bg-inherit m-2 rounded-md border-2 text-3xl w-full md:w-1/2 border-black dark:border-white border-spacing-2"
        ></input>
        <button
          className="text-2xl bg-cyan-500 dark:bg-indigo-800 rounded-md p-2"
          onClick={addToArray}
        >
          Submit
        </button>
        <div className="flex flex-col m-2">
          <h3 className="flex justify-center text-3xl lg:text-4xl bg-cyan-500 dark:bg-indigo-800 rounded-md mt-4 mb-2">
            To-Do:
          </h3>
          {items.map((item, index) => (
            <Item
              key={index}
              s={item}
              onComplete={() => handleComplete(index)}
            />
          ))}
          <h3 className="flex justify-center text-3xl lg:text-4xl p-1 bg-cyan-500 dark:bg-indigo-800 rounded-md mt-4 mb-2">
            Completed:
          </h3>
          {completed.map((item, index) => (
            <CompletedItem
              key={index}
              s={item}
              onUncomplete={() => handleUncomplete(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
