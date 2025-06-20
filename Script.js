document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('time-display');
    const startPauseButton = document.getElementById('start-pause-button');
    const startPauseText = document.getElementById('start-pause-text');
    const lapButton = document.getElementById('lap-button');
    const resetButton = document.getElementById('reset-button');
    const lapsList = document.getElementById('laps-list');
    const lapsSection = document.getElementById('laps-section');
    const lapsPlaceholder = document.getElementById('laps-placeholder');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const currentYearSpan = document.getElementById('current-year');

    let time = 0;
    let isRunning = false;
    let intervalId = null;
    let laps = [];
    let timeAtLastLap = 0;

    function formatTime(ms) {
        const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
        return `${minutes}:${seconds}.${milliseconds}`;
    }

    function updateUI() {
        timeDisplay.textContent = formatTime(time);

        if (isRunning) {
            startPauseText.textContent = 'Pause';
            startPauseButton.classList.remove('start-button');
            startPauseButton.classList.add('pause-button-style');
            startPauseButton.title = "Pause the timer";
            startPauseButton.setAttribute('aria-label', 'Pause Timer');
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline-block';
            lapButton.disabled = false;
        } else {
            startPauseText.textContent = time > 0 ? 'Resume' : 'Start';
            startPauseButton.classList.remove('pause-button-style');
            startPauseButton.classList.add('start-button');
            startPauseButton.title = time > 0 ? "Resume the timer" : "Start the timer";
            startPauseButton.setAttribute('aria-label', time > 0 ? 'Resume Timer' : 'Start Timer');
            playIcon.style.display = 'inline-block';
            pauseIcon.style.display = 'none';
            lapButton.disabled = true;
        }
        resetButton.disabled = time === 0 && !isRunning && laps.length === 0;

        if (laps.length > 0) {
            lapsSection.style.display = 'block';
            lapsPlaceholder.style.display = 'none';
        } else {
            lapsSection.style.display = 'none';
            lapsPlaceholder.style.display = 'block';
            if (time === 0 && !isRunning) {
                lapsPlaceholder.textContent = 'Click Start to begin.';
            } else if (time > 0 && isRunning) {
                lapsPlaceholder.textContent = "Press 'Lap' to record intervals.";
            } else if (time > 0 && !isRunning) {
                 lapsPlaceholder.textContent = "Timer paused. Press 'Lap' to record intervals once resumed.";
            }
        }
    }

    function renderLaps() {
        lapsList.innerHTML = '';
        laps.forEach(lapData => {
            const li = document.createElement('li');
            li.className = 'lap-item';
            
            const lapNumberSpan = document.createElement('span');
            lapNumberSpan.className = 'lap-item-number';
            lapNumberSpan.textContent = `Lap ${String(lapData.lap).padStart(2, '0')}`;
            
            const lapTimeSpan = document.createElement('span');
            lapTimeSpan.className = 'lap-item-time';
            lapTimeSpan.textContent = formatTime(lapData.time);
            
            li.appendChild(lapNumberSpan);
            li.appendChild(lapTimeSpan);
            lapsList.appendChild(li);
        });
        updateUI(); 
    }

    function handleStartPause() {
        isRunning = !isRunning;
        if (isRunning) {
            if (time === 0) {
                timeAtLastLap = 0;
            }
            const startTimePoint = Date.now();
            const accumulatedDurationBeforeStart = time;
            intervalId = setInterval(() => {
                time = accumulatedDurationBeforeStart + (Date.now() - startTimePoint);
                timeDisplay.textContent = formatTime(time); 
            }, 10);
        } else {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
        updateUI();
    }

    function handleLap() {
        if (isRunning) {
            const currentLapDuration = time - timeAtLastLap;
            laps.unshift({ lap: laps.length + 1, time: currentLapDuration });
            timeAtLastLap = time;
            renderLaps();
        }
    }

    function handleReset() {
        isRunning = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        time = 0;
        laps = [];
        timeAtLastLap = 0;
        renderLaps(); 
        updateUI(); 
    }

    startPauseButton.addEventListener('click', handleStartPause);
    lapButton.addEventListener('click', handleLap);
    resetButton.addEventListener('click', handleReset);

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    updateUI();
});
