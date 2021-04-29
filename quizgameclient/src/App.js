import logo from './logo.svg';
import './App.css';
import Question from './components/Question';
import QuestionList from './components/QuestionList';



function App() {
  return (
      <div className="App">
          <QuestionList />
          <Question />
    </div>
  );
}

export default App;
