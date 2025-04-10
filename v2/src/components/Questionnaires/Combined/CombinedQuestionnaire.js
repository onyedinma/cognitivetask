import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ACEIQQuestionnaire from '../ACEIQ/ACEIQQuestionnaire';
import SESQuestionnaire from '../SES/SESQuestionnaire';
import MFQQuestionnaire from '../MFQ/MFQQuestionnaire';
import './Combined.css';

const CombinedQuestionnaire = () => {
  const navigate = useNavigate();
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState('ACEIQ');
  const [aceiqCompleted, setAceiqCompleted] = useState(false);
  const [sesCompleted, setSesCompleted] = useState(false);
  const [mfqCompleted, setMfqCompleted] = useState(false);
  const [questionnairesCompleted, setQuestionnairesCompleted] = useState(false);
  const [aceiqResults, setAceiqResults] = useState(null);
  const [sesResults, setSesResults] = useState(null);
  const [mfqResults, setMfqResults] = useState(null);

  // Handle completion of ACEIQ questionnaire
  const handleAceiqComplete = (results) => {
    // If user clicked "Continue" after seeing score summary
    if (!results) {
      // Mark this questionnaire as completed and move to the next one
      setAceiqCompleted(true);
      setCurrentQuestionnaire('SES');
    } else {
      // Store the results with scores
      setAceiqResults(results);
      setAceiqCompleted(true);
      
      // Show results screen with continue button
    }
  };
  
  // Handle completion of SES questionnaire
  const handleSesComplete = (results) => {
    // If user clicked "Continue" after seeing score summary
    if (!results) {
      // Mark this questionnaire as completed and move to MFQ
      setSesCompleted(true);
      setCurrentQuestionnaire('MFQ');
    } else {
      // Store the results with scores
      setSesResults(results);
      setSesCompleted(true);
      
      // Show results screen with continue button
    }
  };

  // Handle completion of MFQ questionnaire
  const handleMfqComplete = (results) => {
    // If user clicked "Continue" after seeing score summary
    if (!results) {
      // Mark this questionnaire as completed and move to completion
      setMfqCompleted(true);
      setQuestionnairesCompleted(true);
    } else {
      // Store the results with scores
      setMfqResults(results);
      setMfqCompleted(true);
      
      // Show results screen with continue button
    }
  };

  // Render the appropriate questionnaire
  const renderQuestionnaire = () => {
    if (!questionnairesCompleted) {
      // ACEIQ questionnaire flow
      if (currentQuestionnaire === 'ACEIQ') {
        if (!aceiqCompleted) {
          return <ACEIQQuestionnaire onComplete={handleAceiqComplete} />;
        } else {
          // Show ACEIQ results with score before proceeding
          return (
            <div className="questionnaire-container">
              <h1 className="questionnaire-title">ACE-IQ Results</h1>
              
              {aceiqResults && (
                <div className="score-summary">
                  <h2>Questionnaire Score Summary</h2>
                  <p className="total-score">Total Score: <span>{aceiqResults.totalScore}</span></p>
                  <p className="score-explanation">
                    Higher scores indicate more adverse childhood experiences.
                  </p>
                </div>
              )}
              
              <button 
                className="form-button" 
                onClick={() => setCurrentQuestionnaire('SES')}
              >
                Continue to Next Questionnaire
              </button>
            </div>
          );
        }
      }
      
      // SES questionnaire flow
      if (currentQuestionnaire === 'SES') {
        if (!sesCompleted) {
          return <SESQuestionnaire onComplete={handleSesComplete} />;
        } else {
          // Show SES results with score before proceeding
          return (
            <div className="questionnaire-container">
              <h1 className="questionnaire-title">Socioeconomic Status Results</h1>
              
              {sesResults && (
                <div className="score-summary">
                  <h2>Questionnaire Score Summary</h2>
                  <p className="total-score">Total Score: <span>{sesResults.totalScore}</span> out of 35</p>
                  <p className="score-explanation">
                    Higher scores indicate a higher socioeconomic status during childhood.
                  </p>
                </div>
              )}
              
              <button 
                className="form-button" 
                onClick={() => setCurrentQuestionnaire('MFQ')}
              >
                Continue to Next Questionnaire
              </button>
            </div>
          );
        }
      }

      // MFQ questionnaire flow
      if (currentQuestionnaire === 'MFQ') {
        if (!mfqCompleted) {
          return <MFQQuestionnaire onComplete={handleMfqComplete} />;
        } else {
          // Show MFQ results with score before proceeding
          return (
            <div className="questionnaire-container">
              <h1 className="questionnaire-title">Mood and Feelings Results</h1>
              
              {mfqResults && (
                <div className="score-summary">
                  <h2>Questionnaire Score Summary</h2>
                  <p className="total-score">Total Score: <span>{mfqResults.totalScore}</span> out of 26</p>
                  <p className="score-explanation">
                    {mfqResults.interpretation}
                  </p>
                </div>
              )}
              
              <button 
                className="form-button" 
                onClick={() => setQuestionnairesCompleted(true)}
              >
                Finish All Questionnaires
              </button>
            </div>
          );
        }
      }
    }
    
    // All questionnaires completed
    return (
      <div className="questionnaire-container">
        <h1 className="questionnaire-title">Questionnaires Completed</h1>
        <p>Thank you for completing all questionnaires.</p>
        
        <div className="all-scores-summary">
          <h2>Summary of All Questionnaires</h2>
          
          {aceiqResults && (
            <div className="score-item">
              <h3>ACE-IQ Score:</h3>
              <p>{aceiqResults.totalScore}</p>
            </div>
          )}
          
          {sesResults && (
            <div className="score-item">
              <h3>Socioeconomic Status Score:</h3>
              <p>{sesResults.totalScore} out of 35</p>
            </div>
          )}

          {mfqResults && (
            <div className="score-item">
              <h3>Mood and Feelings Score:</h3>
              <p>{mfqResults.totalScore} out of 26</p>
              <p className="interpretation-text">{mfqResults.interpretation}</p>
            </div>
          )}
        </div>
        
        <button 
          className="form-button" 
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    );
  };

  return (
    <div className="task-screen">
      {renderQuestionnaire()}
    </div>
  );
};

export default CombinedQuestionnaire; 