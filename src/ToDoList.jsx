import { useEffect,useState } from 'react';
import './App.css';

function ToDoList() {
  const [tasks, setTasks] = useState([])
    /*const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];*/
  
  /*useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);  */
  
  const [newTask, setNewTask] = useState('');

  const [selectedUserId, setSelectedUserId] = useState('');
  const [sort, setSort] = useState('');
  const [completedSort,setCompletedSort] = useState('');

  useEffect(() => {
    fetch('http://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => {
        const updatedTasks = data.map(task => {
          // Ако задачата е завършена, добави дата на изпълнение
          if (task.completed) {
            return { ...task, completedAt: new Date().toLocaleString() }; // Добавяме текущата дата
          }
          return task; // Ако не е завършена, оставяме без промяна
        });
        setTasks(updatedTasks); // Записваме актуализираните задачи в състоянието
      })
      .catch(error => console.error('Error fetching todos:', error));
  }, []); // Този useEffect ще се извика само веднъж, когато компонентът се зареди
  
  const getSortedCompletedTasks = (tasks)=>{
    if (completedSort === "completedDateNewest"){
      return [...tasks].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    }
    else if (completedSort === "completeDateOldest"){
      return [...tasks].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
    }
  return tasks;
 };
 
 const getSortedTasks = (tasks) => {
    if (sort === "titleAsc") {
      return [...tasks].sort((a, b) => a.text.localeCompare(b.text));
    }else if(sort === "titleDesc"){
      return [...tasks].sort((a, b) => b.text.localeCompare(a.text))
    }
    return tasks;
  };
  
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false, completedAt: null, 
        userId: Math.floor(Math.random() * 5) + 1  }]);
      setNewTask('');
    }
  };    

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    const task = updatedTasks[index];
    
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null; 
  
    setTasks(updatedTasks);
  };
  
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }
  const moveTaskUp = (realIndex) => {
    if(realIndex > 0){
      const updatedTasks = [...tasks];
      [updatedTasks[realIndex], updatedTasks[realIndex - 1]] = [updatedTasks[realIndex - 1], updatedTasks[realIndex]];
      setTasks(updatedTasks);
    }
  }

  const uncompletedTasks = tasks.filter(task => 
    !task.completed && (selectedUserId ? task.userId === selectedUserId : true)
  );
  
  const completedTasks = tasks.filter(task => 
    task.completed && (selectedUserId ? task.userId === selectedUserId : true)
  );
  


  return (
    <div className="container">
      <h1>📝 To-Do List</h1>
      <div className="input-section">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task..."
        />
        <button onClick={addTask}>Add</button>
      </div>
      
      <div className="filters-container">
  
      <div className="filter-item">
        <label>Filter by:</label>
        <select value={selectedUserId} onChange={(e) => setSelectedUserId(Number(e.target.value))}>
          <option value="">All users</option>
          <option value="1">User 1</option>
          <option value="2">User 2</option>
          <option value="3">User 3</option>
          <option value="4">User 4</option>
          <option value="5">User 5</option>
        </select>
      </div>

      <div className="filter-item">
        <label>Sort by Title:</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="titleAsc">Title (asc)</option>
          <option value="titleDesc">Title (desc)</option>
        </select>
      </div>

      <div className="filter-item-right">
        <label>Sort by Date:</label>
        <select value={completedSort} onChange={(e) => setCompletedSort(e.target.value)}>
          <option value="completedDateNewest">Date (asc)</option>
          <option value="completedDateOldest">Date (desc)</option>
        </select>
      </div>

    </div>

      <div className="task-columns">
        <div className="task-list-pending">

          <h2>Pending</h2>
          {getSortedTasks(uncompletedTasks).map((task) => {
            const realIndex = tasks.indexOf(task);
            return (
              <div key={realIndex} className="task">
                <div className="task-text">
                  {task.title}
                </div>
                <div className="task-buttons">
                  <button className="task-button" onClick={() => toggleTask(realIndex)}>Complete</button>
                  <button className = "delete-button" onClick={() => deleteTask(realIndex)}>Delete</button>
                  <button className="moveUp-button" onClick={() => moveTaskUp(realIndex)}>Up</button>
                </div>
              </div>
            );
})}
         </div>

        <div className="task-list completed">
          <h2>Completed</h2>
          {getSortedCompletedTasks(completedTasks).map((task) => {
            const realIndex = tasks.indexOf(task);
            return(
              <div key={realIndex} className = "task">
                <div>{task.title}</div>
                <div className = "completed-date">
                    Completed on: {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : ''}
                </div>
                <button className = "undo-button" onClick = {() => toggleTask(realIndex)}>Undo</button>
              </div>
            );
})}
        </div>
      </div>
    </div>
  );
}

export default ToDoList;

