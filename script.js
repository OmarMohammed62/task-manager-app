let taskInput = document.getElementById("taskInput");
let addTaskBtn = document.getElementById("addTaskBtn");
let searchInput = document.getElementById("searchInput");
let filterTasks = document.getElementById("filterTasks");
let taskList = document.getElementById("taskList");
let totalTasks = document.getElementById("totalTasks");
let completedTasks = document.getElementById("completedTasks");
let pendingTasks = document.getElementById("pendingTasks");

let tasks = [];

let editingTaskId = null;

function addTask(){
    let taskText = taskInput.value.trim();

    if (taskText === ""){
        return;
    }

    if (editingTaskId !== null){

        let task = tasks.find(function(item){
            return item.id === editingTaskId;
        });

        task.text = taskText;
        editingTaskId = null;
        addTaskBtn.textContent = "Add Task";

    } else {

        let task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(task);
    }

    taskInput.value = "";
    displayTasks();
    saveTasks();
}

function displayTasks(tasksToDisplay = tasks){
    taskList.innerHTML = "";
    tasksToDisplay.forEach(function(task){
        let taskElement = document.createElement("div");
        taskElement.classList.add("task-item");
        taskElement.innerHTML = `<span class="${task.completed ? 'completed' : ''}">${task.text}</span> <button class="complete-btn">Complete</button>
        <button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button>`;

        let completeBtn = taskElement.querySelector(".complete-btn");
        completeBtn.addEventListener("click", function(){
            task.completed =! task.completed;
            saveTasks();
            displayTasks();
        });

        let editBtn = taskElement.querySelector(".edit-btn");

        editBtn.addEventListener("click", function(){

           taskInput.value = task.text;

            editingTaskId = task.id;

            addTaskBtn.textContent = "Update Task";

            taskInput.focus();

        }); 
        let deleteBtn = taskElement.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function(){
            tasks = tasks.filter(function(item){
                return item.id !== task.id;
            });
            saveTasks();
            displayTasks();
        });
        taskList.appendChild(taskElement);
    });
    updateStats()
}

function updateStats(){

    totalTasks.textContent = tasks.length;

    completedTasks.textContent = tasks.filter(function(task){
        return task.completed;
    }).length;

    pendingTasks.textContent = tasks.filter(function(task){
        return !task.completed;
    }).length;

}

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function loadTasks(){
    let saveTasks = localStorage.getItem("tasks");
    if (saveTasks !== null){
        tasks = JSON.parse(saveTasks);
    }
    displayTasks();
}

function searchTasks(){

    let searchText = searchInput.value.toLowerCase();

    let filterValue = filterTasks.value;

    let filteredTasks = tasks.filter(function(task){

        let matchesSearch = task.text.toLowerCase().includes(searchText);

        let matchesFilter = 
            filterValue === "all" ||
            (filterValue === "completed" && task.completed) ||
            (filterValue === "pending" && !task.completed);

        return matchesSearch && matchesFilter;

    });

    displayTasks(filteredTasks);
}

addTaskBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", searchTasks);
filterTasks.addEventListener("change", searchTasks);
loadTasks();

