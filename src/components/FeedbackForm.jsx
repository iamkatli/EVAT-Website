import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import FormInput from './FormInput';
import '../styles/FeedbackForm.css';

function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    suggestion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to send the feedback to your backend
    console.log('Feedback submitted:', formData);
    alert('Thank you for your feedback!');
    setFormData({ name: '', email: '', suggestion: '' });
  };

  return (
    <div className="feedback-container">
      <div className="feedback-overlay">
        <form className="feedback-form" onSubmit={handleSubmit}>
          <h2 className="feedback-title">FEEDBACK FORM</h2>
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <FormInput
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <div className="email-input-container">
              <Mail className="email-icon" size={16} />
              <FormInput
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="suggestion">Suggestion</label>
            <textarea
              name="suggestion"
              value={formData.suggestion}
              onChange={handleChange}
              placeholder="Enter your suggestion or feedback"
              className="suggestion-input"
              rows="4"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;
