import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';

import StudentQuestionTable from './components/question_table/StudentQuestionTable';
import PersonDetailsForm from './components/personal_details/PersonalDetailsForm'
const App = () => {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<PersonDetailsForm/>} />
      <Route exact path="/home" element={<StudentQuestionTable/>} />

      </Routes>
       
    {/* Add more routes for other pages */}
  </Router>
  );
};

export default App;
