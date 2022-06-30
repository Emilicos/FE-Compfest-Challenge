import { legacy_createStore as createStore} from 'redux'

const initialState = {
    products: [],
}

const reducer = (state = initialState, action) => {
    if(action.type === "UPDATE_PRODUCT"){
        return{
            ...state,
            products: action.payload,
        }
    }
    if(action.type === "ADD_PRICE"){
        return{
            ...state,
            price: action.payload
        }
    }

    return state
}

const store = createStore(reducer)

export default store