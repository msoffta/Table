import Table from "./tables";
import { useState, useEffect } from "react";
export default function App() {
  let base_url = "http://localhost:8080";

  const [updatedUser, setUpdatedUser] = useState(false);

  async function sendUser(url, user) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
    } catch (error) {
      console.error(error);
    }
  }

  function addUser() {
    let name_input = document.querySelector("input[name='name']");
    let age_input = document.querySelector("input[name='age']");

    if (!name_input.value || !age_input.value) {
      alert("Заполните все поля");
      return;
    }

    let user = {
      name: name_input.value,
      age: age_input.value,
    };

    sendUser(`${base_url}/users`, user);
    setUpdatedUser(true);
    setTimeout(() => {
      setUpdatedUser(false);
    }, 1);
  }

  return (
    <div className="wrap">
      <h1 className="h1">
        Добавление, Изменение и Удаление элементов из таблицы
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addUser();
        }}
        name="addForm"
      >
        <label className="name" htmlFor="name">
          <span>Имя</span>
          <input type="text" id="name" name="name" />
        </label>

        <label htmlFor="age">
          <span>Возраст</span>
          <input type="number" id="age" name="age" />
        </label>

        <button className="form__submit" type="submit">
          Показать
        </button>
      </form>
      <Table changed={updatedUser} />
    </div>
  );
}
