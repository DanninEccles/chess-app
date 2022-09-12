import './App.css';
import Chessboard from './Components/Chessboard/Chessboard'

function App() {
  return (
      <>
          <div id="logo"><h1>Chess Attack <span id="piece">♔</span></h1></div>
          <div id="app">
              <Chessboard />
          </div>
      </>
  );
}

export default App;
