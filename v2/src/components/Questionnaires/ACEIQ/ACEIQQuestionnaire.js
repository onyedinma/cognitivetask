import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ACEIQ.css';
import { 
  NeglectSection, 
  FamilyEnvironmentSection,
  DirectAbuseSection,
  PeerViolenceSection,
  CommunityViolenceSection
} from './ACEIQSections';

/**
 * Adverse Childhood Experiences International Questionnaire (ACE-IQ)
 */
const ACEIQQuestionnaire = ({ onComplete }) => {
  const navigate = useNavigate();
  
  // State for form sections
  const [currentSection, setCurrentSection] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [scores, setScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [exportingCSV, setExportingCSV] = useState(false);
  
  // Scoring definitions
  const scoringValues = {
    frequency5: {
      "Always": 5,
      "Most of the time": 4,
      "Sometimes": 3,
      "Rarely": 2,
      "Never": 1,
      "Refused": -9
    },
    frequency4: {
      "Many times": 4,
      "A few times": 3,
      "Once": 2,
      "Never": 1,
      "Refused": -9
    },
    yesNo: {
      "Yes": 2,
      "No": 1,
      "Refused": -9
    }
  };
  
  // Group questions by scoring type
  const frequencyType5Questions = [
    'parentsUnderstandProblems',
    'parentsKnowFreeTime'
  ];
  
  const frequencyType4Questions = [
    'notEnoughFood',
    'parentsDrunkOrDrugs',
    'notSentToSchool',
    'witnessedVerbalAbuse',
    'witnessedPhysicalAbuse',
    'witnessedWeaponAbuse',
    'verbalAbuse',
    'threatenedAbandonment',
    'physicalAbuse',
    'weaponAbuse',
    'sexualTouching',
    'sexualFondling',
    'attemptedSexualIntercourse',
    'completedSexualIntercourse',
    'bullied',
    'physicalFight',
    'witnessedBeating',
    'witnessedStabbingOrShooting',
    'witnessedThreatenedWithWeapon'
  ];
  
  const yesNoQuestions = [
    'alcoholicHouseholdMember',
    'mentallyIllHouseholdMember',
    'imprisonedHouseholdMember',
    'parentsSeparated',
    'parentDied'
  ];
  
  // State for form data
  const [formData, setFormData] = useState({
    // Demographic information
    sex: '',
    birthDate: '',
    age: '',
    ethnicity: '',
    
    // Relationship with parents/guardians
    parentsUnderstandProblems: '',
    parentsKnowFreeTime: '',
    
    // Family environment and neglect
    notEnoughFood: '',
    parentsDrunkOrDrugs: '',
    notSentToSchool: '',
    
    // Household dysfunction
    alcoholicHouseholdMember: '',
    mentallyIllHouseholdMember: '',
    imprisonedHouseholdMember: '',
    parentsSeparated: '',
    parentDied: '',
    
    // Witnessing abuse
    witnessedVerbalAbuse: '',
    witnessedPhysicalAbuse: '',
    witnessedWeaponAbuse: '',
    
    // Direct abuse
    verbalAbuse: '',
    threatenedAbandonment: '',
    physicalAbuse: '',
    weaponAbuse: '',
    sexualTouching: '',
    sexualFondling: '',
    attemptedSexualIntercourse: '',
    completedSexualIntercourse: '',
    
    // Peer violence
    bullied: '',
    bullyingType: '',
    physicalFight: '',
    
    // Community violence
    witnessedBeating: '',
    witnessedStabbingOrShooting: '',
    witnessedThreatenedWithWeapon: ''
  });
  
  // Calculate scores when form data changes
  useEffect(() => {
    calculateScores();
  }, [formData]);
  
  // Calculate age from birth date
  useEffect(() => {
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prevData => ({
        ...prevData,
        age: age.toString()
      }));
    }
  }, [formData.birthDate]);
  
  // Calculate scores based on responses
  const calculateScores = () => {
    const newScores = {};
    let newTotalScore = 0;
    
    // Calculate scores for frequency type 5 questions (reversed since these are positive items)
    frequencyType5Questions.forEach(question => {
      if (formData[question] && formData[question] !== '') {
        // Get the original score
        const originalScore = scoringValues.frequency5[formData[question]];
        
        // Apply reverse scoring: 6 - original score (to convert 5->1, 4->2, 3->3, 2->4, 1->5)
        const reversedScore = (originalScore > 0) ? (6 - originalScore) : originalScore;
        
        newScores[question] = reversedScore;
        if (reversedScore > 0) newTotalScore += reversedScore;
      }
    });
    
    // Calculate scores for frequency type 4 questions
    frequencyType4Questions.forEach(question => {
      if (formData[question] && formData[question] !== '') {
        const score = scoringValues.frequency4[formData[question]];
        newScores[question] = score;
        if (score > 0) newTotalScore += score;
      }
    });
    
    // Calculate scores for yes/no questions
    yesNoQuestions.forEach(question => {
      if (formData[question] && formData[question] !== '') {
        const score = scoringValues.yesNo[formData[question]];
        newScores[question] = score;
        if (score > 0) newTotalScore += score;
      }
    });
    
    setScores(newScores);
    setTotalScore(newTotalScore);
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle navigation between sections
  const nextSection = () => {
    setCurrentSection(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const prevSection = () => {
    setCurrentSection(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate final scores before submission
    calculateScores();
    
    // Save form data (for example, to localStorage)
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    const results = {
      studentId,
      timestamp,
      data: formData,
      scores,
      totalScore
    };
    
    // Log results for now (in a real app, would save to database)
    console.log('ACE-IQ Questionnaire Results:', results);
    
    // Save to localStorage
    const storedResults = JSON.parse(localStorage.getItem('aceiqResults') || '[]');
    localStorage.setItem('aceiqResults', JSON.stringify([...storedResults, results]));
    
    // Automatically export to CSV
    exportToCSV();
    
    setFormSubmitted(true);
    
    // If onComplete callback is provided, use it, otherwise use default behavior
    if (onComplete) {
      onComplete(results);
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
  
  // Export results as CSV
  const exportToCSV = () => {
    setExportingCSV(true);
    
    try {
      // Get participant ID and timestamp
      const studentId = localStorage.getItem('studentId') || 'unknown';
      const timestamp = new Date().toISOString();
      
      // Create CSV header row
      let csvContent = 'StudentID,Timestamp,QuestionID,QuestionText,Response,ScoringType,IsReversed,OriginalScore,FinalScore\n';
      
      // Helper function to get question text
      const getQuestionText = (questionId) => {
        // Map question IDs to their text
        const questionTextMap = {
          'parentsUnderstandProblems': 'Did your parents/guardians understand your problems and worries?',
          'parentsKnowFreeTime': 'Did your parents/guardians really know what you were doing with your free time?',
          'notEnoughFood': 'Did you or your family not have enough food?',
          'parentsDrunkOrDrugs': 'Were your parents/guardians too drunk or intoxicated by drugs to take care of you?',
          'notSentToSchool': 'Were you not sent to school, or did you stop going to school?',
          'alcoholicHouseholdMember': 'Did you live with a household member who was a problem drinker, alcoholic, or misused street or prescription drugs?',
          'mentallyIllHouseholdMember': 'Did you live with a household member who was depressed, mentally ill, or suicidal?',
          'imprisonedHouseholdMember': 'Did you live with a household member who was ever sent to jail or prison?',
          'parentsSeparated': 'Were your parents ever separated or divorced?',
          'parentDied': 'Did your parent/guardian die?',
          'witnessedVerbalAbuse': 'Did you see or hear a parent or household member in your home being yelled at, screamed at, sworn at, insulted, or humiliated?',
          'witnessedPhysicalAbuse': 'Did you see or hear a parent or household member in your home being slapped, kicked, punched, or beaten up?',
          'witnessedWeaponAbuse': 'Did you see or hear a parent or household member in your home being hit or cut with an object, such as a stick (or cane), bottle, club, knife, whip, etc.?',
          'verbalAbuse': 'Did a parent, guardian, or other household member yell, scream, or swear at you, insult or humiliate you?',
          'threatenedAbandonment': 'Did a parent, guardian, or other household member threaten to, or actually, abandon you or throw you out of the house?',
          'physicalAbuse': 'Did a parent, guardian, or other household member spank, slap, kick, punch, or beat you up?',
          'weaponAbuse': 'Did a parent, guardian, or other household member hit or cut you with an object, such as a stick (or cane), bottle, club, knife, whip, etc.?',
          'sexualTouching': 'Did someone touch or fondle you in a sexual way when you did not want them to?',
          'sexualFondling': 'Did someone make you touch their body in a sexual way when you did not want them to?',
          'attemptedSexualIntercourse': 'Did someone attempt oral, anal, or vaginal intercourse with you when you did not want them to?',
          'completedSexualIntercourse': 'Did someone actually have oral, anal, or vaginal intercourse with you when you did not want them to?',
          'bullied': 'Were you bullied?',
          'physicalFight': 'Were you in a physical fight?',
          'witnessedBeating': 'Did you see or hear someone being beaten up in real life?',
          'witnessedStabbingOrShooting': 'Did you see or hear someone being stabbed or shot in real life?',
          'witnessedThreatenedWithWeapon': 'Did you see or hear someone being threatened with a knife or gun in real life?'
        };
        
        return questionTextMap[questionId] || `Question: ${questionId}`;
      };
      
      // Add frequency type 5 questions (reversed items)
      frequencyType5Questions.forEach(questionId => {
        if (formData[questionId] && formData[questionId] !== '') {
          const response = formData[questionId];
          const originalScore = scoringValues.frequency5[response];
          const reversedScore = (originalScore > 0) ? (6 - originalScore) : originalScore;
          
          csvContent += [
            studentId,
            timestamp,
            questionId,
            `"${getQuestionText(questionId).replace(/"/g, '""')}"`,
            `"${response}"`,
            'frequency5',
            'Yes', // Is reversed
            originalScore,
            reversedScore
          ].join(',') + '\n';
        }
      });
      
      // Add frequency type 4 questions
      frequencyType4Questions.forEach(questionId => {
        if (formData[questionId] && formData[questionId] !== '') {
          const response = formData[questionId];
          const score = scoringValues.frequency4[response];
          
          csvContent += [
            studentId,
            timestamp,
            questionId,
            `"${getQuestionText(questionId).replace(/"/g, '""')}"`,
            `"${response}"`,
            'frequency4',
            'No', // Not reversed
            score,
            score
          ].join(',') + '\n';
        }
      });
      
      // Add yes/no questions
      yesNoQuestions.forEach(questionId => {
        if (formData[questionId] && formData[questionId] !== '') {
          const response = formData[questionId];
          const score = scoringValues.yesNo[response];
          
          csvContent += [
            studentId,
            timestamp,
            questionId,
            `"${getQuestionText(questionId).replace(/"/g, '""')}"`,
            `"${response}"`,
            'yesNo',
            'No', // Not reversed
            score,
            score
          ].join(',') + '\n';
        }
      });
      
      // Add total score row
      csvContent += [
        studentId,
        timestamp,
        'TOTAL',
        '"ACE-IQ Total Score"',
        '',
        '',
        '',
        '',
        totalScore
      ].join(',') + '\n';
      
      // Create downloadable link
      const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `aceiq_results_${studentId}_${new Date().toISOString().slice(0, 10)}.csv`);
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

  // Export results as JSON
  const exportJSON = () => {
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    
    const dataStr = JSON.stringify({
      studentId,
      timestamp,
      formData,
      scores,
      totalScore
    }, null, 2);
    
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `aceiq_results_${studentId}_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Define the sections of the questionnaire
  const sections = [
    // Section 0: Demographic Information
    <section key="demographics" className="questionnaire-section">
      <h2 className="questionnaire-section-title">DEMOGRAPHIC INFORMATION</h2>
      
      <div className="demographics-container">
        <div className="question-item compact">
          <div className="question-text">
            <span className="question-number">0.1</span>
            Sex
          </div>
          <div className="radio-options horizontal">
            <div className="radio-option">
              <input 
                type="radio" 
                id="sex-male" 
                name="sex" 
                value="Male" 
                checked={formData.sex === "Male"}
                onChange={handleChange}
              />
              <label htmlFor="sex-male">Male</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="sex-female" 
                name="sex" 
                value="Female" 
                checked={formData.sex === "Female"}
                onChange={handleChange}
              />
              <label htmlFor="sex-female">Female</label>
            </div>
          </div>
        </div>
        
        <div className="question-item compact">
          <div className="question-text">
            <span className="question-number">0.2</span>
            Date of birth
          </div>
          <div className="date-input-container">
            <input 
              type="date" 
              name="birthDate" 
              value={formData.birthDate}
              onChange={handleChange}
              className="date-picker"
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
            />
          </div>
        </div>
        
        <div className="question-item compact">
          <div className="question-text">
            <span className="question-number">0.3</span>
            Age
          </div>
          <div className="input-container">
            <input 
              type="text" 
              name="age" 
              value={formData.age}
              readOnly
              className="text-input age-input calculated"
              placeholder="Auto-calculated"
            />
          </div>
        </div>
        
        <div className="question-item compact">
          <div className="question-text">
            <span className="question-number">0.4</span>
            Ethnic/racial group or cultural background
          </div>
          <div className="input-container">
            <input 
              type="text" 
              name="ethnicity" 
              value={formData.ethnicity}
              onChange={handleChange}
              className="text-input ethnicity-input"
              placeholder="Enter your ethnicity"
            />
          </div>
        </div>
      </div>
    </section>,
    
    // Section 1: Relationship with Parents/Guardians
    <section key="parents" className="questionnaire-section">
      <h2 className="questionnaire-section-title">RELATIONSHIP WITH PARENTS/GUARDIANS</h2>
      <div className="question-description">
        When you were growing up, during the first 18 years of your life...
      </div>
      
      <div className="question-item">
        <div className="question-text">
          <span className="question-number">1.1</span>
          Did your parents/guardians understand your problems and worries?
        </div>
        <div className="radio-options">
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-always" 
              name="parentsUnderstandProblems" 
              value="Always" 
              checked={formData.parentsUnderstandProblems === "Always"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-always">Always</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-mostOfTime" 
              name="parentsUnderstandProblems" 
              value="Most of the time" 
              checked={formData.parentsUnderstandProblems === "Most of the time"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-mostOfTime">Most of the time</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-sometimes" 
              name="parentsUnderstandProblems" 
              value="Sometimes" 
              checked={formData.parentsUnderstandProblems === "Sometimes"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-sometimes">Sometimes</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-rarely" 
              name="parentsUnderstandProblems" 
              value="Rarely" 
              checked={formData.parentsUnderstandProblems === "Rarely"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-rarely">Rarely</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-never" 
              name="parentsUnderstandProblems" 
              value="Never" 
              checked={formData.parentsUnderstandProblems === "Never"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-never">Never</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-refused" 
              name="parentsUnderstandProblems" 
              value="Refused" 
              checked={formData.parentsUnderstandProblems === "Refused"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-refused">Refused</label>
          </div>
        </div>
      </div>
      
      <div className="question-item">
        <div className="question-text">
          <span className="question-number">1.2</span>
          Did your parents/guardians really know what you were doing with your free time when you were not at school or work?
        </div>
        <div className="radio-options">
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-always" 
              name="parentsKnowFreeTime" 
              value="Always" 
              checked={formData.parentsKnowFreeTime === "Always"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-always">Always</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-mostOfTime" 
              name="parentsKnowFreeTime" 
              value="Most of the time" 
              checked={formData.parentsKnowFreeTime === "Most of the time"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-mostOfTime">Most of the time</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-sometimes" 
              name="parentsKnowFreeTime" 
              value="Sometimes" 
              checked={formData.parentsKnowFreeTime === "Sometimes"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-sometimes">Sometimes</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-rarely" 
              name="parentsKnowFreeTime" 
              value="Rarely" 
              checked={formData.parentsKnowFreeTime === "Rarely"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-rarely">Rarely</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-never" 
              name="parentsKnowFreeTime" 
              value="Never" 
              checked={formData.parentsKnowFreeTime === "Never"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-never">Never</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-refused" 
              name="parentsKnowFreeTime" 
              value="Refused" 
              checked={formData.parentsKnowFreeTime === "Refused"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-refused">Refused</label>
          </div>
        </div>
      </div>
    </section>,
    
    // Sections imported from ACEIQSections.js
    <NeglectSection key="neglect" formData={formData} handleChange={handleChange} />,
    <FamilyEnvironmentSection key="family" formData={formData} handleChange={handleChange} />,
    <DirectAbuseSection key="direct-abuse" formData={formData} handleChange={handleChange} />,
    <PeerViolenceSection key="peer-violence" formData={formData} handleChange={handleChange} />,
    <CommunityViolenceSection key="community-violence" formData={formData} handleChange={handleChange} />
  ];
  
  // Render the form
  return (
    <div className="task-screen">
      {!formSubmitted ? (
        <div className="questionnaire-container">
          <h1 className="questionnaire-title">Adverse Childhood Experiences International Questionnaire (ACE-IQ)</h1>
          
          <form onSubmit={handleSubmit}>
            {sections[currentSection]}
            
            <div className="form-buttons">
              {currentSection > 0 && (
                <button 
                  type="button" 
                  className="form-button back" 
                  onClick={prevSection}
                >
                  Previous
                </button>
              )}
              
              {currentSection < sections.length - 1 ? (
                <button 
                  type="button" 
                  className="form-button next" 
                  onClick={nextSection}
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="form-button submit"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="questionnaire-container">
          <h1 className="questionnaire-title">Thank You</h1>
          <p>Your responses have been recorded.</p>
          
          <div className="score-summary">
            <h2>Questionnaire Score Summary</h2>
            <p className="total-score">Total Score: <span>{totalScore}</span></p>
            <p className="score-explanation">
              Higher scores indicate more adverse childhood experiences.
            </p>
          </div>
          
          <div className="form-actions">
            <button
              className="form-button export"
              onClick={exportJSON}
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

export default ACEIQQuestionnaire; 