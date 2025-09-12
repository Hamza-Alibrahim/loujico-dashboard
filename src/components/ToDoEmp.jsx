import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ToDoEmp = () => {
  const { t } = useTranslation();
  const [todos, setTodos] = useState([]);
  const [data, setData] = useState({});

  const commonProps = {
    className: `px-3 py-2 bg-gray-200 rounded-md transition-colors hover:bg-gray-100 focus:bg-white focus-visible:outline-[var(--main-color)] w-full`,
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-sm font-medium">
        {t("todoEmp.associatedEmployees")}
      </h1>
      <div className="flex justify-between items-center gap-4">
        <select
          {...commonProps}
          value={data.id + " " + data.name || ""}
          onChange={(e) => {
            const [id, name] = e.target.value.split(" ");
            setData({ ...data, id, name });
          }}
        >
          <option value="">{t("todoEmp.chooseEmployee")}</option>
          <option value="1 hamza">hamza</option>
          <option value="2 fares">fares</option>
          <option value="3 makin">makin</option>
        </select>
        <input
          value={data.role || ""}
          onChange={(e) => setData({ ...data, role: e.target.value })}
          {...commonProps}
          type="text"
          placeholder={t("todoEmp.rolePlaceholder")}
        />
        <button
          type="button"
          onClick={() => {
            let c = 0;
            for (let k in data) {
              if (!data[k]) {
                return;
              }

              c++;
            }

            if (c === 3) {
              setTodos([...todos, data]);
              setData({});
            }
          }}
          className="px-4 py-2 text-white bg-[var(--main-color)] rounded-md hover:bg-[var(--main-color-darker)] cursor-pointer transition-colors"
        >
          {t("todoEmp.addButton")}
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {todos.map((todo, index) => {
          return (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-200 p-2 rounded-md"
            >
              <span>
                {todo.name} / {todo.role}
              </span>
              <FaTrash
                className="cursor-pointer"
                onClick={() => {
                  setTodos(todos.filter((e) => e.id !== todo.id));
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ToDoEmp;
