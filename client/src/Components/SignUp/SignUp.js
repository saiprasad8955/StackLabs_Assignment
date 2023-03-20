import React, { useState } from 'react'
import InputControl from '../InputControl/InputControl'
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import Swal from 'sweetalert2';

const SignUp = () => {

    const navigate = useNavigate();
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: ""
    });

    const [errorMsg, setErrorMsg] = useState("")
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const handleSubmission = async () => {

        // Validations
        if (!values.name || !values.email || !values.password || !values.phone || !values.address) {
            setErrorMsg("Please Enter All Fields!!")
            return;
        }
        setErrorMsg('');
        setSubmitButtonDisabled(true);
        console.log(values)
        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values),
        }).then((res) => {

            setSubmitButtonDisabled(false);
            // POP UP for Success
            Swal.fire('User Created Successfully..')
            navigate("/");
        }).catch((err) => {
            setSubmitButtonDisabled(false);
            setErrorMsg(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.innerBox}>
                <h1 className={styles.heading}>SignUp</h1>

                <InputControl
                    label="Name"
                    onChange={(event) =>
                        setValues((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="Enter Name Here.."
                />

                <InputControl
                    label="Email"
                    onChange={(event) =>
                        setValues((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="Enter Email Address.."
                />

                <InputControl
                    label="Password"
                    onChange={(event) =>
                        setValues((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder="Enter Password Here.." 
                />

                <InputControl
                    label="Phone"
                    onChange={(event) =>
                        setValues((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    placeholder="Enter Number Here.."
                />

                <InputControl
                    label="Address"
                    onChange={(event) =>
                        setValues((prev) => ({ ...prev, address: event.target.value }))
                    }
                    placeholder="Enter Address Here.."
                />



                <div className={styles.footer}>
                    <b className={styles.error}>{errorMsg}</b>
                    <button disabled={submitButtonDisabled} onClick={handleSubmission}>
                        Login
                    </button>
                    <p>
                        Already have an account?{" "}
                        <span>
                            <Link to="/login">Login Here</Link>
                        </span>
                    </p>
                </div>
                <span>
                    <Link to="/">Go to Home Page</Link>
                </span>
            </div>
        </div>
    )
}

export default SignUp
