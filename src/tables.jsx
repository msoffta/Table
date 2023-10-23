import React, { useState, useEffect } from "react";
import Modal from "react-overlays/Modal";

export default function Table({ changed }) {
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [Users, setUsers] = useState([]);

  const base_url = "http://localhost:8080";

  useEffect(() => {
    getUsers();
  }, [changed]);

  const handleClose = () => {
    setCurrentUser(null);
    setShowModal(false);
  };

  const loadModal = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  async function getUsers() {
    try {
      const response = await fetch(`${base_url}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const updateUser = async (user_id, name, age) => {
    try {
      await fetch(`${base_url}/users/${user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, age }),
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (user) => {
    try {
      await fetch(`${base_url}/users/${user}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUsers(Users.filter((u) => u.id !== user));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const modalSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("name");
    const age = form.get("age");

    updateUser(currentUser, name, age);

    const nameElement = document.querySelector(
      `tr[data-id="${currentUser}"] td[data-name]`
    );
    const ageElement = document.querySelector(
      `tr[data-id="${currentUser}"] td[data-age]`
    );

    if (nameElement && ageElement) {
      nameElement.innerHTML = name;
      ageElement.innerHTML = new Date().getFullYear() - +age;
    }

    handleClose();
  };

  let tableRows = Users.map((user) => (
    <tr key={user.id} data-id={user.id}>
      <td>{user.id}</td>
      <td data-name={user.name}>{user.name}</td>
      <td data-age={user.age}>{new Date().getFullYear() - +user.age}</td>
      <td>
        <button
          onClick={() => loadModal(user.id)}
          className="material-symbols-outlined edit"
        >
          edit_note
        </button>
        <button
          onClick={() => deleteUser(user.id)}
          className="material-symbols-outlined delete"
        >
          delete
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Имя</th>
            <th>Год рождения</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>

      <Modal
        className="modal"
        show={showModal}
        onHide={handleClose}
        renderBackdrop={(props) => <div className="backdrop" {...props} />}
        onBackdropClick={() => handleClose()}
      >
        <div className="modal__wrapper">
          <button
            className="material-symbols-outlined close"
            onClick={handleClose}
            type="button"
          >
            close
          </button>
          <form onSubmit={modalSubmit} name="change_modal">
            <label className="name" htmlFor="name">
              <p>
                Имя: <span>{currentUser ? currentUser.name : ""}</span>
              </p>
              <input type="text" id="name" name="name" />
            </label>
            <label htmlFor="age">
              <p>
                Возраст: <span>{currentUser ? currentUser.age : ""}</span>
              </p>
              <input type="number" id="age" name="age" />
            </label>
            <button className="form__submit" type="submit">
              Изменить
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
