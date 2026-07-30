import { useEffect, useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user?.token) {
        dispatch({ type: 'SET_WORKOUTS', payload: [] })
        return
      }

      try {
        const response = await fetch('http://localhost:4000/api/workouts', {
          headers: { Authorization: `Bearer ${user.token}` }
        })

        if (!response.ok) {
          throw new Error('Unable to load workouts')
        }

        const json = await response.json()
        dispatch({ type: 'SET_WORKOUTS', payload: json })
        setError(null)
      } catch (err) {
        setError(err.message || 'Unable to load workouts')
      }
    }

    if (user) {
      fetchWorkouts()
    }
  }, [dispatch, user])

  return (
    <div className="home">
      <div className="workouts">
        <div className="hero-panel">
          <div>
            <p className="eyebrow">Advanced fitness tracking</p>
            <h2>Train smarter, stay consistent, and track progress with clarity.</h2>
            <p>
              Capture each workout, monitor your load, and keep your fitness routine moving forward.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <strong>Daily focus</strong>
              <span>Build momentum</span>
            </div>
            <div className="stat-card">
              <strong>Progress view</strong>
              <span>See your gains</span>
            </div>
            <div className="stat-card">
              <strong>Fast logging</strong>
              <span>Log in seconds</span>
            </div>
            <div className="stat-card">
              <strong>Private plans</strong>
              <span>Personal workouts</span>
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {workouts && workouts.length > 0 ? (
          workouts.map((workout) => (
            <WorkoutDetails key={workout._id} workout={workout} />
          ))
        ) : (
          <div className="empty-state">
            <h3>No workouts yet</h3>
            <p>Start by adding your first session from the form on the right.</p>
          </div>
        )}
      </div>
      <WorkoutForm />
    </div>
  )
}

export default Home
