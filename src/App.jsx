import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Converter from "./components/Converter";

function App() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>XML to CSV</h1>
      <Converter />
    </>
  );
}

export default App;
