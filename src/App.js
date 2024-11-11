import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardDoctor from './pages/DashboardDoctor';
import DashboardPatient from './pages/DashboardPatient';
import ListDoctor from './pages/ListDoctor';
import AddDoctor from './pages/AddDoctor';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React from "react";

function App() {
  return (
    <Router>
            <Routes>
                <Route path='/' element={<LandingPage/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/register' element={<RegisterPage/>}/>
                <Route path='/dashboardadmin' element={<DashboardAdmin/>}/>
                <Route path='/dashboarddoctor' element={<DashboardDoctor/>}/>
                <Route path='/dashboardpatient' element={<DashboardPatient/>}/>
                <Route path='/listdoctors' element={<ListDoctor/>}/>
                <Route path='/add-doctor' element={<AddDoctor/>}/>
            </Routes>
        </Router>
  );
}

export default App;
