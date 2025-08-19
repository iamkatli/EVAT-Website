import React from 'react';
import FeedbackForm from '../components/FeedbackForm';
import NavBar from '../components/NavBar';

function Feedback() {
  return (
    <div className="feedback-page">
      <NavBar />
      <FeedbackForm />
    </div>
  );
}

export default Feedback;
