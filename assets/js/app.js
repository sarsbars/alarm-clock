'use strict';

const form = document.querySelector("form");
const hourInput = form.querySelector("input:nth-of-type(1)");
const minuteInput = form.querySelector("input:nth-of-type(2)");
const setAlarmButton = form.querySelector("button");
const inputs = [hourInput, minuteInput];
const displayAlarm = document.querySelector(".displayAlarm p");

let alarmSet = false;
let alarmTime = "";
/* - - - - - - - - - - - - - - - - - - - - - */
/* - - - Functions - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - - - */

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
}

setInterval(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    document.querySelector("h1").textContent = `${hours}:${minutes}`;

    if (alarmSet && `${hours}:${minutes}` === alarmTime) {
        playAlarm();
    }
}, 1000); 



/* - - - - - - - - - - - - - - - - - - - -  - - - - - */
/* I used chatGPT for help for the following section */
/* - - - - - - - - - - - - - - - - - - - - - - - - - */
inputs.forEach(input => {
    input.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/\D/g, ''); // Allow only digits
        if (event.target.value.length > 2) {
            event.target.value = event.target.value.slice(0, 2); // Limit input to two characters
        }
    });
});

setAlarmButton.addEventListener("click", () => {
    const hourValue = hourInput.value.trim();
    const minuteValue = minuteInput.value.trim();
    const numberRegex = /^\d{1,2}$/;

    if (!numberRegex.test(hourValue) || !numberRegex.test(minuteValue)) {
        alert("Please enter only numbers (1-2 digits) for HH and MM.");
        clearInputs();
        return;
    }

    const hour = parseInt(hourValue, 10);
    const minute = parseInt(minuteValue, 10);

    if (hour < 0 || hour > 23) {
        alert("Hour must be between 0 and 23.");
        return;
    }

    if (minute < 0 || minute > 59) {
        alert("Minutes must be between 0 and 59.");
        return;
    }
    alarmTime = formatTime(hour, minute);
    setAlarm(alarmTime);
    alarmSet = true;
    clearInputs();
});
