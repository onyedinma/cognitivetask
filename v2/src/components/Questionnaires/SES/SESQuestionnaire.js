import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SES.css';

/**
 * Index of Socioeconomic Status Questionnaire
 */
const SESQuestionnaire = ({ onComplete }) => {
  const navigate = useNavigate();
  
  // State for form submission
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [exportingCSV, setExportingCSV] = useState(false);
  
  // State for form data
  const [formData, setFormData] = useState({
    moneyForHome: '',
    moneyForClothing: '',
    moneyForFood: '',
    moneyForMedicalCare: '',
    feltRichComparedToSchool: '',
    feltRichComparedToNeighborhood: '',
    struggledFinancially: ''
  });
  
  // Questions for the Likert scale
  const questions = [
    {
      id: 'moneyForHome',
      text: 'When growing up, your family had enough money to afford the kind of home you all needed'
    },
    {
      id: 'moneyForClothing',
      text: 'When growing up, your family had enough money to afford the kind of clothing you all needed'
    },
    {
      id: 'moneyForFood',
      text: 'When growing up, your family had enough money to afford the kind of food that you all needed'
    },
    {
      id: 'moneyForMedicalCare',
      text: 'When growing up, your family had enough money to afford the kind of medical care that you all needed'
    },
    {
      id: 'feltRichComparedToSchool',
      text: 'When growing up, I felt well-off (rich, wealthy) compared to other kids in my school'
    },
    {
      id: 'feltRichComparedToNeighborhood',
      text: 'When growing up, I felt well-off (rich, wealthy) compared to other kids in my neighborhood'
    },
    {
      id: 'struggledFinancially',
      text: 'When growing up, your family struggled to make ends meet (get by financially)',
      isReversed: true
    }
  ];
  
  // Likert scale options
  const likertOptions = [
    { value: '1', label: 'Never True' },
    { value: '2', label: 'Rarely True' },
    { value: '3', label: 'Sometimes True' },
    { value: '4', label: 'Often True' },
    { value: '5', label: 'Very Often True' }
  ];
  
  // Auto-save to localStorage when form data changes
  useEffect(() => {
    localStorage.setItem('sesQuestionnaireData', JSON.stringify(formData));
  }, [formData]);
  
  // Load saved data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('sesQuestionnaireData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);
  
  // Check if all questions are answered
  useEffect(() => {
    const allAnswered = Object.values(formData).every(value => value !== '');
    setAllQuestionsAnswered(allAnswered);
    setValidationError(false); // Reset validation error when form changes
    
    // Calculate total score
    if (allAnswered) {
      let score = 0;
      
      // Process all items (positive and negative)
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'struggledFinancially') {
          // Regular scoring for positive items (higher = better SES)
          score += parseInt(value);
        } else {
          // Reverse scoring for negative items (lower values should contribute higher scores)
          // For a 5-point scale: 5->1, 4->2, 3->3, 2->4, 1->5
          score += (6 - parseInt(value));
        }
      });
      
      setTotalScore(score);
    }
  }, [formData]);
  
  // Calculate the score for a specific question (with reverse scoring applied if needed)
  const getQuestionScore = (questionId, value) => {
    const isReversed = questionId === 'struggledFinancially';
    if (isReversed) {
      // Apply reverse scoring
      return 6 - parseInt(value);
    } else {
      return parseInt(value);
    }
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Reusable Likert question component
  const LikertQuestion = ({ question, value, onChange }) => {
    return (
      <div className="likert-question">
        <div className="question-text">{question.text}</div>
        <div className="likert-options">
          {likertOptions.map(option => (
            <div key={option.value} className="likert-option">
              <input
                type="radio"
                id={`${question.id}-${option.value}`}
                name={question.id}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
              />
              <label htmlFor={`${question.id}-${option.value}`}>
                <div className="option-value">{option.value}</div>
                <div className="option-label">{option.label}</div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    if (!allQuestionsAnswered) {
      setValidationError(true);
      window.scrollTo(0, 0); // Scroll to top to show error
      return;
    }
    
    // Save form data (for example, to localStorage)
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    const results = {
      studentId,
      timestamp,
      data: formData,
      totalScore
    };
    
    // Log results for now (in a real app, would save to database)
    console.log('SES Questionnaire Results:', results);
    
    // Save to localStorage
    const storedResults = JSON.parse(localStorage.getItem('sesResults') || '[]');
    localStorage.setItem('sesResults', JSON.stringify([...storedResults, results]));
    
    // Automatically export to CSV
    exportToCSV();
    
    setFormSubmitted(true);
    
    // If onComplete callback is provided, use it, otherwise use default behavior
    if (onComplete) {
      onComplete(results);
    }
  };
  
  // Export results as JSON
  const exportResults = () => {
    const dataStr = JSON.stringify({
      formData,
      totalScore,
      timestamp: new Date().toISOString()
    }, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `ses_results_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Export results as CSV
  const exportToCSV = () => {
    setExportingCSV(true);
    
    try {
      // Get participant ID and timestamp
      const studentId = localStorage.getItem('studentId') || 'unknown';
      const timestamp = new Date().toISOString();
      
      // Create CSV header row
      let csvContent = 'StudentID,Timestamp,QuestionID,QuestionText,Response,ResponseValue,IsReversed,Score\n';
      
      // Add row for each question with score
      questions.forEach(question => {
        const response = formData[question.id];
        const responseLabel = likertOptions.find(option => option.value === response)?.label || '';
        const isReversed = question.isReversed || question.id === 'struggledFinancially';
        const score = getQuestionScore(question.id, response);
        
        csvContent += [
          studentId,
          timestamp,
          question.id,
          `"${question.text.replace(/"/g, '""')}"`, // Escape any quotes in question text
          `"${responseLabel}"`,
          response,
          isReversed ? 'Yes' : 'No',
          score
        ].join(',') + '\n';
      });
      
      // Add total score row
      csvContent += [
        studentId,
        timestamp,
        'TOTAL',
        '"SES Total Score"',
        '',
        '',
        '',
        totalScore
      ].join(',') + '\n';
      
      // Create downloadable link
      const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `ses_results_${studentId}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      
      // Download file
      link.click();
      document.body.removeChild(link);
      setExportingCSV(false);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setExportingCSV(false);
    }
  };
  
  // Return to main menu
  const returnToMenu = () => {
    if (onComplete) {
      onComplete(null);
    } else {
      navigate('/');
    }
  };
  
  // Render the form
  return (
    <div className="task-screen">
      {!formSubmitted ? (
        <div className="questionnaire-container">
          <h1 className="questionnaire-title">Socioeconomic Status Questionnaire</h1>
          
          <div className="questionnaire-instructions">
            <p>Please indicate how true the following statements are about your childhood.</p>
            <p>Choose from 1 (Never True) to 5 (Very Often True).</p>
          </div>
          
          {validationError && (
            <div className="validation-error">
              Please answer all questions before submitting.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="ses-form">
            {questions.map(question => (
              <LikertQuestion
                key={question.id}
                question={question}
                value={formData[question.id]}
                onChange={handleChange}
              />
            ))}
            
            <div className="form-actions">
              <button
                type="submit"
                className="form-button submit"
                disabled={!allQuestionsAnswered}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="questionnaire-container">
          <h1 className="questionnaire-title">Results</h1>
          <p>Your responses have been recorded.</p>
          
          <div className="score-summary">
            <h2>SES Score Summary</h2>
            <div className="score-display">
              <div className="score-value">{totalScore}</div>
              <div className="score-max">out of 35</div>
            </div>
            
            <div className="interpretation">
              <h3>Interpretation:</h3>
              <p className="interpretation-text">
                Higher scores indicate a higher socioeconomic status during childhood.
              </p>
            </div>
          </div>
          
          <div className="form-actions">
            <button
              className="form-button export"
              onClick={exportResults}
            >
              Export Results as JSON
            </button>
            
            <button
              className="form-button export"
              onClick={exportToCSV}
              disabled={exportingCSV}
            >
              {exportingCSV ? 'Exporting...' : 'Export Results as CSV'}
            </button>
            
            <button 
              className="form-button" 
              onClick={returnToMenu}
            >
              {onComplete ? "Continue to Next Questionnaire" : "Return to Home"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SESQuestionnaire; 