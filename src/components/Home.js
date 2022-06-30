import React, { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import Product from './Product'
import { useSelector, useDispatch } from 'react-redux'
import { setDataProduct } from '../redux/action'
import { Button, Select, useToast, useDisclosure } from '@chakra-ui/react'
import { ArrowForwardIcon, ArrowBackIcon, AddIcon, ViewIcon } from '@chakra-ui/icons'
import { Link, } from "react-router-dom";
import ModalView from './Modal'
import { AuthContext } from '../context/GlobalAuthContext';

const Home = () => {
  const [reverseProduct, setReverseProduct] = useState([])
  const {products, } = useSelector(state => state)
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [disablePrevious, setDisablePrevious] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const [status, setStatus] = useState(false)
  const [totalData, setTotalData] = useState(0)
  const [ascending, setAscending] = useState("ascend")
  const [balance, setBalance] = useState(0)
  const [statusAuthenticated, setStatusAuthenticated] = useState(localStorage.getItem("isAuthenticated") || "false")
  const { isOpen, onOpen, onClose } = useDisclosure()

  var tempMoney;
  const auth = useContext(AuthContext)
  const toast = useToast()

  const showToast = (title, error, status) => {
    toast({
      title: title,
      description: error,
      status: status,
      duration: 5000,
      isClosable: true,
    })
  }

  const previousAction = () => {
    setPage(page <= 1 ? 1 : page-1)
    setDisableNext(false)
  }

  const nextAction = () => {
    setPage(page >= totalPage ? totalPage : page + 1)
    setDisablePrevious(false)
  }

  const updateBalance = (balance) => {
    const data = new FormData()
    data.append('balance', balance)
    Axios.put('http://localhost:4000/v1/balance/', data, {
      headers: {
        'Content-Type': "multipart/form-data"
      }
    })
    .then((result) => {
      console.log(result)
    })  
    .catch((error) => {
      showToast("Wrong Input", "You can't retrieve money that is higher than canteen's balance or no connection to server", "error")
    })
  }

  const withdrawMoney = (money) => {
    if(money !== "" && money !== 0){
      if(parseInt(money) <= parseInt(balance)){
        tempMoney = parseInt(balance)-parseInt(money)
        setBalance(tempMoney)
        updateBalance(tempMoney)
        showToast("Money Withdrawed.", "Your money has been withdrawed from the canteen's balance", "success")
      }else{
        showToast("Wrong Input.", "You can't retrieve money that is higher than canteen's balance", "error")
      }
    }else{
      showToast("Wrong Input.", "Your input has to be a number and higher than 0!", "error")
    }
  }
  
  const addMoney = (money) => {
    if(money !== "" && money !== 0){
      tempMoney = parseInt(balance) + parseInt(money)
      setBalance(tempMoney)
      updateBalance(tempMoney)
      showToast("Money Added.", "Your money has been added to the canteen's balance", "success")
    }else{
      showToast("Wrong Input.", "Your input has to be a number and higher than 0!", "error")
    }
  }

  useEffect(() => {
    setStatusAuthenticated(localStorage.getItem("isAuthenticated") || "false")
  }, [statusAuthenticated, auth.isAuthenticated]);

  useEffect(() => {
    Axios.get(`http://localhost:4000/v1/balance/`)
    .then((result) => {
      const response = result.data
      const data = response.data
      setBalance(data[0].balance)
    })
  }, [])

  useEffect(() => {
    if(page === 1){
      setDisablePrevious(true)
    }else{
      setDisablePrevious(false)
    }

    if(page === totalPage){
      setDisableNext(true)
    }else{
      setDisableNext(false)
    }

    Axios.get(`http://localhost:4000/v1/product/posts?page=${page}&perPage=100000`)
    .then((result) => {
      const response = result.data
      setTotalPage(Math.ceil(response.total_data/response.per_page))
      setTotalData(response.total_data)
      const data = response.data
      const dataReversed = data.map(item => item).reverse()
      dispatch(setDataProduct(data))
      setReverseProduct(dataReversed)
    })

    .catch((error) => {
        console.log("error", error)
      })

  }, [page, totalPage, status, dispatch])

  const handleBuyItem = (id) => {
    Axios.delete(`http://localhost:4000/v1/product/post/${id}`)
    .then((res) => {
      setStatus(!status)
      showToast("Product Bought.", "You have bought the product, Cheers!", "success")
    })
    .catch((err) => {
      showToast("Failed to Buy.", "We failed to buy your product choice, Sorry!", "error")
      console.log("error", err)
    })
  }

  const handleSelectChange = (e) => {
    setAscending(e.target.value)
  }
  
  return (
    <div className = "mt-24 flex items-center flex-col">
      <h1 className = "text-5xl font-bold text-white text-center"> Canteen Kejujuran </h1>
      {statusAuthenticated === "true" && <div className = "flex flex-col bg-gray-800 px-12 py-4 mt-8 mx-4 rounded-2xl hover:scale-95 hover:opacity-100 opacity-80 duration-500">
        <h1 className = "text-2xl font-bold text-white my-4"> Canteen Balance: Rp {balance},00 </h1>
        <>
        <Button className = "w-full mb-4"
                  rightIcon={<ViewIcon />} 
                  color = 'white' 
                  borderColor='#22c55e' 
                  bg = "#22c55e" 
                  variant='solid' 
                  borderRadius='6px' 
                  _hover={{ boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75)' }} 
                  _active={{bg: '#22c55e', transform: 'scale(1.03)', borderColor: '#bec3c9',}}
                  onClick = {onOpen}
                  disabled = {statusAuthenticated === "true" ? false : true}
        > View Balance Options! </Button>
        <ModalView withdrawMoney = {withdrawMoney} addMoney = {addMoney} isOpen = {isOpen} onClose = {onClose}/>
        </>
      </div>}
      <div className='text-right mt-8'>
        <Select defaultValue = "sort" onChange = {handleSelectChange} bg = "#22c55e" borderColor= "#22c55e" borderRadius="10px"
            className = "max-w-xs text-black font-bold text-center">
            <option disabled value = "sort"> Sort (Default: Ascending) </option> 
            <option className = "text-black" value= "ascend"> Ascending </option>
            <option className = "text-black" value= "descend"> Descending </option>
        </Select>
      </div>
      {totalData >= 1 && ascending === "ascend" && <div className="wrapper max-w-screen-xl w-full justify-center grid mx-12 my-12">
        {products.map(product => {
            return <Product name = {product.name} price = {product.price} desc = {product.desc} 
              image = {`http://localhost:4000/${product.image}`} key = {product._id} id = {product._id} time = {product.createdAt}
              handleBuyItem = {() => handleBuyItem(product._id)} disabled = {statusAuthenticated === "true" ? false : true}/>
        })}
      </div>}
        
      {totalData >= 1 && ascending === "descend" && <div className="wrapper max-w-screen-xl w-full justify-center grid mx-12 my-12">
        {reverseProduct.map(product => {
            return <Product name = {product.name} price = {product.price} desc = {product.desc} 
              image = {`http://localhost:4000/${product.image}`} key = {product._id} id = {product._id} time = {product.createdAt}
              handleBuyItem = {() => handleBuyItem(product._id)} disabled = {statusAuthenticated === "true" ? false : true}/>
        })}
      </div>}

      {totalData >= 1 && <div className = "flex justify-center items-center gap-4 mb-12">
          <Button 
            leftIcon={<ArrowBackIcon />}  
            _hover={{ boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75)' }} 
            color = '#22c55e' 
            borderColor='#22c55e' 
            variant='outline' 
            borderRadius='6px' 
            _active={{bg: 'none', transform: 'scale(1.03)', borderColor: '#bec3c9',}}
            onClick = {previousAction}
            disabled = {disablePrevious}
          >
            Sebelumnya
          </Button> 

          <p className = "text-white font-bold"> {page} / {totalPage} </p>

          <Button 
            rightIcon={<ArrowForwardIcon />} 
            color = 'white' 
            borderColor='#22c55e' 
            bg = "#22c55e" 
            variant='solid' 
            borderRadius='6px' 
            _hover={{ boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75)' }} 
            _active={{bg: '#22c55e', transform: 'scale(1.03)', borderColor: '#bec3c9',}}
            onClick = {nextAction}
            disabled = {disableNext}
          >
            Selanjutnya
          </Button>
      </div>}
      {totalData === 0 &&
          <div className = "flex flex-col">
            <h1 className = "text-3xl my-16 font-bold text-white"> Nothing to show here </h1>
            <Link to="/add">
              <Button className = "w-full"
                  rightIcon={<AddIcon />} 
                  color = 'white' 
                  borderColor='#22c55e' 
                  bg = "#22c55e" 
                  variant='solid' 
                  borderRadius='6px' 
                  _hover={{ boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75)' }} 
                  _active={{bg: '#22c55e', transform: 'scale(1.03)', borderColor: '#bec3c9',}}
                  disabled = {statusAuthenticated === "true" ? false : true}
                > Add Products! </Button>
              </Link>
          </div>
        }
    </div>
  )
}

export default Home