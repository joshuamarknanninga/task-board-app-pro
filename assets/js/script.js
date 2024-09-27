$(document).ready(function() {
    // Initialize tasks from localStorage with enhanced error handling
    let tasks;
    try {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        if (!Array.isArray(tasks)) {
            throw new Error("Tasks is not an array");
        }
    } catch (error) {
        console.warn("Error parsing 'tasks' from localStorage:", error);
        tasks = [];
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

     // Debugging: Check the type and content of 'tasks'
     console.log("Initial tasks from localStorage:", tasks);
     console.log("Type of tasks:", typeof tasks);

    // Function to render tasks
    function renderTasks() {
        // Clear all task lists
        $('.task-list').empty();

        tasks.forEach(task => {
            const taskCard = $('<div>').addClass('task-card').attr('data-id', task.id);

            // Color-coding based on deadline
            if (task.status === 'Not Yet Started') {
                taskCard.addClass('not-yet-started');
            } else if (task.status === 'In Progress') {
                taskCard.addClass('in-progress');
            } else if (task.status === 'Completed') {
                taskCard.addClass('completed');
            }

            // Task content
            taskCard.append(`<h3>${task.title}</h3>`);
            taskCard.append(`<p>${task.description}</p>`);
            taskCard.append(`<p>Deadline: ${task.deadline}</p>`);
            // Delete button
            const deleteButton = $('<button>').addClass('delete-btn').html('&times;');
            taskCard.append(deleteButton);

            // Append to respective column
            $(`#${task.status.toLowerCase().replace(/\s/g, '-')}`).append(taskCard);
        });
    }
    // Initial render
    renderTasks();

    // Modal handling
    const modal = $('#task-modal');
    const addTaskBtn = $('#add-task-btn');
    const closeBtn = $('.close-btn');

    addTaskBtn.on('click', function() {
        modal.show();
    });

    closeBtn.on('click', function() {
        modal.hide();
        $('#task-form')[0].reset();
    });

    // When the user clicks anywhere outside of the modal, close it
    $(window).on('click', function(event) {
        if ($(event.target).is(modal)) {
            modal.hide();
            $('#task-form')[0].reset();
        }
    });

    // Add new task
    $('#task-form').on('submit', function(event) {
        event.preventDefault();
        const title = $('#task-title').val().trim();
        const description = $('#task-desc').val().trim();
        const deadline = $('#task-deadline').val();

        if (title && description && deadline) {
            const newTask = {
                id: Date.now(),
                title,
                description,
                deadline,
                status: 'Not Yet Started'
            };
            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            modal.hide();
            $('#task-form')[0].reset();
        }
    });

    // Delete task
    $(document).on('click', '.delete-btn', function() {
        const taskId = $(this).parent().data('id');
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    });

    // Drag and Drop functionality
    let draggedTask = null;

    $(document).on('dragstart', '.task-card', function(e) {
        draggedTask = $(this).data('id');
    });

    $('.task-list').on('dragover', function(e) {
        e.preventDefault();
    });

    $('.task-list').on('drop', function(e) {
        e.preventDefault();
        const newStatus = $(this).parent().data('status');
        tasks = tasks.map(task => {
            if (task.id === draggedTask) {
                return { ...task, status: newStatus };
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    });

    // Make tasks draggable
    $(document).on('mousedown', '.task-card', function() {
        $(this).attr('draggable', 'true');
    });

    // Prevent default dragend behavior
    $(document).on('dragend', '.task-card', function() {
        $(this).attr('draggable', 'false');
    });
});
