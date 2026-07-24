import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateEmployee from './pages/CreateEmployee';
import EmployeeHistory from './pages/EmployeeHistory';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<CreateEmployee />} />
            <Route path="/edit/:id" element={<CreateEmployee />} />
            <Route path="/history" element={<EmployeeHistory />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
