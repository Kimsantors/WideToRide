import { useViewportScale } from './hooks/useViewportScale'
import { RunnerScreen } from './components/RunnerScreen'
import './styles/game.css'

export default function App() {
  useViewportScale('runner-root')
  return <RunnerScreen />
}
