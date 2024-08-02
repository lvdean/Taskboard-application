// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
// console.log("this is taskliat = ", taskList);
// if(taskList === null){
//     console.log(" there isnt any array");
//     taskList = [];
// }else{
//     console.log(
//         "there si  an array"
//     )
// }
//console.log("after if statement ", taskList);
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Elements from HTML
const $taskTitle = $('#task-title'); 
const $dueDate = $('#task-due-date');
const $taskDescription = $('#task-description');
const $taskSubmit = $('#submit-task');

// Color coordination for task cards
// const pastDue = 'bg-danger text-white';
// const dueSoon = 'bg-warning text-white';

// function for a unique task id
function generateTaskId() { 
    return nextId++;
}

// Save tasks and nextId to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(taskList));
    localStorage.setItem('nextId', JSON.stringify(nextId));
}

// loading tasking and rendering them
// function loadTasks() {
//     taskList.forEach(task => {
//         const taskCard = createTaskCard(task);
//         $('#todo-lane').append(taskCard);
//         console.log (todo-lane)
//     });
// }

//function to create card ensuring it is draggable
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-task-id', task.id);



    const cardHeader = $('<div>')
        .addClass('card-header h4')
        .text(task.title);

    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);

    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id)
        .on('click', handleDeleteTask);

    // Determine  color of card
    const now = new Date();
    const dueDateTime = new Date(task.dueDate);
    const daysDifference = (dueDateTime - now) / (1000 * 3600 * 24);
    console.log(now)
     console.log(dueDateTime)
     console.log(daysDifference)
     console.log(daysDifference < -1)
    if (daysDifference < -1) {
        taskCard.addClass("past-due");
    } else if (daysDifference <= 0) {
        taskCard.addClass(dueSoon);
    }

    // Append elements on to page
    cardBody.append(cardDescription, cardDueDate);
    taskCard.append(cardHeader, cardBody, cardDeleteBtn);

    return taskCard;
}

// Handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
   

    const title = $taskTitle.val();
    const dueDate = $dueDate.val();
    const description = $taskDescription.val();
    // console.log("title: ", title);
    // console.log("date: ", dueDate);
    // console.log("des: ", description)


    if (title && dueDate && description) {
        // console.log("in the if")
        const newTask = {
            id: generateTaskId(),
            title: title,
            description: description,
            dueDate: dueDate,
            status: 'to-do'
        };
        // console.log("newtaks ", newTask)

        taskList.push(newTask);
        // console.log("array tasklist ", taskList)
        saveTasks();

        const taskCard = createTaskCard(newTask);
        console.log(taskCard)
        $('#todo-cards').append(taskCard);

        // Clear input fields
        $taskTitle.val('');
        $taskDescription.val('');
    }
}

// Handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).data('task-id');
    taskList = taskList.filter(task => task.id !== taskId);
    saveTasks();

    $(event.target).closest('.task-card').remove();
}

// Make task cards draggable ad properties
function makeTasksDraggable() {
    $('.draggable').draggable({
        opacity: 0.8,
        zIndex: 100,
        revert: "invalid",
        helper: "clone"
    });
}

// Dropping lanes into position
function makeLanesDroppable() {
    $('.droppable-lane').droppable({
        accept: '.draggable',
        drop: handleDrop
    });
}

// Handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskCard = $(ui.helper);
    const taskId = taskCard.data('task-id');
    const task = taskList.find(task => task.id === taskId);

    // Update task status based on the new lane
    const newStatus = $(event.target).data('status');
    task.status = newStatus;
    saveTasks();

    taskCard.remove();
    $(event.target).append(taskCard);

    // Reinitialize draggable after moving
    makeTasksDraggable();
}

$(document).ready(function () {
    // Load tasks and initialize event listeners
    //loadTasks();
    makeTasksDraggable();
    makeLanesDroppable();

    // Event listener for adding a new task
    $taskSubmit.on('click', handleAddTask);
});
