import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'



function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
       const response = await axios.get(`${API_BASE_URL}/tasks/`)
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const response = await axios.post(`${API_BASE_URL}/tasks/`, {
        title: newTask,
        description: '',
        completed: false
      })
      setTasks([...tasks, response.data])
      setNewTask('')
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const toggleTask = async (id, completed) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/tasks/${id}/`, {
        completed: !completed
      })
      setTasks(tasks.map(task => 
        task.id === id ? response.data : task
      ))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`)
      setTasks(tasks.filter(task =>   task.id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Task Manager
        </h1>
        
        <form onSubmit={addTask} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id, task.completed)}
                    className="w-5 h-5"
                  />
                  <span className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No tasks yet. Add one above!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
