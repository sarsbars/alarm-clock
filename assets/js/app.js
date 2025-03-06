'use strict';

const form = document.querySelector("form");
const hourInput = form.querySelector("input:nth-of-type(1)");
const minuteInput = form.querySelector("input:nth-of-type(2)");
const setAlarmButton = form.querySelector("button");
const inputs = [hourInput, minuteInput];
const displayAlarm = document.querySelector(".displayAlarm p");
const h1 = document.querySelector("h1");
const errorMessage = document.querySelector(".error-message");

let alarmSet = false;
let alarmTime = "";

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
    h1.classList.toggle("green");
    
    //I looked up on W3 how to use setTimeout so the h1 would be green for the 
    //duration of the alarm sound
    setTimeout(() => {
        h1.classList.remove("green");
    }, 8500);
    alarmSet = false;
}

setInterval(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    h1.textContent = `${hours}:${minutes}`;

    if (alarmSet && `${hours}:${minutes}` === alarmTime) {
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
    const numberRegex = /^\d{1,2}$/;

    if (!numberRegex.test(hourValue) || !numberRegex.test(minuteValue)) {
        errorMessage.textContent = "Please enter only numbers for HH and MM.";
        clearInputs();
        return;
    }

    const hour = parseInt(hourValue, 10);
    const minute = parseInt(minuteValue, 10);

    if (hour < 0 || hour > 23) {
        errorMessage.textContent = "Hour must be between 0 and 23.";
        return;
    }

    if (minute < 0 || minute > 59) {
        errorMessage.textContent = "Minutes must be between 0 and 59.";
        return;
    }

    const now = new Date();
    let alarmDate = new Date();
    alarmDate.setHours(hour, minute, 0, 0);

    if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
    }

    errorMessage.textContent = "";
    alarmTime = formatTime(hour, minute);
    setAlarm(alarmTime);
    alarmSet = true;
    clearInputs();
});
