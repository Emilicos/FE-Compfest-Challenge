import React from 'react'
import { Button, } from '@chakra-ui/react'

const Product = (props) => {
  var timeHour = (parseInt(props.time.substring(11, 13)) + 7)
  var timeDay = parseInt(props.time.substring(8, 10))
  if(timeHour >= 24){
    timeHour -= 24
    timeDay += 1
    if(timeHour < 10){
        timeHour = "0" + timeHour.toString()
    }else{
        timeHour = timeHour.toString()
    }
    if(timeDay < 10){
      timeDay = "0" + timeDay.toString()
    }else{
      timeDay = timeDay.toString()
    }
  }else{
    if(timeHour < 10){
        timeHour = "0" + timeHour.toString()
        timeDay = "0" + timeDay.toString()
    }else{
        timeHour = timeHour.toString()
        timeDay = timeDay.toString()
    }

    if(timeDay < 10){
      timeDay = "0" + timeDay.toString()
    }else{
      timeDay = timeDay.toString()
    }
  }

  const createdTimeStamp = props.time.substring(0, 8) + timeDay + " at "+ timeHour + props.time.substring(13, 16) + props.time.substring(16, 19) + " WIB "
  
  return (
      <div className="form overflow-hidden flex rounded-md flex-col justify-between cursor-pointer ease-in duration-200 transform text-white hover:scale-105 card">
        <div className="body text-center">
          <img src={props.image} className ="block h-96 w-full object-cover object-center" alt = "product"/>
          <p className = "text-green-400 text-xs mt-4 mx-4 font-bold"> {createdTimeStamp} </p>
          <h2 className="pt-2 pb-4 px-4 text-2xl font-bold capitalize">{props.name}</h2>
          <p className="px-4 text-xs text-stone-400">{props.desc}</p>
          <p className = "p-4 text-rose-300 font-bold text-left"> Rp {props.price},00 </p>
        </div>
        <Button className="p-4 font-bold text-[#e1e1e1] mx-4 mt-4 mb-8 border-[#e1e1e1] border-2 bg-transparent rounded-md btn"
          color = '#e1e1e1' 
          borderColor='#e1e1e1' 
          bg = "transparent" 
          variant='outline' 
          fontWeight='bold'
          borderRadius='6px' 
          _hover={{ boxShadow: '0 0 2px 2px #e1e1e1' }} 
          _active={{bg: '#22c55e', transform: 'scale(1.03)',}}
          onClick = {props.handleBuyItem}
          > 
          Buy Item 
        </Button>
      </div>
  )
}

export default Product