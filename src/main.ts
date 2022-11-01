import dayjs from 'dayjs';
import {v4 as uuidv4} from 'uuid';
import CircleSlider from "circle-slider";

const addTaskButton = document.querySelector<HTMLButtonElement>(".add-task")!
const titleInput = document.querySelector<HTMLInputElement>(".title-input")!
const taskContainer = document.querySelector("ul")!

interface Task {
    id: string,
    title: string,
    done: string
}

const saveTasksToLocalStorage = (tasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

let tasks: Task[] = [];
tasks = JSON.parse(localStorage.getItem("tasks") || '[]');

const addTask = (value: string) => {
    if (value.length < 1) {
        return;
    }
    tasks = JSON.parse(localStorage.getItem("tasks") || '[]');

    const taskProperties: Task = {
        id: uuidv4(),
        title: "",
        done: ""
    }
    taskProperties.title = value;
    tasks.push(taskProperties);
    saveTasksToLocalStorage(tasks);
    getTaskFromArray();
    checkIfTaskDone();
    calculatePercent();
    titleInput.value = "";
}

titleInput.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "Enter")
        addTask(titleInput.value)
})

const deleteTask = () => {
    const deleteTaskButton = document.querySelectorAll<HTMLButtonElement>(".delete")!;
    deleteTaskButton.forEach(element => {
        const task = element.parentElement!;
        element.addEventListener("click", () => {
            const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks") || '[]')
            const taskIndex: number = tasksFromLocalStorage.findIndex((element: { id: string; }) => element.id === task.id);
            tasksFromLocalStorage.splice(taskIndex, 1);
            localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));
            task.remove();
            calculatePercent()
        })
    });
}

const getTaskFromArray = () => {
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks") || '[]')
    taskContainer.innerHTML = tasksFromLocalStorage.map((task: Task) => {
        return `
            <li id="${task.id}" class="task${task.id}">
                <div>
                    <label class="checkbox-container">
                        <input class="${task.id} check" type="checkbox"${task.done} />
                        <span></span>
                    </label>
                    <p class="title">${task.title}</p>
                </div>
                <button class="delete">x</button>
            </li>`
    }).join("");
    deleteTask();
}
getTaskFromArray();

const toggleMode = () => {
    const toggle = document.querySelector(".slider")!;
    const whiteNightBtns = document.querySelectorAll<HTMLButtonElement>(".night")!;
    const whiteNightP = document.querySelectorAll<HTMLParagraphElement>(".nightP")!;

    toggle.addEventListener("click", () => {
        document.querySelector("body")!.classList.toggle("night");
        toggle.classList.toggle("night");
        document.querySelector(".title-input")!.classList.toggle("input-night");
        if (toggle.classList.contains("night")) {
            for (let i = 0; i < whiteNightBtns.length; i++) { whiteNightBtns[i].style.color = "white"}
            for (let i = 0; i < whiteNightP.length; i++) { whiteNightP[i].style.color = "white"}

            document.querySelector<HTMLParagraphElement>(".time")!.style.borderImageSource = "linear-gradient(89.97deg, #fff 30.27%, rgba(217, 217, 217, 0) 99.98%)"
            document.querySelector<HTMLParagraphElement>(".mode-info")!.textContent = "Mode: Night"
            document.querySelector<HTMLImageElement>(".day-time-icon")!.src = "night.svg"
            document.querySelector("body")!.style.backgroundImage = "url('night-bgimg.png')"
            document.querySelector<HTMLImageElement>(".plus")!.src = "plus-night.svg"
        } else {
            for (let i = 0; i < whiteNightBtns.length; i++) { whiteNightBtns[i].style.color = "#6C6B6B"}
            for (let i = 0; i < whiteNightP.length; i++) { whiteNightP[i].style.color = "#6C6B6B"}

            document.querySelector<HTMLParagraphElement>(".time")!.style.borderImageSource = "linear-gradient(89.97deg, #6C6C6B 30.27%, rgba(217, 217, 217, 0) 99.98%)"
            document.querySelector<HTMLParagraphElement>(".mode-info")!.textContent = "Mode: Day"
            document.querySelector<HTMLImageElement>(".day-time-icon")!.src = "day.svg"
            document.querySelector("body")!.style.backgroundImage = "url('day-bgimg.png')"
            document.querySelector<HTMLImageElement>(".plus")!.src = "plus-day.svg"
        }
    })
}
toggleMode();

const checkIfTaskDone = () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>(".check");

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", () => {
            tasks = JSON.parse(localStorage.getItem("tasks") || '[]');
            const checkboxID = checkboxes[i].classList[0];
            const index = tasks.findIndex(element => element.id === checkboxID);

            if (checkboxes[i].checked) {
                tasks[index].done = "checked";
            } else {
                tasks[index].done = "";
            }
            localStorage.setItem("tasks", JSON.stringify(tasks));
            calculatePercent();
        })
    }
}
checkIfTaskDone();

const calculatePercent = () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>(".check");
    const displayPercent = document.querySelector<HTMLParagraphElement>(".percent-done")!;
    let checkedLength: number = 0;

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkedLength++;
        }
    }

    if (checkedLength === 0) {
        displayPercent.textContent = "0%";
        return;
    }

    displayPercent.textContent = `${Math.floor((checkedLength/checkboxes.length) * 100)}%`
}
calculatePercent();

