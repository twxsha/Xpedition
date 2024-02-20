import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Landing';
import SignUp from './SignUp';
import LogIn from './LogIn';
import Home from './Home';


function App() {
  return (
    <Router>
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
