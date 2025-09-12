import { useState, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ToDoFile = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [todos, setTodos] = useState([]);
  const [data, setData] = useState({});
  const fileInputRef = useRef(null);

  const commonProps = {
    className: `px-3 py-2 bg-gray-200 rounded-md transition-colors hover:bg-gray-100 focus:bg-white focus-visible:outline-[var(--main-color)] w-full`,
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-sm font-medium">{t("todoFile.associatedFiles")}</h1>
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex items-baseline w-full gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setData({ ...data, file: e.target.files[0] })}
            className="hidden"
            id="fileInput"
          />
          <label className="cursor-pointer shrink-0" htmlFor="fileInput">
            {t("todoFile.chooseFile")}
          </label>
          <span
            className={`text-sm overflow-scroll whitespace-nowrap ${
              language === "ar" ? "pl-2" : "pr-2"
            }`}
          >
            {data.file ? data.file.name : t("todoFile.noFileChosen")}
          </span>
        </div>
        <input
          value={data.description || ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          {...commonProps}
          type="text"
          placeholder={t("todoFile.descriptionPlaceholder")}
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

            if (c === 2) {
              setTodos([...todos, data]);
              setData({});
              fileInputRef.current.value = "";
            }
          }}
          className="px-4 py-2 text-white bg-[var(--main-color)] rounded-md hover:bg-[var(--main-color-darker)] cursor-pointer transition-colors whitespace-nowrap"
        >
          {t("todoFile.addButton")}
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {todos.map((todo, i) => {
          return (
            <div
              key={i}
              className="flex justify-between items-center bg-gray-200 p-2 rounded-md"
            >
              <span>
                {todo.file.name} / {todo.description}
              </span>
              <FaTrash
                className="cursor-pointer"
                onClick={() => {
                  setTodos(todos.filter((e) => e.file !== todos[i].file));
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ToDoFile;
