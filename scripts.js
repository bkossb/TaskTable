submitButton = document.getElementById("addButton");
tableData = document.getElementById("tableData");
sortButton = document.getElementById("sortByTaskName");
paginationValue = document.getElementById("paginationValue");
numberOfRows = document.getElementById("numberOfRows");
rowsFromDisplay = document.getElementById("rowsFrom");
rowsToDisplay = document.getElementById("rowsTo");
taskName = document.getElementById("inputField");
priority = document.getElementById("priority");
inputMessage = document.getElementById("inputMessage");
message = document.getElementById("message");
form = document.getElementById("form");

var numberRowsPerPage = 5;
var taskData = new Array();
var actualPage = 1;


init();

function init() {

    taskData = getLocalStorage();
    createTable();

    sortButton.addEventListener("click", function () {
        sortTable();
        getPage(actualPage, numberRowsPerPage);
    });
    paginationValue.addEventListener("change", function () {
        setPagination(Number(paginationValue.value));
    });
    setPagination(numberRowsPerPage);
}

function setPagination(paginationValue) {
    var row = document.querySelectorAll("#tableDataRow");
    numberRowsPerPage = paginationValue;
    for (var i = 0; i < taskData.length; i++) {
        row[i].style.display = "none";
    }
    getPage(actualPage, numberRowsPerPage);
}

function validate() {
    if (taskName.value === "" || priority.value === "") {
        message.style.visibility = "visible";
        message.classList.add("error");
        message.textContent = "Task name and priority is required";
        if (taskName.value === "") {
            taskName.style.border = "2px solid red";
        }
        if (priority.value === "") {
            priority.style.border = "2px solid red";
        }
        return false;
    } else {
        message.style.visibility = "visible";
        message.classList.remove("error");
        priority.style.removeProperty("border");
        taskName.style.removeProperty("border");
        message.classList.add("success");
        message.textContent = "Task add to list";
        setInterval(function () {
            message.style.visibility = "hidden";
        }, 3000)
        return true;
    }

}

submitButton.addEventListener("click", function () {
    createNewTask();
})

function createNewTask() {
    if (validate(this)) {
        var task = new Task(taskName.value, priority.value);
        addDataToLocalStorage(task);
        taskName.value = "";
        priority.value = "";
    }
}

function getLocalStorage() {
    var localStorageItem = JSON.parse(localStorage.getItem('taskList'));
    return localStorageItem == null ? [] : localStorageItem;
}

function addDataToLocalStorage(task) {
    taskData.unshift(task);
    localStorage.setItem("taskList", JSON.stringify(taskData));
    addRowToTable(task);
    getPage(actualPage, numberRowsPerPage);
}

function removeDataFromLocalStorage(rowId) {
    taskData.splice(rowId - 1, 1);
    localStorage.setItem("taskList", JSON.stringify(taskData));
    removeRowFromTable(rowId);
    getPage(actualPage, numberRowsPerPage);
    message.style.visibility = "visible";
    message.classList.add("delete");
    message.textContent = "Task removed";
    setInterval(function () {
        message.style.visibility = "hidden";
        message.classList.remove("delete");
    }, 3000);
}

function Task(taskName, priority) {
    this.taskName = taskName;
    this.priority = priority;
}

function addRowToTable(task) {
    var row = tableData.insertRow(1);

    var cell = row.insertCell(0);
    var textNode = document.createTextNode(task.taskName);
    cell.appendChild(textNode);
    var bin = document.createElement("span");
    var x = document.createElement("span");
    x.innerText = "X";
    x.setAttribute("class", "xIconBin")
    bin.appendChild(x);
    bin.setAttribute("class", "bin");
    cell.appendChild(bin);
    cell.addEventListener("click", function () {
        removeDataFromLocalStorage(row.rowIndex)
    });

    cell.addEventListener("mouseover", function () {
        bin.style.opacity = "1";
        row.style.backgroundColor = "#d4d4d4"
    })
    cell.addEventListener("mouseout", function () {
        bin.style.opacity = "0";
        row.style.backgroundColor = "white"

    })
    var cell = row.insertCell(1);
    var textNode = document.createTextNode(task.priority);
    cell.appendChild(textNode);

    cell = row.insertCell(2);
    var el = document.createElement("label");
    el.setAttribute("class", "checkboxContainer");
    var input = document.createElement("input");
    input.type = "checkbox";
    var span = document.createElement("span");
    span.setAttribute("class", "checkmark");
    el.appendChild(input);
    el.appendChild(span);
    cell.appendChild(el);

    row.setAttribute("id", "tableDataRow");
}

function removeRowFromTable(rowId) {
    tableData.deleteRow(rowId);
}

function createTable() {
    for (var i = taskData.length - 1; i >= 0; i--) {
        addRowToTable(taskData[i]);
    }
}

var sortIcon = document.getElementById("sortIcon");

function sortTable() {
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;


    dir = "asc";
    sortIcon.classList.remove("sortIconDown");
    sortIcon.classList.add("sortIconUp");
    taskData.sort(function (a, b) {
        if (a.taskName < b.taskName) return -1;
        if (a.taskName > b.taskName) return 1;
        return 0;
    });
    while (switching) {
        switching = false;
        rows = tableData.getElementsByTagName("tr");
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[0];
            y = rows[i + 1].getElementsByTagName("td")[0];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;

        } else {
            if (switchcount == 0 && dir == "asc") {
                taskData.reverse();
                dir = "desc";
                switching = true;
                sortIcon.classList.remove("sortIconUp");
                sortIcon.classList.add("sortIconDown");
            }
        }
    }
}

function setDisplay(startIndex, numberRows) {
    if (startIndex < taskData.length) {
        if (taskData.length === 0) {
            rowsFromDisplay.textContent = 0;
        } else {
            rowsFromDisplay.textContent = startIndex - numberRows + 1;
        }
        rowsToDisplay.textContent = startIndex;
        numberOfRows.textContent = taskData.length;
    } else {
        if (taskData.length === 0) {
            rowsFromDisplay.textContent = 0;
        } else {
            rowsFromDisplay.textContent = startIndex - numberRows + 1;

        }
        rowsToDisplay.textContent = taskData.length;
        numberOfRows.textContent = taskData.length;
    }
}


function getPage(actualPage, numberRows) {
    var row = document.querySelectorAll("#tableDataRow");
    var startIndex = numberRows * (actualPage - 1);

    for (; startIndex < numberRows * actualPage; startIndex++) {
        if (row[startIndex] != null) {
            row[startIndex].style.display = "";

        }
        if (row[startIndex + numberRows] != null) {
            row[startIndex + numberRows].style.display = "none";
        }
        if (row[startIndex - numberRows] != null) {
            row[startIndex - numberRows].style.display = "none";
        }
    }
    setDisplay(startIndex, numberRows);


}

function getNextPage() {
    if (actualPage < taskData.length / numberRowsPerPage) {
        actualPage++;
        getPage(actualPage, numberRowsPerPage);
    }

}

function getPrevPage() {
    if (actualPage > 1) {
        actualPage--;
        getPage(actualPage, numberRowsPerPage);
    }
}

rowsFrom = document.getElementById("rowsFrom");
rowsTo = document.getElementById("rowsTo");
prevPageButton = document.getElementById("prevPage");
nextPageButton = document.getElementById("nextPage");

prevPageButton.addEventListener("click", function () {
    getPrevPage();
});

nextPageButton.addEventListener("click", function () {
    getNextPage();
});