const getFullScreen = () => {
    const fullscreenButton = document.querySelector(".fullscreen")!;

    fullscreenButton.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    })
}
getFullScreen();

const getHour = () => {
    const displayedTime = document.querySelector<HTMLParagraphElement>(".time")!;
    let hour = dayjs().hour()
    let minute = dayjs().minute()

    if (hour < 10 && minute >= 10) {
        displayedTime.textContent = `0${hour}:${minute}`
    } else if (hour < 10 && minute < 10) {
        displayedTime.textContent = `0${hour}:0${minute}`
    } else if (minute < 10 && hour >= 10) {
        displayedTime.textContent = `${hour}:0${minute}`
    } else {
        displayedTime.textContent = `${hour}:${minute}`
    }

}
setInterval(getHour, 500)

const getTime = () => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Satuday"]

    const weekday = document.querySelector<HTMLParagraphElement>(".weekday")!;
    const date = document.querySelector<HTMLParagraphElement>(".date")!;

    weekday.textContent = weekdays[dayjs().day()]
    date.textContent = `Today ${dayjs().date()}/${dayjs().month()}`
}
getTime();


const getTimer = () => {
    const sliderMinutes = document.querySelector<HTMLParagraphElement>(".slider-minutes")!;
    const timerStartButton = document.querySelector<HTMLButtonElement>(".timer-start")!;
    const timerResetButton = document.querySelector<HTMLButtonElement>(".timer-reset")!;
    const pomodoroButton = document.querySelector<HTMLButtonElement>(".pomodoro")!;
    const shortBreakButton = document.querySelector<HTMLButtonElement>(".short-break")!;
    const longBreakButton = document.querySelector<HTMLButtonElement>(".long-break")!;


    let interval: number;
    let minutes: number = 50;
    let seconds: number = 0;

    sliderMinutes.textContent = `${minutes}:0${seconds}`

    const reset = () => {
        clearInterval(interval)
        minutes = 0;
        seconds = 0;
        cs.setAngle(0)

        sliderMinutes.style.fontSize = "40px"
        sliderMinutes.textContent = `Let's get to work!`;
    }


    timerStartButton.addEventListener("click", () => {
        clearInterval(interval);
        if (seconds === 0 && minutes === 1) {
            sliderMinutes.style.fontSize = "40px"
            sliderMinutes.textContent = `You have to set the time!`;

            return;
        }
        timerStartButton.disabled = true;
        interval = setInterval(startTimer, 1000)
    })

    timerResetButton.addEventListener("click", () => {
        timerStartButton.disabled = false;
        if (minutes === 0 && seconds === 0)
            return;

        reset();
    })


    pomodoroButton.addEventListener("click", () => {
        timerStartButton.disabled = false;
        reset();

        minutes = 50;
        seconds = 0

        sliderMinutes.style.fontSize = "60px"
        sliderMinutes.textContent = `${minutes}:0${seconds}`
    })

    shortBreakButton.addEventListener("click", () => {
        timerStartButton.disabled = false;
        reset();

        minutes = 5;
        seconds = 0;

        sliderMinutes.style.fontSize = "60px"
        sliderMinutes.textContent = `0${minutes}:0${seconds}`
    })

    longBreakButton.addEventListener("click", () => {
        timerStartButton.disabled = false;
        reset()

        minutes = 15;
        seconds = 0;

        sliderMinutes.style.fontSize = "60px"
        sliderMinutes.textContent = `${minutes}:0${seconds}`
    })

    // circle slider
    const options = {
        snap: 5,
        clockwise: true,
        startPos: "top",
      };

    const cs = new CircleSlider("#slider", options);

    cs.on("sliderMove", (angle: any) => {
        timerStartButton.disabled = false;
        if (angle === 0) {
            angle = 1;
        }
        minutes = 0;
        seconds = 0;
        clearInterval(interval)
        minutes = angle;
        sliderMinutes.textContent = `${minutes}:00`;
    })

    const startTimer = () => {
        sliderMinutes.style.fontSize = "60px"

        if (seconds === 0) {
            minutes--;
            seconds = 60;
        }
        seconds--

        if (seconds <= 0 && minutes <= 0) {
            clearInterval(interval);
            minutes = 0
            seconds = 0;
            sliderMinutes.style.fontSize = "40px"
            sliderMinutes.textContent = "U did it!!"
            document.querySelector<HTMLAudioElement>(".done")!.play()
            return;
        }

        if (minutes < 10 && seconds >= 10) {
            sliderMinutes.textContent = `0${minutes}:${seconds}`
        } else if (minutes < 10 && seconds < 10) {
            sliderMinutes.textContent = `0${minutes}:0${seconds}`
        } else if (seconds < 10 && minutes >= 10) {
            sliderMinutes.textContent = `${minutes}:0${seconds}`
        } else {
            sliderMinutes.textContent = `${minutes}:${seconds}`
        }
    }
}
getTimer()

addTaskButton.addEventListener("click", () => {
    addTask(titleInput.value);
})