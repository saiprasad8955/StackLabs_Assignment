import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, signOut } from "../../firebase";
import Swal from 'sweetalert2';
import '../Home/table.module.css'
import '../Home/Home.module.css'



function Home(props) {
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const signOutUser = () => {
        Swal.fire({
            title: 'Are you sure you want to log out?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes, I'm Sure!"
        }).then((result) => {
            if (result.isConfirmed) {
                signOut(auth).then(() => {
                    localStorage.removeItem('token');
                    setUsers();
                    // POP UP for Success
                    Swal.fire('User Logged Out Successfully..')
                }).catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    })
                });
            }
        })


    }

    const [users, setUsers] = useState("")
    const token = localStorage.getItem('token');

    // fetch users
    const fetchUsers = () => {
        setSubmitButtonDisabled(true);
        fetch("/api/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        }).then(async (res) => {

            if (parseInt(res.status) === 400 || parseInt(res.status) === 409) {
                Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!', })
            }
            let response = await res.json();
            setUsers(response.data)
            Swal.fire({
                position: 'top-end', icon: 'success', title: 'Fetched data Successfully..', showConfirmButton: false, timer: 500
            })
            setSubmitButtonDisabled(false);
        })
            .catch((err) => {
                setSubmitButtonDisabled(false);
                Swal.fire({ icon: 'error', title: 'Oops...', text: `${err.msg}`, })
            });
    }

    const cancelUsers = () => {
        setUsers();
        let timerInterval
        Swal.fire({
            title: 'Closing the List!',
            html: 'I will close in <b></b> milliseconds.',
            timer: 300,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        })
    }

    const [rs, setrs] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: "",
        createdAt: "",
        updatedAt: "",
        firebaseUid: "",
        __v: "",
        _id: ""

    })

    const showDetail = (id) => {

        fetch(`/api/userProfile/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        }).then(resposne => resposne.json())
            .then((res) => {
                setrs(res.data)
            }).catch(err => console.log(err))
    }

    const showUsers = (user, index) => {
        console.log("clicked");
        console.log(index);


    }

    return (


        <>
            {/* MODAL FOR SHOWING USER DETAILS */}
            {/* <!-- Button trigger modal --> */}
            {/* <button type="button" className="btn btn-primary " data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button> */}
            {/* <!-- Modal --> */}
            {/* <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* HOME PAGE */}
            {
                !props.name
                    ?
                    (
                        <div className="d-flex justify-content-end">

                            <h1 className="mt-5">
                                <button type="button" className="btn btn-light "><Link to="/login" style={{ fontSize: "25px" }}>Login</Link></button>
                                <button type="button" className="btn btn-light ml-4 mr-4"><Link to="/signup" style={{ fontSize: "25px" }} >Signup</Link></button>
                            </h1>
                        </div>
                    )
                    :
                    null

            }
            <div className="d-flex justify-content-center mt-2">
                <div className="form-column">
                    {props.name.displayName ? <button className="btn btn-primary float-right" onClick={signOutUser}> Sign Out</button> : null}
                    <h1 className="mt-5 display-2">{props.name.displayName ? `Welcome - ${props.name.displayName}` : <h1 style={{fontSize:"100px"}}>Login Please...</h1>}</h1>




                    {
                        props.name.displayName
                            ?
                            (
                                <div className="float-right mb-2">
                                    <button className="btn btn-primary" onClick={fetchUsers} disabled={submitButtonDisabled}>Fetch Users</button>
                                    {
                                        users ? <button className="btn btn-primary ml-2" onClick={cancelUsers} >Close List</button> : null
                                    }

                                </div>
                            )
                            : null
                    }

                    {
                        users ?
                            (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Sr No</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>View Details</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={user.email}>
                                                <td>{index + 1}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td><button className="btn btn-primary" onClick={(e) => showUsers(user)} >View Details</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : null
                    }
                </div>
            </div>
        </>
    );
}

export default Home;

