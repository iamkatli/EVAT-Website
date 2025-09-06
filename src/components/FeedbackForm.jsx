import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import FormInput from './FormInput';
import { submitFeedback } from '../services/feedbackService';
import '../styles/FeedbackForm.css';

function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    suggestion: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const response = await submitFeedback(formData);
      console.log('Feedback submitted successfully:', response);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', suggestion: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-overlay">
        <form className="feedback-form" onSubmit={handleSubmit}>
          <h2 className="feedback-title">FEEDBACK FORM</h2>
          
          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="status-message success-message">
              <CheckCircle size={20} />
              <span>Thank you for your feedback! We'll review it and get back to you if needed.</span>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="status-message error-message">
              <AlertCircle size={20} />
              <span>{errorMessage}</span>
            </div>
          )}
          
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

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="spinning" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;
