import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import InputControl from "../InputControl/InputControl";
import styles from "./Login.module.css";
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'


function Login() {

    const navigate = useNavigate();

    const [values, setValues] = useState({
        email: "",
        pass: "",
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const handleSubmission = () => {

        if (!values.email || !values.pass) {
            setErrorMsg("Enter All Fields!");
            return;
        }
        setErrorMsg("");
        setSubmitButtonDisabled(true);
        signInWithEmailAndPassword(auth, values.email, values.pass)
            .then((res) => {
                // call login api for log in the user
                fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ values, res }),
                }).then(async (res) => {
                    setSubmitButtonDisabled(false);
                    if (parseInt(res.status) === 400 || parseInt(res.status) === 409) {
                        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!', })
                    }
                    setSubmitButtonDisabled(false);
                    let response = await res.json()
                    localStorage.setItem('token', response.data.token);
                    Swal.fire({
                        position: 'top-end', icon: 'success', title: 'Login Successfull..', showConfirmButton: false, timer: 1500
                    })
                    navigate("/");
                })
                    .catch((err) => {
                        setSubmitButtonDisabled(false);
                        setErrorMsg(err.message);
                        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!', })
                    });
            }).catch((err) => {
                setSubmitButtonDisabled(false);
                setErrorMsg(err.message);
                Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!', })
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.innerBox}>
                <h1 className={styles.heading}>Login</h1>

                <InputControl
                    label="Email"
                    onChange={(event) =>
                        setValues((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="Enter email address"
                />
                <InputControl
                    label="Password"
                    onChange={(event) =>
                        setValues((prev) => ({ ...prev, pass: event.target.value }))
                    }
                    placeholder="Enter Password"
                />

                <div className={styles.footer}>
                    <b className={styles.error}>{errorMsg}</b>
                    <button disabled={submitButtonDisabled} onClick={handleSubmission}>
                        Login
                    </button>
                    <p>
                        Already have an account?{" "}
                        <span>
                            <Link to="/signup">Sign up</Link>
                        </span>

                    </p>
                    <span>
                        <Link to="/">Go to Home Page</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;
