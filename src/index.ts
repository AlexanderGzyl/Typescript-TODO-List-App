import { v4 as uuidV4 } from "uuid";

//showing the list of tasks
//select unordered list
const listsContainer = document.querySelector<HTMLUListElement>('[data-lists]')
//select form 
const newListForm = document.querySelector('[data-new-list-form]') as HTMLFormElement | null;
const newListInput = document.querySelector<HTMLInputElement>('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
//select tasks
const listDisplayContainer = document.querySelector<HTMLDivElement>('[data-list-display-container]')
const listTitleElement = document.querySelector<HTMLHeadElement>('[data-list-title]')
const listCountElement = document.querySelector<HTMLParagraphElement>('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template') as HTMLTemplateElement;
const newTaskForm = document.querySelector('[data-new-task-form]') as HTMLFormElement | null;
const newTaskInput = document.querySelector<HTMLInputElement>('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')
//local storage
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
//on click active
listsContainer?.addEventListener('click', e =>{
    if((e.target as Element)?.tagName?.toLowerCase() === 'li'){
        selectedListId = (e.target as HTMLInputElement)?.dataset?.listId!
        saveAndRender()
    }
})

tasksContainer?.addEventListener('click', e => {
    if ((e.target as Element)?.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find((list:any) => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find((task:any) => task.id === (e.target as Element)?.id)
        selectedTask.complete = (e.target as HTMLInputElement)?.checked
        save()
        renderTaskCount(selectedList)
    }
})
//add custom typing
//get info from local storage...if it doesn't exist give us an empty array
let lists:any = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)||"[]")|| []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY ||"[]") 

clearCompleteTasksButton?.addEventListener('click', e => {
    const selectedList = lists.find((list:any) => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter((task:any) => !task.complete)
    saveAndRender()
})

deleteListButton?.addEventListener('click', e => {
    lists = lists.filter((list:any) => list.id !== selectedListId)
    //selected list removed
    selectedListId = null;
    saveAndRender()
})
//list form
if (newListInput != null) {
    newListForm?.addEventListener('submit',e =>{
        e.preventDefault()
        const listName = newListInput.value
        if(listName == null || listName === '') return
        const list = createList(listName)
        newListInput.value = '';
        lists.push(list)
        saveAndRender()
    })
}
//task form
if (newTaskInput != null) {
    newTaskForm?.addEventListener('submit',e =>{
        e.preventDefault()
        const taskName = newTaskInput.value
        if(taskName == null || taskName === '') return
        const task = createTask(taskName)
        newTaskInput.value = '';
        const selectedList = lists.find((list:any)=> list!.id === selectedListId)
        selectedList.tasks.push(task)
        saveAndRender()
    })
}

function createTask(name:any){
    return {id:Date.now().toString(), name:name, complete:false}
}
//
function createList(name:any) {
    return {id:Date.now().toString(), name:name, tasks:[]}
}
//save lists to local storage
function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    if (selectedListId !== null) {
        localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
    }
    
}

//call save and the render
function saveAndRender() {
    save();
    render();
}


// 
function render() {
    clearElement(listsContainer)
    renderLists()
    const selectedList = lists.find((list:any) => list.id === selectedListId)
    if (selectedListId == null && listDisplayContainer !== null) {
        listDisplayContainer.style.display = 'none'
    } else if(selectedListId !== null ) {
        listDisplayContainer!.style.display = '';
        listTitleElement!.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}

function renderTasks(selectedList:any){
    selectedList.tasks.forEach((task:any) =>{
        const taskElement = document.importNode(taskTemplate!.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox!.id = task.id
        checkbox!.checked = task.complete
        const label = taskElement.querySelector('label')
        label!.htmlFor = task.id
        label!.append(task.name)
        tasksContainer!.appendChild(taskElement)
    })
}

function renderTaskCount(selectedList:any){
    const incompleteTaskCount = selectedList.tasks.filter((task:any) => 
        !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement!.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists(){
    lists.forEach((list: any) => {
        //create element
        const listElement = document.createElement("li");
        //add id
        listElement.dataset.listId = list.id
        //add classname to element
        listElement.classList.add("list-name")
        //name of element
        listElement.innerText= list.name;
        if (list.id === selectedListId) {
            listElement.classList.add('active-list')
        }
        if (listsContainer !== null) {
            listsContainer.appendChild(listElement)
        }
        
    })

}
//clear lists ocntainer before appending an item
function clearElement(element:any){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}

render();
