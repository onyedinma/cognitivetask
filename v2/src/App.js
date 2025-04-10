import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Task components
import Home from './components/Home';
import StudentInfo from './components/StudentInfo';
import ObjectSpanTask from './components/ObjectSpan/ObjectSpanTask';
import ForwardObjectSpan from './components/ObjectSpan/ForwardObjectSpan';
import BackwardObjectSpan from './components/ObjectSpan/BackwardObjectSpan';
import ObjectSpanPractice from './components/ObjectSpan/ObjectSpanPractice';
import ObjectSpanMainTask from './components/ObjectSpan/ObjectSpanMainTask';
import DigitSpanTask from './components/DigitSpan/DigitSpanTask';
import ForwardDigitSpan from './components/DigitSpan/ForwardDigitSpan';
import BackwardDigitSpan from './components/DigitSpan/BackwardDigitSpan';
import DigitSpanPractice from './components/DigitSpan/DigitSpanPractice';
import DigitSpanMainTask from './components/DigitSpan/DigitSpanMainTask';
import ShapeCountingTask from './components/ShapeCounting/ShapeCountingTask';
import ShapeCountingInstructions from './components/ShapeCounting/ShapeCountingInstructions';
import ShapeCountingPractice from './components/ShapeCounting/ShapeCountingPractice';
import ShapeCountingMainTask from './components/ShapeCounting/ShapeCountingMainTask';
import CountingGameTask from './components/CountingGame/CountingGameTask';
import CountingGameInstructions from './components/CountingGame/CountingGameInstructions';
import CountingGamePractice from './components/CountingGame/CountingGamePractice';
import CountingGameMainTask from './components/CountingGame/CountingGameMainTask';
import SpatialMemoryTask from './components/SpatialMemory/SpatialMemoryTask';
import SpatialMemoryPractice from './components/SpatialMemory/SpatialMemoryPractice';
import SpatialMemoryMainTask from './components/SpatialMemory/SpatialMemoryMainTask';
import EcologicalSpatialTask from './components/EcologicalSpatial/EcologicalSpatialTask';
import EcologicalSpatialPractice from './components/EcologicalSpatial/EcologicalSpatialPractice';
import EcologicalSpatialMainTask from './components/EcologicalSpatial/EcologicalSpatialMainTask';
import { 
  EcologicalDeductiveReasoningTask, 
  EcologicalDeductiveReasoningPractice, 
  EcologicalDeductiveReasoningMainTask 
} from './components/EcologicalDeductiveReasoning';
import DeductiveReasoningTask from './components/DeductiveReasoning/DeductiveReasoningTask';
import DeductiveReasoningPractice from './components/DeductiveReasoning/DeductiveReasoningPractice';
import DeductiveReasoningMainTask from './components/DeductiveReasoning/DeductiveReasoningMainTask';

// Fullscreen components
import { FullscreenProvider } from './components/FullscreenProvider';
import FullscreenPrompt from './components/FullscreenPrompt';
import FullscreenWarning from './components/FullscreenWarning';

// Protected Route component to ensure student info is entered
function RequireStudentInfo({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    console.log('RequireStudentInfo mounting and checking localStorage');
    
    // Use a timer to ensure localStorage is fully available
    const timer = setTimeout(() => {
      // Direct access to localStorage 
      const studentId = localStorage.getItem('studentId');
      const counterBalance = localStorage.getItem('counterBalance');
      
      console.log('RequireStudentInfo values:', {
        studentId: studentId ? `${studentId.substring(0, 3)}...` : 'not set',
        counterBalance: counterBalance || 'not set',
        path: window.location.pathname
      });
      
      if (studentId && counterBalance) {
        console.log('RequireStudentInfo: Authorization successful');
        setIsAuthorized(true);
      } else {
        console.log('RequireStudentInfo: Authorization failed, missing required data');
        setIsAuthorized(false);
      }
      
      setIsChecking(false);
    }, 50); // Small delay to ensure localStorage is synced
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isChecking) {
    return <div className="loading">Checking authorization...</div>;
  }
  
  if (!isAuthorized) {
    console.log('RequireStudentInfo redirecting to /student-info');
    return <Navigate to="/student-info" replace />;
  }
  
  return children;
}

