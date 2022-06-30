import React, { useState, useEffect, useContext } from 'react'
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/GlobalAuthContext';
import PersonIcon from '@mui/icons-material/Person';

const Header = () => {
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const auth = useContext(AuthContext)

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isAuthenticated") || false)
  }, [isAuthenticated, auth.isAuthenticated]);

  useEffect(() => {
    if(menu === true){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "initial";
    }
  }, [menu]);

  const logout = () =>{
    auth.logout()
    setIsAuthenticated(false)
    navigate("/")
  }

  return (
    <>
      <div className = "relative text-white flex justify-around items-center h-16 font-bold z-10 w-full md:fixed top-0 bg-[#141316] max-w-full">
        <ul className = "flex items-center">
          <li onClick = {() => setMenu(false)} className = "mx-8 cursor-pointer">
              <Link to="/"> Home </Link>
          </li>
          <li className = "mx-8 cursor-pointer hidden md:block">
              <Link to="/add"> Add Product </Link>
          </li>
        </ul>
        {isAuthenticated === false || isAuthenticated === null ? 
          <ul className = "flex items-center">
            <button className = "hidden md:block cursor-pointer text-black py-2 px-8 mx-4 bg-lime-400 rounded-md hover:bg-lime-300 duration-1000">
                <Link to="/register"> Register </Link>
            </button>
              <button className = "cursor-pointer hidden md:block text-black py-2 px-8 mx-4 bg-yellow-400 rounded-md hover:bg-yellow-300 duration-1000">
                <Link to="/login"> Login </Link>
              </button>
              <HamburgerIcon className = "md:invisible block text-3xl cursor-pointer" value = {menu} onClick = {() => setMenu(!menu)}/>
          </ul> 
          : 
          <ul className = "flex items-center">
            <div className = "flex">
              <PersonIcon />
              <li className = "mr-8 ml-4 capitalize"> {localStorage.getItem("name") || ""} </li>
            </div>
            <button onClick = {logout} className = "cursor-pointer hidden md:block py-2 px-8 mx-4 bg-red-600 rounded-md hover:bg-red-500 duration-1000">
              Logout
            </button>
          </ul>
        }
      </div>
      {menu && 
        <div className = "h-screen w-full text-white absolute top-20 left-0 z-10 bg-[#141316] list-none font-bold text-2xl text-center">
          <li onClick = {() => setMenu(false)} className = "p-8 cursor-pointer w-full hover:bg-gray-800">
              <Link to="/add"> Add Product </Link>
          </li>
          <li onClick = {() => setMenu(false)} className = "p-8 cursor-pointer w-full hover:bg-gray-800">
              <Link to="/register"> Register </Link>
          </li>
          <li onClick = {() => setMenu(false)} className = "p-8 cursor-pointer hover:bg-gray-800 w-full">
              <Link to="/login"> Login </Link>
          </li>
        </div>}
      </>
  );
}

export default Header