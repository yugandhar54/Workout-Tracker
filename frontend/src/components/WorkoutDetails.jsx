import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(workout.title)
  const [load, setLoad] = useState(workout.load)
  const [reps, setReps] = useState(workout.reps)

  const handleDelete = async () => {
    if (!user) return

    try {
      const response = await fetch('http://localhost:4000/api/workouts/' + workout._id, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      })

      let json = null
      try {
        json = await response.json()
      } catch {
        json = null
      }

      if (response.ok) {
        dispatch({ type: 'DELETE_WORKOUT', payload: json })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!user) return

    try {
      const response = await fetch('http://localhost:4000/api/workouts/' + workout._id, {
        method: 'PATCH',
        body: JSON.stringify({ title, load, reps }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      })

      let json = null
      try {
        json = await response.json()
      } catch {
        json = null
      }

      if (response.ok) {
        dispatch({ type: 'UPDATE_WORKOUT', payload: json })
        setIsEditing(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (isEditing) {
    return (
      <form className="workout-details" onSubmit={handleUpdate}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="number" value={load} onChange={(e) => setLoad(e.target.value)} />
        <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
        <button type="submit">Save</button>
        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
      </form>
    )
  }

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p><strong>Load (kg): </strong>{workout.load}</p>
      <p><strong>Reps: </strong>{workout.reps}</p>
      <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
      <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
      <button className="delete-btn" onClick={handleDelete}>Delete</button>
    </div>
  )
}

export default WorkoutDetails
