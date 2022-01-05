import './App.css';

function Gallery () {
  const { page, setPage } = useState(1)
  return (
    <div>{page}</div>
  )
}

function App() {
  return (
    <div className="App">
      <Gallery />
    </div>
  );
}

export default App;
