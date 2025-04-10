import React from 'react';

// Section 2: Neglect
export const NeglectSection = ({ formData, handleChange }) => (
  <section className="questionnaire-section">
    <h2 className="questionnaire-section-title">NEGLECT</h2>
    <div className="question-description">
      When you were growing up, during the first 18 years of your life...
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">2.1</span>
        How often did your parents/guardians not give you enough food even when they could easily have done so?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="notEnoughFood-manyTimes" 
            name="notEnoughFood" 
            value="Many times" 
            checked={formData.notEnoughFood === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="notEnoughFood-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notEnoughFood-fewTimes" 
            name="notEnoughFood" 
            value="A few times" 
            checked={formData.notEnoughFood === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="notEnoughFood-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notEnoughFood-once" 
            name="notEnoughFood" 
            value="Once" 
            checked={formData.notEnoughFood === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="notEnoughFood-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notEnoughFood-never" 
            name="notEnoughFood" 
            value="Never" 
            checked={formData.notEnoughFood === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="notEnoughFood-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notEnoughFood-refused" 
            name="notEnoughFood" 
            value="Refused" 
            checked={formData.notEnoughFood === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="notEnoughFood-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">2.2</span>
        Were your parents/guardians too drunk or intoxicated by drugs to take care of you?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsDrunk-manyTimes" 
            name="parentsDrunkOrDrugs" 
            value="Many times" 
            checked={formData.parentsDrunkOrDrugs === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="parentsDrunk-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsDrunk-fewTimes" 
            name="parentsDrunkOrDrugs" 
            value="A few times" 
            checked={formData.parentsDrunkOrDrugs === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="parentsDrunk-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsDrunk-once" 
            name="parentsDrunkOrDrugs" 
            value="Once" 
            checked={formData.parentsDrunkOrDrugs === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="parentsDrunk-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsDrunk-never" 
            name="parentsDrunkOrDrugs" 
            value="Never" 
            checked={formData.parentsDrunkOrDrugs === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="parentsDrunk-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsDrunk-refused" 
            name="parentsDrunkOrDrugs" 
            value="Refused" 
            checked={formData.parentsDrunkOrDrugs === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="parentsDrunk-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">2.3</span>
        How often did your parents/guardians not send you to school even when it was available?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="notSentToSchool-manyTimes" 
            name="notSentToSchool" 
            value="Many times" 
            checked={formData.notSentToSchool === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="notSentToSchool-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notSentToSchool-fewTimes" 
            name="notSentToSchool" 
            value="A few times" 
            checked={formData.notSentToSchool === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="notSentToSchool-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notSentToSchool-once" 
            name="notSentToSchool" 
            value="Once" 
            checked={formData.notSentToSchool === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="notSentToSchool-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notSentToSchool-never" 
            name="notSentToSchool" 
            value="Never" 
            checked={formData.notSentToSchool === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="notSentToSchool-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notSentToSchool-refused" 
            name="notSentToSchool" 
            value="Refused" 
            checked={formData.notSentToSchool === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="notSentToSchool-refused">Refused</label>
        </div>
      </div>
    </div>
  </section>
);

// Section 3: Family Environment
export const FamilyEnvironmentSection = ({ formData, handleChange }) => (
  <section className="questionnaire-section">
    <h2 className="questionnaire-section-title">FAMILY ENVIRONMENT</h2>
    <div className="question-description">
      When you were growing up, during the first 18 years of your life...
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.1</span>
        Did you live with a household member who was a problem drinker or alcoholic, or misused street or prescription drugs?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="alcoholicMember-yes" 
            name="alcoholicHouseholdMember" 
            value="Yes" 
            checked={formData.alcoholicHouseholdMember === "Yes"}
            onChange={handleChange}
          />
          <label htmlFor="alcoholicMember-yes">Yes</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="alcoholicMember-no" 
            name="alcoholicHouseholdMember" 
            value="No" 
            checked={formData.alcoholicHouseholdMember === "No"}
            onChange={handleChange}
          />
          <label htmlFor="alcoholicMember-no">No</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="alcoholicMember-refused" 
            name="alcoholicHouseholdMember" 
            value="Refused" 
            checked={formData.alcoholicHouseholdMember === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="alcoholicMember-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.2</span>
        Did you live with a household member who was depressed, mentally ill or suicidal?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="mentallyIllMember-yes" 
            name="mentallyIllHouseholdMember" 
            value="Yes" 
            checked={formData.mentallyIllHouseholdMember === "Yes"}
            onChange={handleChange}
          />
          <label htmlFor="mentallyIllMember-yes">Yes</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="mentallyIllMember-no" 
            name="mentallyIllHouseholdMember" 
            value="No" 
            checked={formData.mentallyIllHouseholdMember === "No"}
            onChange={handleChange}
          />
          <label htmlFor="mentallyIllMember-no">No</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="mentallyIllMember-refused" 
            name="mentallyIllHouseholdMember" 
            value="Refused" 
            checked={formData.mentallyIllHouseholdMember === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="mentallyIllMember-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.3</span>
        Did you live with a household member who was ever sent to jail or prison?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="imprisonedMember-yes" 
            name="imprisonedHouseholdMember" 
            value="Yes" 
            checked={formData.imprisonedHouseholdMember === "Yes"}
            onChange={handleChange}
          />
          <label htmlFor="imprisonedMember-yes">Yes</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="imprisonedMember-no" 
            name="imprisonedHouseholdMember" 
            value="No" 
            checked={formData.imprisonedHouseholdMember === "No"}
            onChange={handleChange}
          />
          <label htmlFor="imprisonedMember-no">No</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="imprisonedMember-refused" 
            name="imprisonedHouseholdMember" 
            value="Refused" 
            checked={formData.imprisonedHouseholdMember === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="imprisonedMember-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.4</span>
        Were your parents ever separated or divorced?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsSeparated-yes" 
            name="parentsSeparated" 
            value="Yes" 
            checked={formData.parentsSeparated === "Yes"}
            onChange={handleChange}
          />
          <label htmlFor="parentsSeparated-yes">Yes</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsSeparated-no" 
            name="parentsSeparated" 
            value="No" 
            checked={formData.parentsSeparated === "No"}
            onChange={handleChange}
          />
          <label htmlFor="parentsSeparated-no">No</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsSeparated-refused" 
            name="parentsSeparated" 
            value="Refused" 
            checked={formData.parentsSeparated === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="parentsSeparated-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.5</span>
        Did your mother, father or guardian die?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentDied-yes" 
            name="parentDied" 
            value="Yes" 
            checked={formData.parentDied === "Yes"}
            onChange={handleChange}
          />
          <label htmlFor="parentDied-yes">Yes</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentDied-no" 
            name="parentDied" 
            value="No" 
            checked={formData.parentDied === "No"}
            onChange={handleChange}
          />
          <label htmlFor="parentDied-no">No</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentDied-refused" 
            name="parentDied" 
            value="Refused" 
            checked={formData.parentDied === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="parentDied-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-description">
      These next questions are about certain things you may actually have heard or seen IN YOUR HOME. These are things that may have been done to another household member but not necessarily to you.
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.6</span>
        Did you see or hear a parent or household member in your home being yelled at, screamed at, sworn at, insulted or humiliated?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedVerbalAbuse-manyTimes" 
            name="witnessedVerbalAbuse" 
            value="Many times" 
            checked={formData.witnessedVerbalAbuse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedVerbalAbuse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedVerbalAbuse-fewTimes" 
            name="witnessedVerbalAbuse" 
            value="A few times" 
            checked={formData.witnessedVerbalAbuse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedVerbalAbuse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedVerbalAbuse-once" 
            name="witnessedVerbalAbuse" 
            value="Once" 
            checked={formData.witnessedVerbalAbuse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedVerbalAbuse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedVerbalAbuse-never" 
            name="witnessedVerbalAbuse" 
            value="Never" 
            checked={formData.witnessedVerbalAbuse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedVerbalAbuse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedVerbalAbuse-refused" 
            name="witnessedVerbalAbuse" 
            value="Refused" 
            checked={formData.witnessedVerbalAbuse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedVerbalAbuse-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.7</span>
        Did you see or hear a parent or household member in your home being slapped, kicked, punched or beaten up?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedPhysicalAbuse-manyTimes" 
            name="witnessedPhysicalAbuse" 
            value="Many times" 
            checked={formData.witnessedPhysicalAbuse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedPhysicalAbuse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedPhysicalAbuse-fewTimes" 
            name="witnessedPhysicalAbuse" 
            value="A few times" 
            checked={formData.witnessedPhysicalAbuse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedPhysicalAbuse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedPhysicalAbuse-once" 
            name="witnessedPhysicalAbuse" 
            value="Once" 
            checked={formData.witnessedPhysicalAbuse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedPhysicalAbuse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedPhysicalAbuse-never" 
            name="witnessedPhysicalAbuse" 
            value="Never" 
            checked={formData.witnessedPhysicalAbuse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedPhysicalAbuse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedPhysicalAbuse-refused" 
            name="witnessedPhysicalAbuse" 
            value="Refused" 
            checked={formData.witnessedPhysicalAbuse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedPhysicalAbuse-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.8</span>
        Did you see or hear a parent or household member in your home being hit or cut with an object, such as a stick (or cane), bottle, club, knife, whip etc.?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedWeaponAbuse-manyTimes" 
            name="witnessedWeaponAbuse" 
            value="Many times" 
            checked={formData.witnessedWeaponAbuse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedWeaponAbuse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedWeaponAbuse-fewTimes" 
            name="witnessedWeaponAbuse" 
            value="A few times" 
            checked={formData.witnessedWeaponAbuse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedWeaponAbuse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedWeaponAbuse-once" 
            name="witnessedWeaponAbuse" 
            value="Once" 
            checked={formData.witnessedWeaponAbuse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedWeaponAbuse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedWeaponAbuse-never" 
            name="witnessedWeaponAbuse" 
            value="Never" 
            checked={formData.witnessedWeaponAbuse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedWeaponAbuse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedWeaponAbuse-refused" 
            name="witnessedWeaponAbuse" 
            value="Refused" 
            checked={formData.witnessedWeaponAbuse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedWeaponAbuse-refused">Refused</label>
        </div>
      </div>
    </div>
  </section>
);

// More sections can be defined here... 

// Section 4: Direct Abuse
export const DirectAbuseSection = ({ formData, handleChange }) => (
  <section className="questionnaire-section">
    <h2 className="questionnaire-section-title">DIRECT ABUSE</h2>
    <div className="question-description">
      When you were growing up, during the first 18 years of your life...
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">4.1</span>
        Did a parent, guardian, or other household member yell, scream or swear at you, insult or humiliate you?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="verbalAbuse-manyTimes" 
            name="verbalAbuse" 
            value="Many times" 
            checked={formData.verbalAbuse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="verbalAbuse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="verbalAbuse-fewTimes" 
            name="verbalAbuse" 
            value="A few times" 
            checked={formData.verbalAbuse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="verbalAbuse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="verbalAbuse-once" 
            name="verbalAbuse" 
            value="Once" 
            checked={formData.verbalAbuse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="verbalAbuse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="verbalAbuse-never" 
            name="verbalAbuse" 
            value="Never" 
            checked={formData.verbalAbuse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="verbalAbuse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="verbalAbuse-refused" 
            name="verbalAbuse" 
            value="Refused" 
            checked={formData.verbalAbuse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="verbalAbuse-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">4.2</span>
        Did a parent, guardian, or other household member threaten to, or actually, abandon you or throw you out of the house?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="threatenedAbandonment-manyTimes" 
            name="threatenedAbandonment" 
            value="Many times" 
            checked={formData.threatenedAbandonment === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="threatenedAbandonment-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="threatenedAbandonment-fewTimes" 
            name="threatenedAbandonment" 
            value="A few times" 
            checked={formData.threatenedAbandonment === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="threatenedAbandonment-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="threatenedAbandonment-once" 
            name="threatenedAbandonment" 
            value="Once" 
            checked={formData.threatenedAbandonment === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="threatenedAbandonment-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="threatenedAbandonment-never" 
            name="threatenedAbandonment" 
            value="Never" 
            checked={formData.threatenedAbandonment === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="threatenedAbandonment-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="threatenedAbandonment-refused" 
            name="threatenedAbandonment" 
            value="Refused" 
            checked={formData.threatenedAbandonment === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="threatenedAbandonment-refused">Refused</label>
        </div>
      </div>
    </div>
  </section>
);

// Section 5: Peer Violence
export const PeerViolenceSection = ({ formData, handleChange }) => (
  <section className="questionnaire-section">
    <h2 className="questionnaire-section-title">PEER VIOLENCE</h2>
    <div className="question-description">
      When you were growing up, during the first 18 years of your life...
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">5.1</span>
        Were you bullied?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="bullied-manyTimes" 
            name="bullied" 
            value="Many times" 
            checked={formData.bullied === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="bullied-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="bullied-fewTimes" 
            name="bullied" 
            value="A few times" 
            checked={formData.bullied === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="bullied-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="bullied-once" 
            name="bullied" 
            value="Once" 
            checked={formData.bullied === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="bullied-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="bullied-never" 
            name="bullied" 
            value="Never" 
            checked={formData.bullied === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="bullied-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="bullied-refused" 
            name="bullied" 
            value="Refused" 
            checked={formData.bullied === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="bullied-refused">Refused</label>
        </div>
      </div>
    </div>
  </section>
);

// Section 6: Community Violence
export const CommunityViolenceSection = ({ formData, handleChange }) => (
  <section className="questionnaire-section">
    <h2 className="questionnaire-section-title">COMMUNITY VIOLENCE</h2>
    <div className="question-description">
      These questions are about violence you may have seen or heard in your neighborhood or community, but not in your home or at school.
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">6.1</span>
        Did you see or hear someone being beaten up in real life?
      </div>
      <div className="radio-options">
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedBeating-manyTimes" 
            name="witnessedBeating" 
            value="Many times" 
            checked={formData.witnessedBeating === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedBeating-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedBeating-fewTimes" 
            name="witnessedBeating" 
            value="A few times" 
            checked={formData.witnessedBeating === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedBeating-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedBeating-once" 
            name="witnessedBeating" 
            value="Once" 
            checked={formData.witnessedBeating === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedBeating-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedBeating-never" 
            name="witnessedBeating" 
            value="Never" 
            checked={formData.witnessedBeating === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedBeating-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedBeating-refused" 
            name="witnessedBeating" 
            value="Refused" 
            checked={formData.witnessedBeating === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedBeating-refused">Refused</label>
        </div>
      </div>
    </div>
  </section>
); 