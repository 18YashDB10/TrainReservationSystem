import { useState } from 'react'
import TrainReservation from './TrainReservation'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TrainReservation/>
    </>
  )
}

export default App
