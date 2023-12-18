import {  useContext, useState } from 'react';
import { Context } from '../main';
import { observer } from 'mobx-react-lite';

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { store } = useContext(Context)
    return (
        <div>
            <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type='email'
                placeholder='Email'
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type='password'
                placeholder='Пароль'
            />
            <button onClick={() => store.login(email, password)}>Логин</button>
            <button onClick={() => store.registration(email, password)}>Регистрация</button>


        </div>
    );
};

export default  observer(LoginForm);