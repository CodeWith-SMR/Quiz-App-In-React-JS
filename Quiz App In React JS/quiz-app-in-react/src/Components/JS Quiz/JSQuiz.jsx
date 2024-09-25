import React, { useState, useRef, useEffect } from "react";
import "./JSQuiz.css";
import { data } from "../../assets/data";

const shuffleArray = (array) => {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const JSQuiz = () => {
  // Retrieve quiz state from localStorage or initialize a new state
  const savedState = JSON.parse(localStorage.getItem("quizState")) || {
    index: 0,
    score: 0,
    questions: shuffleArray(data),
    result: false,
    lock: false
  };

  const [index, setIndex] = useState(savedState.index);
  const [score, setScore] = useState(savedState.score);
  const [lock, setLock] = useState(savedState.lock);
  const [result, setResult] = useState(savedState.result);
  const [questions, setQuestions] = useState(savedState.questions);

  const question = questions[index];
  const optionsRefs = useRef([null, null, null, null]);

  useEffect(() => {
    // Store quiz state in localStorage whenever it changes
    localStorage.setItem("quizState", JSON.stringify({
      index,
      score,
      questions,
      result,
      lock
    }));
  }, [index, score, questions, result, lock]);

  const checkAns = (e, ans) => {
    if (!lock) {
      const isCorrect = question.ans === ans;
      e.target.classList.add(isCorrect ? "correct" : "wrong");
      if (isCorrect) setScore(score + 1);
      else optionsRefs.current[question.ans - 1].classList.add("correct");
      setLock(true);
    }
  };

  const next = () => {
    if (lock) {
      if (index === questions.length - 1) {
        setResult(true);
      } else {
        setIndex(index + 1);
        setLock(false);
        optionsRefs.current.forEach(ref => {
          ref?.classList.remove("wrong", "correct");
        });
      }
    }
  };

  const reset = () => {
    setQuestions(shuffleArray(data)); // Shuffle and set new questions
    setIndex(0);
    setScore(0);
    setLock(false);
    setResult(false);
    localStorage.removeItem("quizState"); // Clear saved state
  };

  const percentageScore = Math.round((score / questions.length) * 100);
  const progressCircleColor = percentageScore >= 70 ? '#007bff' : 'red';

  return (
    <div className="container">
      <h1><i className="fa-brands fa-square-js JS"></i> Quiz App</h1>
      <hr />
      {result ? (
        <>
          <h2 className="score">You Scored {score} out of {questions.length}</h2>
          <div className="circular-progress">
            <div className="container1">
              <div
                className="progress-circle"
                style={{ 
                  background: `conic-gradient(${progressCircleColor} 0% ${percentageScore}%, #e0e0e0 ${percentageScore}% 100%)`
                }}
              >
                <span className="progress-value">{percentageScore}%</span> 
              </div>
            </div>
          </div>
          <button onClick={reset}>Restart</button>
        </>
      ) : (
        <>
          <h2>{index + 1}. {question.question}</h2>
          <ul>
            {Array.from({ length: 4 }, (_, i) => (
              <li
                key={i}
                ref={el => optionsRefs.current[i] = el}
                onClick={(e) => checkAns(e, i + 1)}
              >
                {question[`option${i + 1}`]}
              </li>
            ))}
          </ul>
          <button onClick={next}>Next</button>
          <div className="index">
            {index + 1} of {questions.length} questions
          </div>
        </>
      )}
    </div>
  );
};

export default JSQuiz;
