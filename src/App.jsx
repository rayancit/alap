import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Singup from "./pages/Singup"
import 'react-toastify/dist/ReactToastify.css';
import Signin from "./pages/Signin";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import Message from "./pages/Message";
import RootLayout from "./components/layouts/RootLayout";


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/message" element={<Message />} />
      </Route>
      <Route path="/singup" element={<Singup />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
    </Route>
  ))
  return (
    <RouterProvider router={router} />
  )
}

export default App
