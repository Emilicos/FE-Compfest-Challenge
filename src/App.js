import Header from "./components/Header";
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Register from "./components/Register";
import Home from "./components/Home";
import Login from "./components/Login";
import Add from "./components/Add";
import { Provider } from "react-redux";
import store from "./redux/store";
import AuthWrapper from "./context/GlobalAuthContext";

function App() {
  return (
    <AuthWrapper>
      <Provider store = {store}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path = "/" element = {<Home />}/>
            <Route path = "/add" element = {<Add />}/>
            <Route path = "/register" element = {<Register />}/>
            <Route path = "/login" element = {<Login />}/>
          </Routes>
        </BrowserRouter>
      </Provider>
    </AuthWrapper>
  );
}

export default App;
