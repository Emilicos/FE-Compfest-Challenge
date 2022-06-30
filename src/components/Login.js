import React, { useState, useContext, useEffect } from 'react'
import { useToast, } from '@chakra-ui/react'
import { Link, useNavigate } from "react-router-dom";
import Axios from 'axios'
import { AuthContext } from '../context/GlobalAuthContext'

const Login = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("")
  const [pass, setPass] = useState("")
  const toast = useToast()
  const auth = useContext(AuthContext)
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

  const postToAPI = (studentId, password) =>{
    const data = new FormData()
    data.append('studentId', studentId)
    data.append('password', password)

    Axios.post("http://localhost:4000/v1/auth/login", data, {
        headers: {
            'Content-Type': "multipart/form-data"
        }
    })

    .then((result) =>{
        auth.login(result.data.name, result.data.token)
        setStudentId("")
        setPass("")
        showToast("Login Success", "Your have been connected to your account, Nice!", "success")
        navigate('/')
    })

    .catch((error) => {
        if(error.response.data.Message === "Student ID not found"){
            showToast("Student ID not found.", "We didn't find your student Id", "error")
        }else if(error.response.data.Message === 'Invalid Password'){
            showToast("Wrong Password.", "Your input password is wrong", "error")
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

    if(studentId === "" || pass === ""){
        showToast("Invalid Input.", "All input is not filled", "error")
    }else if(validStudentId === false){
        showToast("Invalid Input.", "Student ID pattern is wrong", "error")
    }else{
        validInput = true
    }

    if(validInput === true){
        postToAPI(studentId, pass)
    }
  }

  return (
    <>
    {statusAuthenticated === false && 
        <div className = "flex flex-col">
            <h1 className = "mt-24 text-center font-bold text-white text-4xl mb-8"> Login </h1>
            
            <form onSubmit = {handleSubmit} className = "flex flex-col m-auto form px-16 rounded-md min-w-full md:min-w-min md:w-1/2">
                <div className = "flex flex-col mb-4 mt-8">
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
                <div className = "text-right pt-4 pb-8">
                    <button type = "submit" className = "text-black font-bold px-8 py-2 duration-500 bg-yellow-400 rounded-md hover:bg-yellow-300"> 
                    Login </button>
                </div>
            </form>
            <div className = "text-center mt-8 mb-8 text-white font-bold">
                <p> Belum punya akun? <button className = "cursor-pointer text-black py-2 px-8 mx-4 bg-lime-400 rounded-md hover:bg-lime-300 duration-1000"> <Link to="/register"> Buat akun disini! </Link> </button> </p>
            </div>
        </div>
    }
    </>
  )
}

export default Login