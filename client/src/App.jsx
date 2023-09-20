import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(2)

  const onClick = (c) => {
    c = c + 1;
    setCount(c)
  }

  return (
    <>
      <p>Hello world!!! {count}</p>
      <button onClick={() => onClick(count)}></button>
    </>
  )
}

export default App
