import React,{useState} from 'react';
import { Outlet,Link } from 'react-router-dom'; 
import { useDispatch, useSelector } from "react-redux";
import { logoutRedux } from "../redux/userSlice"; 
import './Header.css';
import { AiOutlineSearch,AiOutlineShoppingCart,AiFillHome } from "react-icons/ai";
import { BiChat } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import logo from './resources/logo.png';


function Header(){
    const user = useSelector((state) => state.user);
    const isAuthenticated = user.isAuthenticated;
    const dispatch = useDispatch();

    const handleLogout = () => {
      dispatch(logoutRedux());
      window.localStorage.setItem("token", false);
      window.localStorage.removeItem("token");
      alert("Logout Out Successfull");
    };

    return(
        <header className="header ">
            <img className="logo" src={logo} alt=''/>
            <a href='/'>Home</a>
            {/* <a href='#'>Today's Market</a> */}

            <a href="/myproduct">Selling Hub</a>
            <Link to="/basket">Basket</Link>
            <div className='menu'>
                <a className='menu-button' href='#'>Account</a>
                {isAuthenticated?(
                <div className='menu-content'>
                    {/* <a to="" href="#">Login</a> */}
                    {/* <Link to="/login">Login</Link> */}
                    <Link to="/profile">My Profile</Link>
                    <Link to="/myorders">My Order</Link>
                    <Link to="/" onClick={handleLogout}>Logout</Link>
                </div>
                ):
                (
                    <div className='menu-content'>
                    {/* <a to="" href="#">Login</a> */}
                    <Link to="/login">Login</Link>
                    {/* <Link to="/profile">My Profile</Link> */}
                    {/* <Link to="/myorders">My Order</Link> */}
                </div>
                )}
            </div>
        </header>
    );
}
export default Header;