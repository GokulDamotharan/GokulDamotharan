import React from 'react';
import Footer from '../Basic/Footer';
import Navbar from '../Basic/Navbar';
import LoginForm from '../Doctorlogin/LoginForm';

const DoctorLogin = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <LoginForm />
            </div>
            <Footer />
        </div>
    )
}

export default DoctorLogin;