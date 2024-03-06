import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Landing';
import SignUp from './SignUp';
import LogIn from './LogIn';
import Home from './Home';
import Describe from './Describe';


function App() {
  return (
    <Router>
    <Routes>
      <Route exact path="" element={<Landing />} />
      <Route path="/X" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/describe" element={<Describe />} />
    </Routes>
  </Router>

  );
}

export default App;
