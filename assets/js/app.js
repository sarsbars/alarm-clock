'use strict';

const form = document.querySelector("form");
const hourInput = form.querySelector("input:nth-of-type(1)");
const minuteInput = form.querySelector("input:nth-of-type(2)");
const setAlarmButton = form.querySelector("button");
const inputs = [hourInput, minuteInput];
const displayAlarm = document.querySelector(".displayAlarm p");
const timeDisplay = document.querySelector("h1");
const errorMessage = document.querySelector(".error-message");

let alarmSet = false;
let alarmTime = "";
let alarmDate = null;
/* - - - - - - - - - - - - - - - - - - - - -*/
/* -  - - - - - Functions - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - - -*/

function clearInputs() {
    hourInput.value = "";
    minuteInput.value = "";
}

function setAlarm(formattedTime) {
    displayAlarm.textContent = formattedTime;
}

function formatTime(hour, minute) {
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinute = minute.toString().padStart(2, "0");
    return `${formattedHour}:${formattedMinute}`;
}

function playAlarm() {
    const alarmSound = new Audio("./assets/media/alarm.mp3");
    alarmSound.play();
    timeDisplay.classList.toggle("green");
    
    //I looked up on W3 how to use setTimeout so the h1 would be green for the 
    //duration of the alarm sound
    setTimeout(() => {
        timeDisplay.classList.remove("green");
    }, 8500);
    alarmSet = false;
}

setInterval(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    timeDisplay.textContent = `${hours}:${minutes}`;

//I had to look up how to split up this following line by operators
    if (
        alarmSet && 
        `${hours}:${minutes}` === alarmTime && 
        alarmDate && 
        now >= alarmDate
    ) {
        playAlarm();
    }
}, 1000);


/* - - - - - - - - - - - - - - - - - - - -  - - - - - */
/* I used chatGPT for help for the following section */
/* - - - - - - - - - - - - - - - - - - - - - - - - - */
inputs.forEach(input => {
    input.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/\D/g, '');
        if (event.target.value.length > 2) {
            event.target.value = event.target.value.slice(0, 2); 
        }
    });
});

setAlarmButton.addEventListener("click", () => {
    const hourValue = hourInput.value.trim();
    const minuteValue = minuteInput.value.trim();

    if (!validateTime(hourValue, minuteValue)) {
        clearInputs();
        return;
    }

    const hour = parseInt(hourValue, 10);
    const minute = parseInt(minuteValue, 10);

    if (!isValidHour(hour) || !isValidMinute(minute)) {
        clearInputs();
        return;
    }

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    let scheduledAlarmDate = calculateAlarmDate(hour, minute);
    if (hour === currentHours && minute === currentMinutes) {
        scheduledAlarmDate.setDate(scheduledAlarmDate.getDate() + 1);
    }

    alarmDate = scheduledAlarmDate; 
    alarmTime = formatTime(hour, minute);
    setAlarm(alarmTime);
    alarmSet = true;
    errorMessage.textContent = ""; 
    clearInputs();
});

function validateTime(hourValue, minuteValue) {
    const numberRegex = /^\d{1,2}$/;

    if (!numberRegex.test(hourValue) || !numberRegex.test(minuteValue)) {
        errorMessage.textContent = "Please enter only numbers for HH and MM.";
        return false;
    }
    return true;
}

function isValidHour(hour) {
    if (hour < 0 || hour > 23) {
        errorMessage.textContent = "Hour must be between 0 and 23.";
        return false;
    }
    return true;
}

function isValidMinute(minute) {
    if (minute < 0 || minute > 59) {
        errorMessage.textContent = "Minutes must be between 0 and 59.";
        return false;
    }
    return true;
}

function calculateAlarmDate(hour, minute) {
    const now = new Date();
    let alarmDate = new Date();
    alarmDate.setHours(hour, minute, 0, 0); 

    if (alarmDate.getTime() <= now.getTime()) {
        alarmDate.setDate(alarmDate.getDate() + 1);
    }

    return alarmDate;
}