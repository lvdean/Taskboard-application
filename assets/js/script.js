
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// function for a unique task id
function generateTaskId() { 
  const id = nextId++;
  localStorage.setItem('nextId', JSON.stringify(nextId));
  return id;
}

// Testing for parsing errors
// let taskList = [];
// try {
//     const storedTasks = localStorage.getItem("tasks");
//     taskList = storedTasks ? JSON.parse(storedTasks) : [];
// } catch (e) {
//     console.log("Failed to parse tasks from localStorage:", e);
// }

function readTasksFromStorage() {
    return taskList;
  }

// Elements from HTML
const $taskTitle = $('#task-title'); 
const $dueDate = $('#task-due-date');
const $taskDescription = $('#task-description');
const $taskSubmit = $('#submit-task');
const toDoCards = $('#todo-cards');
const inProgressCards = $('#in-progress-cards');
const doneCards = $('#done-cards');

// Save tasks to localStorage
function saveTasks(taskList) {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}


//function to create card
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


//Determine the colour of the card based on whether the task is past present or in the future
const now =  dayjs();
    const dueDateTime = dayjs(task.dueDate, 'MM/DD/YYYY');
    console.log(now)
     console.log(dueDateTime)

     if (now.isBefore(dueDateTime, 'day')){
        taskCard.addClass("due-soon");
     } else if (now.isSame(dueDateTime, 'day')) {
        taskCard.addClass("present");
     } else if (now.isAfter(dueDateTime, 'day')) {
        taskCard.addClass("past-due"); 
     }

     cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
     taskCard.append(cardHeader, cardBody);
 
     //  Return the task card 
     return taskCard;

    }

    //rendering the task ist an making them draggable

    function renderTaskList() {
        const tasks = readTasksFromStorage();
    
        toDoCards.empty();
        inProgressCards.empty();
        doneCards.empty();
    
        tasks.forEach((task) => {
          const taskCard = createTaskCard(task);
          if (task.status === 'to-do') {
            toDoCards.append(taskCard);
          } else if (task.status === 'in-progress') {
            inProgressCards.append(taskCard);
          } else if (task.status === 'done') {
            doneCards.append(taskCard);
          }
        });
    

    // Make task cards draggable
    $('.draggable').draggable({
        revert: 'invalid',
        helper: 'clone',
        zIndex: 100,
        snap: '.lane',
        snapMode: 'inner',
        snapTolerance: 30,
      });
  
      // Allow task to be dropped in the lanes
      $('.lane').droppable({
        accept: '.draggable',
        zIndex: 50,
        drop: handleDrop,
        hoverClass: 'bg-light',
      });
    }

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
        taskList.push(newTask);
            // console.log("array tasklist ", taskList)
        saveTasks();

        // Hide the modal after adding task
     $('#staticBackdrop').modal('hide');

     const taskCard = createTaskCard(newTask);
        console.log(taskCard)
        toDoCards.append(taskCard);
        $('.draggable').draggable({
            revert: 'invalid',
            helper: 'clone',
            zIndex: 100,
            snap: '.lane',
            snapMode: 'inner',
            snapTolerance: 30
        });

        // Clear input fields
        $taskTitle.val('');
        $taskDescription.val('');
        $dueDate.val('');
    }
}


    // Handle deleting a task
 function handleDeleteTask(event) {
    const taskId = $(event.target).data('data-task-id');
    taskList = taskList.filter(task => task.id !== taskId);
    saveTasks();

    $(event.target).closest('.task-card').remove();
}

  // Handle dropping a task into a new status lane
  function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('data-task-id');
    const newStatus = $(this).attr('id').replace('-cards', '');

    const tasks = readTasksFromStorage();
    const taskIndex = tasks.findIndex((task) => task.id == taskId);
    if (taskIndex !== -1) {
      taskList[taskIndex].status = newStatus;
      saveTasks(taskList);
      renderTaskList();

    // Change the background of the card to white if moved to the "done" column
    if (newStatus === 'done') {
        $(`[data-task-id=${taskId}]`)
          // .removeClass()
          .addClass('present');
    }}
  }
  


    // Load tasks and initialize event listeners
    renderTaskList();
    // makeTasksDraggable();
    // makeLanesDroppable();

    // Event listener for adding a new task
    $taskSubmit.on('click', handleAddTask);
