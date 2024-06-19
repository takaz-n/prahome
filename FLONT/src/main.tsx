import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from './components/FrmMain';
import Sub from './components/FrmSub';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/'element={<Main/>}/>
        <Route path="/sub"element={<Sub/>}/>
      </Routes>
    </Router>
  </React.StrictMode>
);
