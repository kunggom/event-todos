const TODOAPP = (function () {
    "use strict";
    
    const KEY_ENTER = 13;
    const KEY_ESC = 27;
    const EDITING = "editing";
    const todoList = document.getElementById("todo-list")
    
    const todoTemplate =
        "<li>" +
        "<div class=\"view\">" +
        "<input class=\"toggle\" type=\"checkbox\">" +
        "<label class=\"label\">{{todoTitle}}</label>" +
        "<button class=\"destroy\"></button>" +
        "</div>" +
        "<input class=\"edit\" value=\"{{todoTitle}}\">" +
        "</li>";

    const todoItemTemplate = Handlebars.compile(todoTemplate);

    //todo 컨트롤러에 각 이벤트에 해당하는 이벤트 리스너를 등록해야한다.
    const TodoController = function () {
        const todoService = new TodoService()

        const addTodo = function () {
            const todoTitle = document.getElementById("new-todo-title")
            todoTitle.addEventListener("keydown", todoService.add)
        }

        //todo 리스트 앞의 체크박스를 클릭했을 떄 완료된 표시를 해줘야 한다.
        const completeTodo = function () {
            todoList.addEventListener("click", todoService.completedTodo)
        };

        //todo 리스트에서 x버튼을 눌렀을 때 삭제 할 수 있어야 한다.
        const deleteTodo = function () {
            todoList.addEventListener("click", todoService.deleteTodo)
        };

        //todo 리스트의 타이틀을 변경할 수 있어야 한다.
        const updateTodo = function () {
            todoList.addEventListener("dblclick", todoService.editTodo)
        }

        const init = function () {
            addTodo()
            completeTodo()
            deleteTodo()
            updateTodo()
        }

        return { init }
    }

    const TodoService = function () {
        const getSelectedTodo = event => {
            return event.target.closest("li");
        };

        const isEventItemHasClass = (event, className) => {
            return event.target.classList.contains(className);
        };

        const add = function (event) {
            const todoTitle = event.target.value
            if (event.which === KEY_ENTER && todoTitle !== "") {
                todoList.insertAdjacentHTML("beforeend", todoItemTemplate({ "todoTitle": todoTitle }))
                event.target.value = ""
            }
        }

        const completedTodo = function (event) {
            const selectedTodo = getSelectedTodo(event);
            if (isEventItemHasClass(event, "toggle")) {
                selectedTodo.classList.toggle("completed");
            }
        }

        const deleteTodo = function (event) {
            const selectedTodo = getSelectedTodo(event);
            if (isEventItemHasClass(event, "destroy") && confirm("정말로 삭제하시겠습니까?")) {
                selectedTodo.remove();
            }
        };

        const editTodo = function (event) {
            const selectedTodo = getSelectedTodo(event);
            if (isEventItemHasClass(event, "label")) {
                selectedTodo.classList.add(EDITING);
                selectedTodo.addEventListener("keydown", (event) => update(event, selectedTodo));
            }
        }

        const update = function (event, selectedTodo) {
            const editField = selectedTodo.querySelector("input.edit");
            const editEnd = () => {
                selectedTodo.classList.remove(EDITING);
            };
            if (event.which === KEY_ESC) {
                editEnd();
            }
            if (event.which === KEY_ENTER && editField.value !== "") {
                selectedTodo.querySelector("label").innerText = editField.value;
                editEnd();
            }
        }

        return {
            add,
            completedTodo,
            deleteTodo,
            editTodo
        }
    }

    const init = function () {
        const todoController = new TodoController()
        todoController.init()
    };

    return { init };
})();

TODOAPP.init();
