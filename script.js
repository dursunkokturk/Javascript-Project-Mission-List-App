
"use strict";
        
let missionList = [];

if (localStorage.getItem("missionList") !== null) {
    missionList = JSON.parse(localStorage.getItem("missionList"));
}

let editId;
let isEditTask = false;

const taskInput = document.querySelector("#txtTaskName");
const btnClear = document.querySelector("#btnClear");
const filters = document.querySelectorAll(".filters span")

displayTasks("all");

function displayTasks(filter) {
    let ul = document.getElementById("task-list");
    ul.innerHTML = "";

    if (missionList.length == 0) {
        ul.innerHTML = "<p class='p-3 m-0'>Mission List is Empty</p>"
    } else {
        for(let mission of missionList) {
            let completed = mission.situation == "completed" ? "checked": "";
            if (filter == mission.situation || filter == "all") {
                let li = `
                    <li class="task list-group-item">
                        <div class="form-check">
                            <input type="checkbox" onclick="updateStatus(this)" id="${mission.id}" class="form-check-input" ${completed}>
                            <label for="${mission.id}" class="form-check-label ${completed}">${mission.missionName}</label>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-ellipsis"></i>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a onclick="deleteTask(${mission.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Clear</a></li>
                                <li><a onclick='editTask(${mission.id}, "${mission.missionName}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Edit</a></li>
                            </ul>
                        </div>
                    </li>
                `;
                ul.insertAdjacentHTML("beforeend", li);           
            }
        }
    }
}

document.querySelector("#btnAddNewTask").addEventListener("click", newTask);
document.querySelector("#btnAddNewTask").addEventListener("keypress", function(){
    if (event.key == "Enter") {
        document.getElementById("btnAddNewTask").click();
    }
});

for(let span of filters) {
    span.addEventListener("click", function() {
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    })
}

function newTask(event) {
    if(taskInput.value == "") {
        alert("Please Enter A Mission");
    } else {
        if(!isEditTask) {
            // add
            missionList.push({
                "id": missionList.length + 1, 
                "missionName": taskInput.value, 
                "situation": "pending"
            });
        } else {
            // update
            for(let mission of missionList) {
                if(mission.id == editId) {
                    mission.missionName = taskInput.value;
                }
                isEditTask = false;
            }
        }
        taskInput.value = "";
        displayTasks(document.querySelector("span.active").id);

        // Mission List Icinde Ekleme Islemi Yapiyoruz
        localStorage.setItem("missionList", JSON.stringify(missionList));
    }
    event.preventDefault();
}       

function deleteTask(id) {
    let deletedId;
    for(let index in missionList) {
        if(missionList[index].id == id) {
            deletedId = index;
        }
    }
    missionList.splice(deletedId, 1);
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("missionList", JSON.stringify(missionList));
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");

    console.log("edit id:", editId);
    console.log("edit mode", isEditTask);
}

btnClear.addEventListener("click", function() {
    missionList.splice(0, missionList.length);
    localStorage.setItem("gorevListesi", JSON.stringify(missionList));
    displayTasks();
})

function updateStatus(selectedTask) {
    // console.log(selectedTask.parentElement.lastElementChild);
    let label = selectedTask.nextElementSibling;
    let situation;

    if(selectedTask.checked) {
        label.classList.add("checked");
        situation = "completed";
    } else {
        label.classList.remove("checked");
        situation = "pending";
    }

    for (let mission of missionList) {
        if(mission.id == selectedTask.id) {
            mission.situation = situation;
        }
    }

    displayTasks(document.querySelector("span.active").id);

    localStorage.setItem("missionList", JSON.stringify(missionList));
}