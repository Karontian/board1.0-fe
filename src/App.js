import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import MainBoard from "./components/mainBoard";
import NotFound from './components/notFound';
import BoardAdmin from './components/boardAdmin';
import Login from './components/login';

console.log('HELLO FROM INDEX.JS')


function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              {/* <Route path="/mainBoard" element={<PrivateRoute element={<MainBoard />} />} />
              <Route path="/admin" element={<PrivateRoute element={<BoardAdmin />} />} /> */}
              <Route path='/admin' element={<BoardAdmin/>}/>
              <Route path='/mainBoard' element={<MainBoard/>}/>
              <Route path="*" element={<NotFound />} />
          </Routes>
      </Router>
);
}

export default App;
