import './App.css';
import XMLMap from './components/map';
import { useEffect, useState } from 'react';
import * as d3 from 'd3';

function App() {


  const [xml, setXml] = useState(null);
  const [csv, setCsv] = useState(null);

  useEffect(() => {
    Promise.all([
      d3.csv("/data/turning_relations.csv"),
      fetch("/data/ZRH_geo.net.xml").then((d) => d.text())
    ])
      .then((data) => {
        setCsv(data[0])
        setXml(data[1])

        
      })
  }, [])

  return (
    <div className="App">
      {xml && csv && <XMLMap xml={xml} csv={csv} />}
    </div>
  );
}

export default App;
