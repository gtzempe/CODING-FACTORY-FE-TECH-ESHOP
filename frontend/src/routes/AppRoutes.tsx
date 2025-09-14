import {Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login.tsx";
import {Cart} from "../pages/Cart.tsx";
import Register from "@/pages/Register.tsx";
import ProductList from "../pages/ProductList";
import Product from "@/pages/Product.tsx";
import Account from "@/pages/Account.tsx";
import OrderCompleted from "@/pages/OrderCompleted.tsx";
import ThanksPage from "@/pages/ThanksPage.tsx";

export const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/account" element={<Account/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/products" element={<ProductList/>}/>
        <Route path="/product/:id" element={<Product/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/order-completed" element={<OrderCompleted/>}/>
        <Route path="/thanks" element={<ThanksPage/>}/>
      </Routes>
  );
};