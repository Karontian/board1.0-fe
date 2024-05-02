import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


import MainBoard from "./components/mainBoard";
import NotFound from './components/notFound';
import BoardAdmin from './components/boardAdmin';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/admin' element={<BoardAdmin/>}/>
        <Route path='/' element={<MainBoard/>}/>
        <Route path='*' element={<NotFound/>}/>

      </Routes>
    </Router>
  );
}

export default App;
