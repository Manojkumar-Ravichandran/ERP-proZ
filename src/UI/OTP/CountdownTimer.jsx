import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const CountdownTimer = forwardRef(({ initialTime = 90, onComplete, isActive }, ref) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerKey, setTimerKey] = useState(0);  // Unique key for reset

  // Reset function that can be accessed via ref
  const resetTimer = () => {
    setTimeLeft(initialTime);
    setTimerKey((prev) => prev + 1);  // Change key to restart timer
  };

  useImperativeHandle(ref, () => ({
    resetTimer,
  }));

  useEffect(() => {
    if (!isActive || timeLeft === 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1 && onComplete) onComplete();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isActive, timeLeft, onComplete, timerKey]);

  const formatTime = () =>
    `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;

  return <div>{formatTime()}</div>;
});

export default CountdownTimer;
