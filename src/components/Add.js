import React, { useState, useEffect } from 'react'
import { useToast, } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import Axios from 'axios'

const Add = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")  
  const [statusAuthenticated, setStatusAuthenticated] = useState("false")

  const toast = useToast()
    
  useEffect(() => {
    setStatusAuthenticated(localStorage.getItem("isAuthenticated") || "false")
    if((localStorage.getItem("isAuthenticated") || "false") === "false"){
        navigate("/")
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if(name === "" || description === "" || price === ""){
        toast({
            title: 'Error Found.',
            description: "Ada input yang belum diisi.",
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-center',
          })
    }
    const data = new FormData()
    data.append('name', name)
    data.append('desc', description)
    data.append('image', image)
    data.append('price', price)

    Axios.post("http://localhost:4000/v1/product/post", data, {
        headers: {
            'Content-Type': "multipart/form-data"
        }
    })

    .then((result) => {
        setName("")
        setPrice("")
        setImage("")
        setDescription("")
        toast({
            title: 'Product Added.',
            description: "You have added the product, Cheers!",
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-center',
        })
    })
    .catch(error => {
        if(name !== "" && description !== "" & price !== ""){
            toast({
                title: 'Error Found.',
                description: "You haven't attached any image file or server hasn't run yet",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-center',
              })
        }
        console.log(error)
    })

  }

  return (
    <>
        {statusAuthenticated === "true" &&
            <div className = "flex flex-col mb-12">
                <h1 className = "mt-24 text-center font-bold text-white text-4xl mb-8"> Add an Item </h1>
                
                <form onSubmit = {handleSubmit} className = "flex flex-col m-auto form px-16 rounded-md min-w-full md:min-w-min md:w-1/2">
                    <div className = "flex flex-col mb-4 mt-8">
                        <label className = "text-white font-bold"> Item's Name </label>
                        <input type = "text" className = "px-4 my-2 py-2 rounded-md" placeholder='Masukkan nama barang disini...'
                            value = {name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className = "flex flex-col my-4">
                        <label className = "text-white font-bold"> Item's description </label>
                        <textarea type = "text" className = "px-4 my-2 py-2 rounded-md" placeholder='Masukkan deskripsi barang disini...'
                            value = {description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className = "flex flex-col my-4">
                        <label className = "text-white font-bold"> Item's Price </label>
                        <input type="text"
                            pattern="[0-9]*"
                            value={price}
                            onChange={(e) => setPrice((v) => (e.target.validity.valid ? e.target.value : v))} 
                            placeholder='Masukkan harga barang disini...' className = "px-4 my-2 py-2 rounded-md inline"
                        />
                    </div>

                    <div className = "flex flex-col my-4 text-white">
                        <label className = "font-bold"> Item's Image </label>
                        <div className = "w-full h-24 flex flex-col justify-center items-center bg-zinc-300 text-xs rounded-md mt-4 text-center font-semibold text-gray-600">
                            <input type = "file" onChange = {(e) => setImage(e.target.files[0])}/>
                        </div>
                    </div>

                    <div className = "text-right pt-4 pb-8">
                        <button type = "submit" className = "text-black font-bold px-8 py-2 duration-500 bg-rose-600 rounded-md hover:bg-rose-500"> 
                        Add item! </button>
                    </div>
                </form>
            </div>
        }
    </>
  )
}

export default Add