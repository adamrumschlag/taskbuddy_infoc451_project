function displayTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskTableBody = document.getElementById("taskTableBody");

    // Clear Table To Prevent Duplicates
    taskTableBody.innerHTML = "";

    tasks.forEach((task, index) => {
        const row = document.createElement("tr");

        // Due Date Check
        const currentDate = new Date();
        const dueDate = new Date(task.dueDate);
        const timeDifference = dueDate - currentDate;
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference < -1) {
            row.classList.add("past-due");
        } else if (daysDifference <= 3) {
            row.classList.add("due-soon");
        }

        // Insert Into Table
        row.innerHTML = `
            <td><span class="view-mode">${task.name}</span><input class="edit-mode" type="text" value="${task.name}" style="display:none"></td>
            <td><span class="view-mode">${task.assignee}</span><input class="edit-mode" type="text" value="${task.assignee}" style="display:none"></td>
            <td><span class="view-mode">${task.dueDate}</span><input class="edit-mode" type="date" value="${task.dueDate}" style="display:none"></td>
            <td><span class="view-mode">${task.description}</span><input class="edit-mode" type="text" value="${task.description}" style="display:none"></td>
            <td>
                <button onclick="editTask(${index})" id="btn-edit" class="edit-button">Edit</button>
                <button onclick="saveTask(${index})" id="btn-save" class="save-button" style="display:none">Save</button>
                <button onclick="deleteTask(${index})" id="btn-delete" class="delete-button">Delete</button>
            </td>
        `;

        taskTableBody.appendChild(row);
    });
}

// Editing
function editTask(index) {
    const row = document.querySelector(`#taskTableBody tr:nth-child(${index + 1})`);
    row.querySelectorAll(".view-mode").forEach(el => el.style.display = "none"); 
    row.querySelectorAll(".edit-mode").forEach(el => el.style.display = "inline"); 
    row.querySelector(".edit-button").style.display = "none"; 
    row.querySelector(".save-button").style.display = "inline"; 
}

// Save When Editing
function saveTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    const row = document.querySelector(`#taskTableBody tr:nth-child(${index + 1})`);
    const updatedName = row.querySelectorAll(".edit-mode")[0].value;
    const updatedAssignee = row.querySelectorAll(".edit-mode")[1].value;
    const updatedDueDate = row.querySelectorAll(".edit-mode")[2].value;
    const updatedDescription = row.querySelectorAll(".edit-mode")[3].value;

    // Update The Task
    tasks[index] = {
        name: updatedName,
        assignee: updatedAssignee,
        dueDate: updatedDueDate,
        description: updatedDescription
    };

    // Save The Updates
    localStorage.setItem("tasks", JSON.stringify(tasks));

    row.classList.remove("editing");

    // Refresh The Display
    displayTasks();
}

// Add To Local Storage
function saveNewTask(event) {
    event.preventDefault();

    // Get Form Data
    const name = document.getElementById("name").value;
    const assignee = document.getElementById("assignee").value;
    const dueDate = document.getElementById("dueDate").value;
    const description = document.getElementById("description").value;

    const newTask = { name, assignee, dueDate, description };

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(newTask); 
    localStorage.setItem("tasks", JSON.stringify(tasks)); 

    window.location.href = "index.html";
}

// Delete Task
function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

// Load Tasks
if (window.location.pathname.includes("index.html")) {
    document.addEventListener("DOMContentLoaded", displayTasks);
}
