import { useContext, useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import WBKyesForm from "./components/WBKeysForm";
import { Context } from "./main";
import { observer } from "mobx-react-lite";
import UserService from "./services/UserService";

function App() {
  const { store } = useContext(Context);
  const [users, setUsers] = useState([]);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  if (store.isLoading) {
    return <p>Загрузка...</p>;
  }
  if (!store.isAuth) {
    return (
      <>
        <LoginForm />
      </>
    );
  }
  return (
    <>
      <h1>
        {store.isAuth
          ? `Пользователь ${store.user.email} авторизован`
          : `Добро пожаловать в прототип`}
      </h1>
      <h2>
        {store.user.isActivated
          ? `Почта ${store.user.email} подтверждена`
          : `Пожалуйста, подтвердите свою почту`}
      </h2>
      <button onClick={() => store.logout()}>Выйти</button>
      <button onClick={getUsers}>Получить список пользователей</button>
      {users.map((user) => (
        <h2 key={user.email}>{user.email}</h2>
      ))}
      <WBKyesForm />
    </>
  );
}

export default observer(App);
