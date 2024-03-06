import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Landing from './Landing';
import SignUp from './SignUp';
import LogIn from './LogIn';
import Home from './Home';
import './App.css';
function App() {
  return (

  <Router>
    <Link to="https://serpapi.com/">
      <img id = "serp_callout" src="/serp_api.png" alt = "Powered by SerpAPI" href = "https://serpapi.com/"/>
    </Link>
    <Routes>
      <Route exact path="" element={<Landing />} />
      <Route path="/X" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
    </Routes>
  </Router>

  );
}

export default App;
