import React, { useState, useEffect } from 'react'
import { useToast, } from '@chakra-ui/react'


import { Link, useNavigate} from "react-router-dom";
import Axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("")
  const [pass, setPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [name, setName] = useState("")
  const toast = useToast()
  const [statusAuthenticated, setStatusAuthenticated] = useState(false)

  useEffect(() => {
    setStatusAuthenticated(localStorage.getItem("isAuthenticated") || false)
    if(localStorage.getItem("isAuthenticated") || false){
        navigate("/")
    }
  }, [navigate])

  const showToast = (title, error, status) => {
    toast({
      title: title,
      description: error,
      status: status,
      duration: 5000,
      isClosable: true,
      position: 'top-center',
    })
  }

  const postToAPI = (name, studentId, password) =>{
    const data = new FormData()
    data.append('name', name)
    data.append('studentId', studentId)
    data.append('password', password)

    Axios.post("http://localhost:4000/v1/auth/register", data, {
        headers: {
            'Content-Type': "multipart/form-data"
        }
    })

    .then((result) =>{
        setStudentId("")
        setPass("")
        setConfirmPass("")
        setName("")
        showToast("Account Created", "Your account has been created, Nice!", "success")
    })

    .catch((error) => {
        if(error.response.data === "Student ID already exist"){
            showToast("Student ID already Exists.", "Your student ID already exist on our database", "error")
        }else{
            showToast("Connection Error", "We didn't find connection to the server", "error")
        }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let validStudentId = false;
    var validInput = false;

    if(studentId !== "" && studentId.length === 5){
        const firstThreeDigitSum = parseInt(studentId.substring(0, 1)) + parseInt(studentId.substring(1, 2)) + parseInt(studentId.substring(2, 3))
        const fourthAndFifthDigit = parseInt(studentId.substring(3, 5))
        if(firstThreeDigitSum === fourthAndFifthDigit){
            validStudentId = true
        }
    }

    if(studentId === "" || pass === "" || confirmPass === "" || name === ""){
        showToast("Invalid Input.", "All input is not filled", "error")
    }else if(validStudentId === false && pass !== confirmPass){
        showToast("Invalid Input.", "Password is not matched and wrong student ID pattern", "error")
    }else if(validStudentId === false){
        showToast("Invalid Input.", "Student ID pattern is wrong", "error")
    }else if(pass !== confirmPass){
        showToast("Invalid Input.", "Password is not matched", "error")
    }else{
        validInput = true;
    }
    
    if(validInput === true){
        postToAPI(name, studentId, pass)
    }
  }

  return (
    <>
        {statusAuthenticated === false && <div className = "flex flex-col">
            <h1 className = "mt-24 text-center font-bold text-white text-4xl mb-8"> Register </h1>
            
            <form onSubmit = {handleSubmit} className = "flex flex-col m-auto form px-16 rounded-md min-w-full md:min-w-min md:w-1/2">
                <div className = "flex flex-col mb-4 mt-8">
                    <label className = "text-white font-bold"> Student's Name </label>
                    <input type = "text" className = "px-4 my-2 py-2 rounded-md border-none" placeholder='Masukkan nama mahasiswa disini...'
                        value = {name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className = "flex flex-col my-4">
                    <label className = "text-white font-bold"> Student ID </label>
                    <input type="text"
                        pattern="[0-9]*"
                        value={studentId}
                        onChange={(e) => setStudentId((v) => (e.target.validity.valid ? e.target.value : v))} 
                        placeholder='Masukkan student ID disini...' className = "px-4 my-2 py-2 rounded-md inline"
                    />
                </div>
                <div className = "flex flex-col my-4">
                    <label className = "text-white font-bold"> Password </label>
                    <input type = "password" className = "px-4 my-2 py-2 rounded-md" placeholder='Masukkan student ID disini...'
                        value = {pass}
                        onChange={(e) => setPass(e.target.value)}
                    />
                </div>
                <div className = "flex flex-col my-4">
                    <label className = "text-white font-bold"> Confirm Password </label>
                    <input type = "password" className = "px-4 my-2 py-2 rounded-md" placeholder='Masukkan student ID disini...'
                        value = {confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                    />
                </div>
                <div className = "text-right pt-4 pb-8">
                    <button type = "submit" className = "text-black font-bold px-8 py-2 duration-1000 bg-lime-400 rounded-md hover:bg-lime-300"> 
                    Sign up </button>
                </div>
            </form>
            <div className = "text-center mt-8 mb-8 text-white font-bold">
                <p> Sudah punya akun? <button className = "cursor-pointer text-black py-2 px-8 mx-4 bg-yellow-400 rounded-md hover:bg-yellow-300 duration-1000"> <Link to="/login"> Login disini! </Link> </button> </p>
            </div>
        </div>}
    </>
  )
}

export default Register