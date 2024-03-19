import "./App.css";
import Weather from "./components/weather/Weather";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Weather />
      <ToastContainer />
    </>
  );
}

export default App;
