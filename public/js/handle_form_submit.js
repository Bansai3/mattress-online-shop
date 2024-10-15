const taskInput = document.querySelector(".task_input input"),
    states = document.querySelectorAll(".states span"),
    clearAll = document.querySelector(".clear_button"),
    taskBox = document.querySelector(".task_box");

let editId, isEditTask = false, tasks_to_do = JSON.parse(localStorage.getItem("todo-list"));

states.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function handleFormSubmit(event) {
    event.preventDefault();
    const userTask = taskInput.value.trim();

    if (userTask) {
        if (!isEditTask) {
            tasks_to_do = !tasks_to_do ? [] : tasks_to_do;
            let taskInfo = { name: userTask, status: "pending" };
            tasks_to_do.push(taskInfo);
        } else {
            isEditTask = false;
            tasks_to_do[editId].name = userTask;
        }
        todoForm.reset();
        localStorage.setItem("todo-list", JSON.stringify(tasks_to_do));
        showTodo(document.querySelector("span.active").id);
        showtasks();
    }
}

function showtasks() {
    let liTag = "";
    if (tasks_to_do) {
        tasks_to_do.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            liTag += `<li class="task">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                            <p class="${completed}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                <li onclick='deleteTask(${id}, "${document.querySelector("span.active").id}")'><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </li>`;
        });
    }
    tasksContainer.innerHTML = liTag || `<span>На данный момент заданий нет</span>`;
}

function showTodo(filter) {
    let liTag = "";
    if(tasks_to_do) {
        tasks_to_do.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>На данный момент заданий нет</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.classList.add("overflow");
}
showTodo("all");

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        tasks_to_do[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        tasks_to_do[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(tasks_to_do))
}

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    tasks_to_do.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(tasks_to_do));
    showTodo(filter);
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    tasks_to_do.splice(0, tasks_to_do.length);
    localStorage.setItem("todo-list", JSON.stringify(tasks_to_do));
    showTodo()
});
