const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let allTodos = getTodos();
updateToDoList();

todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    AddToDo();

})

function AddToDo() {
    const todoText = todoInput.value.trim();
    if(todoText.length > 0) {
        const todoObject = {
          text: todoText,
          completed: false
        }
        allTodos.push(todoObject);
        updateToDoList();
        saveTodos();
        createToDoItem(todoText);
        todoInput.value = "";
    }
    
}

function updateToDoList() {
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex)=>{
        todoItem = createToDoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    })
}

function createToDoItem(todo, todoIndex) {
    const todoId = "todo-"+todoIndex;
    const todoLI = document.createElement('li');
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}" />
          <label for="${todoId}" class="custom-checkbox">
            <svg
              fill="transparent"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
          </label>
          <label for="${todoId}" class="todo-text">
            ${todoText}
          </label>
          <button class="delete-button">
            <svg
              fill="var(--secondary-color)"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
              />
            </svg>
          </button>`
    const deleteButton = todoLI.querySelector('.delete-button');
    deleteButton.addEventListener('click', ()=>{
        deleteTodoItem(todoIndex);
    })
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener('change', ()=>{
      allTodos[todoIndex].completed = checkbox.checked;
      saveTodos();

      // Only vibrate when unchecked
      if (!checkbox.checked) {
          todoLI.classList.add('vibrate');
          todoLI.addEventListener('animationend', () => {
              todoLI.classList.remove('vibrate');
          }, { once: true });
      }
    })
    checkbox.checked = todo.completed;
    return todoLI;

}
function deleteTodoItem(todoIndex) {
    const todoListUL = document.getElementById('todo-list');
    const todoItems = todoListUL.querySelectorAll('.todo');
    const todoToDelete = todoItems[todoIndex];
    const nextTodo = todoItems[todoIndex + 1];

    // Add glass-break animation to the todo to be deleted
    todoToDelete.classList.add('glass-break');

    // If there is a next todo, animate it pulling up
    if (nextTodo) {
        nextTodo.style.transition = 'transform 0.4s cubic-bezier(.36,1.01,.32,1)';
        nextTodo.style.transform = 'translateY(-60px)';
    }

    // After animation, remove the todo and reset next todo's style
    todoToDelete.addEventListener('animationend', () => {
        // Remove from data
        allTodos.splice(todoIndex, 1);
        saveTodos();

        // Remove from DOM
        updateToDoList();

        // Reset next todo's style (if any)
        if (nextTodo) {
            nextTodo.style.transition = '';
            nextTodo.style.transform = '';
        }
    }, { once: true });
}
function saveTodos(){
    const todosJSON = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJSON);
}
function getTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load theme preference
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeToggle.textContent = '🌞';
} else {
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌞';
    } else {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '🌙';
    }
});