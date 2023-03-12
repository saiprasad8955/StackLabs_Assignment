import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, signOut } from "../../firebase";
import Swal from 'sweetalert2';
import '../Home/table.module.css'
function Home(props) {


    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    // localStorage.getItem('token');
    const signOutUser = () => {
        signOut(auth).then(() => {
            localStorage.removeItem('token');
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

    const [users, setUsers] = useState("")
    const token = localStorage.getItem('token');

    // fetch users
    const fetchUsers = () => {
        fetch("/api/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        }).then(async (res) => {
            setSubmitButtonDisabled(false);
            if (parseInt(res.status) === 400 || parseInt(res.status) === 409) {
                Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!', })
            }
            setSubmitButtonDisabled(false);
            let response = await res.json();
            setUsers(response.data)
            Swal.fire({
                position: 'top-end', icon: 'success', title: 'Fetched data Successfully..', showConfirmButton: false, timer: 1500
            })
        })
            .catch((err) => {
                setSubmitButtonDisabled(false);
                Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!', })
            });
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

    return (
        <div className="d-flex justify-content-center mt-5">
            <div className="form-column">
                <h1 className="mt-5">
                    <Link to="/login">Login</Link>
                </h1>
                <h1 className="mt-5">
                    <Link to="/signup">Signup</Link>
                </h1>
                <h2 className="mt-5">{props.name.displayName ? `Welcome - ${props.name.displayName}` : "Login please"}</h2>
                {props.name.displayName ? <button className="btn btn-primary mr-2 mb-2" onClick={signOutUser}> Sign Out</button> : null}
                {
                    props.name.displayName
                        ?
                        <button className="btn btn-primary ml-2 mb-2" onClick={fetchUsers} disabled={submitButtonDisabled}> Fetch Users List</button>
                        : null
                }

                {
                    users ?
                        (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>View Details</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.email}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td><button className="btn btn-primary" onClick={(e) => showDetail(user._id)} data-bs-toggle="modal" data-bs-target="#myModal" >View Details</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : null
                }
            </div>

{/* ModalNot Working  */}
            <div className="modal" id="myModal">
                <div className="modal-dialog" style={{ width: "700px" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">User Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Name : {rs.name}</p>
                            <p>Email : {rs.email}</p>
                            <p>Address : {rs.address}</p>
                            <p>Phone : {rs.phone}</p>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

