import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {Main} from './pages/Main'
import {Login} from './pages/Login'
import {Editor} from './pages/Editor'

export default function App() {
  return (
    <NextUIProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="/" element={<Main />} />
          <Route path="login" element={<Login />} />
          {/* <Route path="register" element={<Register />} /> */}
          <Route path="editor" element={<Editor />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </NextUIProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
