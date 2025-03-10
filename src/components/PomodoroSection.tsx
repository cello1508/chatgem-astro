
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
const LONG_BREAK_TIME = 15 * 60; // 15 minutes in seconds

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const PomodoroSection: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Set the initial time when the mode changes
  useEffect(() => {
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(POMODORO_TIME);
        break;
      case 'shortBreak':
        setTimeLeft(SHORT_BREAK_TIME);
        break;
      case 'longBreak':
        setTimeLeft(LONG_BREAK_TIME);
        break;
    }
    setIsActive(false);
  }, [mode]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      if (mode === 'pomodoro') {
        const newCount = pomodorosCompleted + 1;
        setPomodorosCompleted(newCount);
        
        // After 4 pomodoros, take a long break
        if (newCount % 4 === 0) {
          setMode('longBreak');
        } else {
          setMode('shortBreak');
        }
      } else {
        // After a break, go back to pomodoro
        setMode('pomodoro');
      }
      
      // Play sound if available in the browser
      try {
        const audio = new Audio('/notification.mp3');
        audio.play();
      } catch (error) {
        console.log('Audio notification not supported');
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, mode, pomodorosCompleted]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(POMODORO_TIME);
        break;
      case 'shortBreak':
        setTimeLeft(SHORT_BREAK_TIME);
        break;
      case 'longBreak':
        setTimeLeft(LONG_BREAK_TIME);
        break;
    }
    setIsActive(false);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate the progress percentage
  const getProgress = () => {
    let total;
    switch (mode) {
      case 'pomodoro':
        total = POMODORO_TIME;
        break;
      case 'shortBreak':
        total = SHORT_BREAK_TIME;
        break;
      case 'longBreak':
        total = LONG_BREAK_TIME;
        break;
    }
    return ((total - timeLeft) / total) * 100;
  };

  const modeTitles = {
    pomodoro: 'Foco',
    shortBreak: 'Pausa Curta',
    longBreak: 'Pausa Longa',
  };

  return (
    <div className="max-w-md mx-auto w-full h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-10">Pomodoro Timer</h1>
        
        {/* Mode selector */}
        <div className="flex rounded-lg overflow-hidden mb-10 glass">
          {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 ${
                mode === m 
                  ? 'bg-success text-black' 
                  : 'hover:bg-gray-700/50'
              }`}
            >
              {modeTitles[m]}
            </button>
          ))}
        </div>
        
        {/* Timer display */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          {/* Progress circle */}
          <svg className="w-full h-full -rotate-90 absolute" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#2A2A2A"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#38D784"
              strokeWidth="8"
              strokeDasharray="282.7"
              strokeDashoffset={282.7 - (282.7 * getProgress()) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="z-10">
            <div className="text-6xl font-bold">{formatTime(timeLeft)}</div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full glass flex items-center justify-center text-success hover:bg-success/10 transition-all"
          >
            {isActive ? <Pause size={32} /> : <Play size={32} />}
          </button>
          <button
            onClick={resetTimer}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 transition-all"
          >
            <RotateCcw size={24} />
          </button>
        </div>
        
        {/* Pomodoros counter */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-2">Pomodoros completados hoje</p>
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  i < (pomodorosCompleted % 4) ? 'bg-success' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-lg mt-2">{pomodorosCompleted}</p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroSection;
