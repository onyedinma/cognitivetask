import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MFQ.css';

/**
 * Mood and Feelings Questionnaire (MFQ - Short, Child Self-Report)
 */
const MFQQuestionnaire = ({ onComplete }) => {
  const navigate = useNavigate();
  
  // State for form submission
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [interpretationText, setInterpretationText] = useState('');
  const [interpretationLevel, setInterpretationLevel] = useState('');
  const [exportingCSV, setExportingCSV] = useState(false);
  
  // MFQ questions
  const questions = [
    { id: 'q1', text: 'I felt miserable or unhappy.' },
    { id: 'q2', text: 'I didn\'t enjoy anything at all.' },
    { id: 'q3', text: 'I felt so tired I just sat around and did nothing.' },
    { id: 'q4', text: 'I was very restless.' },
    { id: 'q5', text: 'I felt I was no good anymore.' },
    { id: 'q6', text: 'I cried a lot.' },
    { id: 'q7', text: 'I found it hard to think properly or concentrate.' },
    { id: 'q8', text: 'I hated myself.' },
    { id: 'q9', text: 'I was a bad person.' },
    { id: 'q10', text: 'I felt lonely.' },
    { id: 'q11', text: 'I thought nobody really loved me.' },
    { id: 'q12', text: 'I thought I could never be as good as other kids.' },
    { id: 'q13', text: 'I did everything wrong.' }
  ];
  
  // Response options
  const responseOptions = [
    { value: '0', label: 'NOT TRUE', description: 'This was not true about you' },
    { value: '1', label: 'SOMETIMES', description: 'This was sometimes true about you' },
    { value: '2', label: 'TRUE', description: 'This was true about you most of the time' }
  ];
  
  // State for form data (initialize with empty responses)
  const [formData, setFormData] = useState(
    questions.reduce((acc, question) => {
      acc[question.id] = '';
      return acc;
    }, {})
  );
  
  // Auto-save to localStorage when form data changes
  useEffect(() => {
    localStorage.setItem('mfqQuestionnaireData', JSON.stringify(formData));
  }, [formData]);
  
  // Load saved data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('mfqQuestionnaireData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);
  
  // Check if all questions are answered and calculate score
  useEffect(() => {
    const allAnswered = Object.values(formData).every(value => value !== '');
    setAllQuestionsAnswered(allAnswered);
    setValidationError(false); // Reset validation error when form changes
    
    // Calculate total score
    if (allAnswered) {
      const score = Object.values(formData).reduce(
        (sum, value) => sum + parseInt(value), 0
      );
      
      setTotalScore(score);
      
      // Set interpretation text based on score
      if (score <= 5) {
        setInterpretationText('Likely no depression');
        setInterpretationLevel('low');
      } else if (score <= 12) {
        setInterpretationText('Mild to moderate depression');
        setInterpretationLevel('moderate');
      } else {
        setInterpretationText('Possible clinical depression (flag for review)');
        setInterpretationLevel('high');
      }
    }
  }, [formData]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Reusable question component for each item
  const QuestionItem = ({ question, value, onChange }) => {
    return (
      <div className="mfq-question-item">
        <div className="question-text">
          {question.text}
        </div>
        <div className="response-options">
          {responseOptions.map(option => (
            <div key={option.value} className="response-option">
              <input
                type="radio"
                id={`${question.id}-${option.value}`}
                name={question.id}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                aria-label={`${option.label} - ${option.description}`}
              />
              <label htmlFor={`${question.id}-${option.value}`}>
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
    
    // Save form data
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    const results = {
      studentId,
      timestamp,
      data: formData,
      totalScore,
      interpretation: interpretationText
    };
    
    // Log results
    console.log('MFQ Questionnaire Results:', results);
    
    // Save to localStorage
    const storedResults = JSON.parse(localStorage.getItem('mfqResults') || '[]');
    localStorage.setItem('mfqResults', JSON.stringify([...storedResults, results]));
    
    // Automatically export to CSV
    exportToCSV();
    
    setFormSubmitted(true);
    
    // If onComplete callback is provided, use it
    if (onComplete) {
      onComplete(results);
    }
  };
  
  // Export results as JSON
  const exportResults = () => {
    const dataStr = JSON.stringify({
      formData,
      totalScore,
      interpretation: interpretationText,
      timestamp: new Date().toISOString()
    }, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `mfq_results_${new Date().toISOString().slice(0, 10)}.json`;
    
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
      let csvContent = 'StudentID,Timestamp,QuestionID,QuestionText,Response,ResponseValue,Score\n';
      
      // Add row for each question with score
      questions.forEach(question => {
        const response = formData[question.id];
        const responseLabel = responseOptions.find(option => option.value === response)?.label || '';
        
        csvContent += [
          studentId,
          timestamp,
          question.id,
          `"${question.text.replace(/"/g, '""')}"`, // Escape any quotes in question text
          `"${responseLabel}"`,
          response,
          response
        ].join(',') + '\n';
      });
      
      // Add total score row
      csvContent += [
        studentId,
        timestamp,
        'TOTAL',
        '"MFQ Total Score"',
        `"${interpretationText}"`,
        '',
        totalScore
      ].join(',') + '\n';
      
      // Create downloadable link
      const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `mfq_results_${studentId}_${new Date().toISOString().slice(0, 10)}.csv`);
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
          <h1 className="questionnaire-title">Mood and Feelings Questionnaire</h1>
          <h2 className="questionnaire-subtitle">Short Version - Child Self-Report</h2>
          
          <div className="questionnaire-instructions">
            <p>This form is about how you might have been feeling or acting recently.</p>
            <p>Please check how you have been feeling or acting <strong>in the past two weeks</strong>.</p>
            <ul>
              <li>If a sentence was <strong>not true</strong> about you, check <strong>NOT TRUE</strong>.</li>
              <li>If a sentence was <strong>only sometimes true</strong>, check <strong>SOMETIMES</strong>.</li>
              <li>If a sentence was <strong>true</strong> about you most of the time, check <strong>TRUE</strong>.</li>
            </ul>
          </div>
          
          {validationError && (
            <div className="validation-error">
              Please answer all questions before submitting.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mfq-form">
            <div className="response-header">
              <div className="response-label">NOT TRUE</div>
              <div className="response-label">SOMETIMES</div>
              <div className="response-label">TRUE</div>
            </div>
            
            {questions.map(question => (
              <QuestionItem
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
          
          <div className={`score-summary score-${interpretationLevel}`}>
            <h2>MFQ Score Summary</h2>
            <div className="score-display">
              <div className="score-value">{totalScore}</div>
              <div className="score-max">out of 26</div>
            </div>
            
            <div className="interpretation">
              <h3>Interpretation:</h3>
              <p className="interpretation-text">{interpretationText}</p>
              
              <div className="score-scale">
                <div className="score-range low">
                  <span className="range-label">0-5</span>
                  <span className="range-description">Likely no depression</span>
                </div>
                <div className="score-range moderate">
                  <span className="range-label">6-12</span>
                  <span className="range-description">Mild to moderate depression</span>
                </div>
                <div className="score-range high">
                  <span className="range-label">13+</span>
                  <span className="range-description">Possible clinical depression</span>
                </div>
              </div>
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

export default MFQQuestionnaire; 