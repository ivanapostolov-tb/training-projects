import React, { useState, setState } from 'react'
import './SignForm.css'
import { Route, Link, useHistory, Switch } from 'react-router-dom'
import { useStateValue } from '../StateProvider';

function SignUp() {
    const history = useHistory();
    const [state, dispatch] = useStateValue();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const request = async (url) => {
        const body = {
            fname: firstName,
            lname: lastName,
            mail: email,
            pass: password
        }

        const parameters = {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }

        try {
            const response = await fetch(url, parameters);

            if (response.status === 200) {
                return (await response.json());
            } else {
                throw new Error(`Status code ${response.status}`);
            }
        } catch (e) {
            throw new Error(e.message);
        }
    }

    const requestHandler = (e) => {
        e.preventDefault();

        request(state.baseUrl + 'auth/sign-up').then(response => {
            history.push('/sign-in');
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <form className="form" onSubmit={requestHandler}>
            <ul className="form__fieldsList">
                <li>
                    <div className="form__title">Sign up</div>
                </li>
                <li>
                    <label>First Name</label>
                    <input value={firstName} type="text" onChange={event => setFirstName(event.target.value)} />
                </li>
                <li>
                    <label>Last Name</label>
                    <input value={lastName} type="text" onChange={event => setLastName(event.target.value)} />
                </li>
                <li>
                    <label>Email</label>
                    <input value={email} type="email" onChange={event => setEmail(event.target.value)} />
                </li>
                <li>
                    <label>Password</label>
                    <input value={password} type="password" onChange={event => setPassword(event.target.value)} />
                </li>
                <li>
                    <button type="submit" className="form__button">Sign up</button>
                </li>
                <li>
                    <div className="form__switchText">Already have an account?</div>
                </li>
                <li>
                    <Link to="/sign-in" className="form__button form__switchButton">Sign in</Link>
                </li>
            </ul>
        </form>
    );
}

function SignIn() {
    const history = useHistory();
    const [state, dispatch] = useStateValue();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const request = async (url) => {
        const body = {
            mail: email,
            pass: password
        }

        const parameters = {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }

        try {
            const response = await fetch(url, parameters);

            if (response.status === 200) {
                return (await response.json());
            } else {
                throw new Error(`Status code ${response.status}`);
            }
        } catch (e) {
            throw new Error(e.message);
        }
    }

    const requestHandler = (e) => {
        e.preventDefault();

        request(state.baseUrl + 'auth/sign-in').then(response => {
            const action = {
                type: 'SET_USER',
                user: Object.assign(response, { email: email })
            }

            dispatch(action);

            history.push(email === 'admin@admin.com' ? '/admin' : '/');
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <form className="form" onSubmit={requestHandler}>
            <ul className="form__fieldsList">
                <li>
                    <div className="form__title">Sign in</div>
                </li>
                <li>
                    <label>Email</label>
                    <input value={email} type="email" onChange={event => setEmail(event.target.value)} />
                </li>
                <li>
                    <label>Password</label>
                    <input value={password} type="password" onChange={event => setPassword(event.target.value)} />
                </li>
                <li>
                    <button type="submit" className="form__button">Sign in</button>
                </li>
                <li>
                    <div className="form__switchText">New to ushop?</div>
                </li>
                <li>
                    <Link to="/sign-up" className="form__button form__switchButton">Sign up</Link>
                </li>
            </ul>
        </form>
    );
}

function SignForm() {
    return (
        <main className="sign">
            <Switch>
                <Route path="/sign-up" exact={true} component={SignUp} />
                <Route path="/sign-in" exact={true} component={SignIn} />
            </Switch>
        </main>
    );
}

export default SignForm;