let students = JSON.parse(localStorage.getItem("students")) || [];
let selectedStudentIndex = null;

function addStudent() {
    let name = prompt("Enter student name:");
    let marks = [];
    let numSubjects = parseInt(prompt("Enter number of subjects:"));

    for (let i = 0; i < numSubjects; i++) {
        marks.push(parseInt(prompt("Enter marks for subject " + (i + 1) + ":")));
    }

    let student = { name, marks };

    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    displayStudents();
}

function displayMarksheet() {
    let studentsContainer = document.getElementById("students-container");
    studentsContainer.innerHTML = "";

    if (students.length === 0) {
        studentsContainer.textContent = "No students found!";
        return;
    }

    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    let headerRow = document.createElement("tr");
    headerRow.innerHTML = `<th>Name</th>`;
    let maxSubjects = Math.max(...students.map(student => student.marks.length));
    for (let i = 1; i <= maxSubjects; i++) {
        headerRow.innerHTML += `<th>Subject ${i}</th>`;
    }
    headerRow.innerHTML += `<th>Total Marks</th><th>Average</th><th>Grade</th>`;
    thead.appendChild(headerRow);

    students.forEach(student => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${student.name}</td>`;
        student.marks.forEach(mark => {
            row.innerHTML += `<td>${mark}</td>`;
        });
        for (let i = student.marks.length; i < maxSubjects; i++) {
            row.innerHTML += `<td></td>`;
        }
        row.innerHTML += `
            <td>${student.marks.reduce((a, b) => a + b, 0)}</td>
            <td>${Math.round(student.marks.reduce((a, b) => a + b, 0) / student.marks.length)}</td>
            <td>${getGrade(Math.round(student.marks.reduce((a, b) => a + b, 0) / student.marks.length))}</td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    studentsContainer.appendChild(table);
}

function showSearchStudent() {
    document.getElementById("search-student-container").style.display = "block";
}

function searchStudent() {
    let name = document.getElementById("search-student-name").value;
    let foundStudent = students.find(student => student.name === name);

    let studentsContainer = document.getElementById("students-container");
    studentsContainer.innerHTML = "";

    if (foundStudent) {
        let table = document.createElement("table");
        let thead = document.createElement("thead");
        let tbody = document.createElement("tbody");

        let headerRow = document.createElement("tr");
        headerRow.innerHTML = `<th>Name</th>`;
        foundStudent.marks.forEach((_, index) => {
            headerRow.innerHTML += `<th>Subject ${index + 1}</th>`;
        });
        thead.appendChild(headerRow);

        let marksRow = document.createElement("tr");
        marksRow.innerHTML = `<td>${foundStudent.name}</td>`;
        foundStudent.marks.forEach(mark => {
            marksRow.innerHTML += `<td>${mark}</td>`;
        });
        tbody.appendChild(marksRow);

        let totalRow = document.createElement("tr");
        totalRow.innerHTML = `<td>Total Marks:</td><td colspan="${foundStudent.marks.length}">${foundStudent.marks.reduce((a, b) => a + b, 0)}</td>`;
        tbody.appendChild(totalRow);

        let averageRow = document.createElement("tr");
        averageRow.innerHTML = `<td>Average:</td><td colspan="${foundStudent.marks.length}">${Math.round(foundStudent.marks.reduce((a, b) => a + b, 0) / foundStudent.marks.length)}</td>`;
        tbody.appendChild(averageRow);

        let gradeRow = document.createElement("tr");
        gradeRow.innerHTML = `<td>Grade:</td><td colspan="${foundStudent.marks.length}">${getGrade(Math.round(foundStudent.marks.reduce((a, b) => a + b, 0) / foundStudent.marks.length))}</td>`;
        tbody.appendChild(gradeRow);

        table.appendChild(thead);
        table.appendChild(tbody);
        studentsContainer.appendChild(table);
    } else {
        studentsContainer.textContent = "Student not found!";
    }
}

function showStudents() {
    let studentsContainer = document.getElementById("students-container");
    studentsContainer.innerHTML = "";

    if (students.length === 0) {
        studentsContainer.textContent = "No students found!";
        return;
    }

    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    let headerRow = document.createElement("tr");
    headerRow.innerHTML = `<th>Name</th><th>Average</th><th>Grade</th>`;
    thead.appendChild(headerRow);

    students.forEach((student, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td><a href="#" onclick="showStudentDetails(${index})">${student.name}</a></td>
            <td>${Math.round(student.marks.reduce((a, b) => a + b, 0) / student.marks.length)}</td>
            <td>${getGrade(Math.round(student.marks.reduce((a, b) => a + b, 0) / student.marks.length))}</td>
        `;
        row.addEventListener("contextmenu", (event) => {
            showContextMenu(event, index);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    studentsContainer.appendChild(table);
}

function showStudentDetails(index) {
    let student = students[index];
    let detailsContainer = document.getElementById("student-details");

    detailsContainer.innerHTML = `
        <h2>${student.name}</h2>
        <table>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                </tr>
            </thead>
            <tbody>
                ${student.marks.map((mark, i) => `
                    <tr>
                        <td>Subject ${i + 1}</td>
                        <td>${mark}</td>
                    </tr>
                `).join("")}
                <tr>
                    <td>Total Marks:</td>
                    <td>${student.marks.reduce((a, b) => a + b, 0)}</td>
                </tr>
                <tr>
                    <td>Average:</td>
                    <td>${Math.round(student.marks.reduce((a, b) => a + b, 0) / student.marks.length)}</td>
                </tr>
                <tr>
                    <td>Grade:</td>
                    <td>${getGrade(Math.round(student.marks.reduce((a, b) => a + b, 0) / student.marks.length))}</td>
                </tr>
            </tbody>
        </table>
    `;

    document.getElementById("student-popup").style.display = "block";
}

function closePopup() {
    document.getElementById("student-popup").style.display = "none";
}

function showContextMenu(event, index) {
    event.preventDefault();
    selectedStudentIndex = index;
    let contextMenu = document.getElementById("context-menu");
    contextMenu.style.display = "block";
    contextMenu.style.left = event.pageX + "px";
    contextMenu.style.top = event.pageY + "px";
}

function hideContextMenu() {
    document.getElementById("context-menu").style.display = "none";
}

function updateStudentMarks() {
    hideContextMenu();
    let student = students[selectedStudentIndex];

    let numSubjects = student.marks.length;
    let newMarks = [];
    for (let i = 0; i < numSubjects; i++) {
        newMarks.push(parseInt(prompt(`Enter new marks for subject ${i + 1}:`, student.marks[i])));
    }

    student.marks = newMarks;
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
    showStudentDetails(selectedStudentIndex);
}

function deleteStudent() {
    hideContextMenu();
    students.splice(selectedStudentIndex, 1);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
}

function getGrade(average) {
    if (average >= 90) return "A";
    else if (average >= 80) return "B";
    else if (average >= 70) return "C";
    else if (average >= 60) return "D";
    else return "F";
}

window.addEventListener("click", (event) => {
    if (!event.target.closest("#context-menu")) {
        hideContextMenu();
    }
});

showStudents()