function TaskWrapper({ children }) {
  return (
    <>
      <FullscreenPrompt />
      <FullscreenWarning />
      {children}
    </>
  );
}

function App() {
  // eslint-disable-next-line no-unused-vars
  const [hasStudentInfo, setHasStudentInfo] = useState(false);
  
  // Determine if we need a basename for production or not for development
  const isProduction = process.env.NODE_ENV === 'production';
  const basename = isProduction ? '/v2' : '';
  
  console.log('App render - hasStudentInfo:', hasStudentInfo);
  
  return (
    <FullscreenProvider>
      <Router basename={basename}>
    <div className="App">
          <Routes>
            {/* Student Info Route */}
            <Route path="/student-info" element={<StudentInfo />} />
            
            {/* Home Route with Protection */}
            <Route path="/" element={
              <RequireStudentInfo>
                <Home />
              </RequireStudentInfo>
            } />
            
            {/* Object Span Task Routes - All Protected */}
            <Route path="/object-span" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <ObjectSpanTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Forward Object Span */}
            <Route path="/object-span/forward" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <ForwardObjectSpan />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Backward Object Span */}
            <Route path="/object-span/backward" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <BackwardObjectSpan />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Object Span Practice */}
            <Route path="/object-span/:direction/practice" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <ObjectSpanPractice />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Object Span Main Task */}
            <Route path="/object-span/:direction/task" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <ObjectSpanMainTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Digit Span Task Routes - All Protected */}
            <Route path="/digit-span" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <DigitSpanTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Forward Digit Span */}
            <Route path="/digit-span/forward" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <ForwardDigitSpan />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Backward Digit Span */}
            <Route path="/digit-span/backward" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <BackwardDigitSpan />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Digit Span Practice */}
            <Route path="/digit-span/:direction/practice" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <DigitSpanPractice />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Digit Span Main Task */}
            <Route path="/digit-span/:direction/task" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <DigitSpanMainTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Shape Counting Routes */}
            <Route path="/shape-counting" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <ShapeCountingTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/shape-counting/instructions" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <ShapeCountingInstructions />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/shape-counting/practice" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <ShapeCountingPractice />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/shape-counting/task" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <ShapeCountingMainTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Counting Game Routes (Ecological Shape Counting) */}
            <Route path="/counting-game" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <CountingGameTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/counting-game/instructions" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <CountingGameInstructions />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/counting-game/practice" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <CountingGamePractice />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/counting-game/task" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <CountingGameMainTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Spatial Memory Task Routes */}
            <Route path="/spatial-memory" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <SpatialMemoryTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/spatial-memory/practice" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <SpatialMemoryPractice />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/spatial-memory/task" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <SpatialMemoryMainTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Restore Ecological Spatial Memory Routes */}
            <Route path="/ecological-spatial" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <EcologicalSpatialTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/ecological-spatial/practice" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <EcologicalSpatialPractice />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/ecological-spatial/task" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <EcologicalSpatialMainTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Keep Ecological Deductive Reasoning Task */}
            <Route path="/ecological-deductive" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <EcologicalDeductiveReasoningTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/ecological-deductive/practice" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <EcologicalDeductiveReasoningPractice />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/ecological-deductive/task" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <EcologicalDeductiveReasoningMainTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Deductive Reasoning Task Routes */}
            <Route path="/deductive-reasoning" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <DeductiveReasoningTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/deductive-reasoning/practice" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <DeductiveReasoningPractice />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            <Route path="/deductive-reasoning/task" element={
              <RequireStudentInfo>
                <TaskWrapper>
                  <DeductiveReasoningMainTask />
                </TaskWrapper>
              </RequireStudentInfo>
            } />
            
            {/* Fallback route - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
    </div>
      </Router>
    </FullscreenProvider>
  );
}

export default App;
