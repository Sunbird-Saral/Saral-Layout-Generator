import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './components/HomePage';
import StudentQuestionTable from './components/question_table/StudentQuestionTable';
import PersonDetailsForm from './components/personal_details/PersonalDetailsForm';
import RectangleDiv from './components/bigcomponent/RectangleDiv';
import FormBuilderRoiGen from './components/opecv/formBuilderRoiGen';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/attendance" element={<StudentQuestionTable />} />
        <Route path="/personal" element={<PersonDetailsForm />} />
        <Route path="/main" element={<RectangleDiv />} />
        <Route path="/designFormRoiGen" element={<FormBuilderRoiGen />} />
      </Routes>
    </Router>
  );
};

export default App;
