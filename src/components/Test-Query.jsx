import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom'
import LineChartComponent from "./LineChart";
import { channels } from '../shared/constants';
import Button from '@material-ui/core/Button';
import { useDarkTheme } from "./ThemeContext";
// const { ipcRenderer } = window.require("electron");

const TestQuery = ({ client, uri, uriID, history, setHistory, getResponseTimes }) => {

  const [query, setQuery] = useState('');
  const [runtime, setRuntime] = useState(0);

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  // this is for when a card was clicked in the 'previous searches' component and the query
  // is passed as a prop when user is rerouted back to this component
  let queryProp = null;
  let location = useLocation();
  if (location.state) {
    console.log(location.state)
    queryProp = location.state.queryProp;
    console.log('queryProp sent from cards: ', queryProp)
    // document.querySelector('#text-area').value = location.state.queryProp;
  }

  const sendQuery = () => {
    // Sends the message to Electron main process
    console.log('Query is being sent to main process...')

    // Make GraphQL API query at a rate of 1 request per 5 milliseconds
    // TODO: Make the rate of requests change based on user interaction 
    // setInterval(() => {
    //   ipcRenderer.send(channels.GET_RESPONSE_TIME, {
    //     uriID: uriID,
    //     query: query,
    //     uri: uri,
    //   });
    // }, 5)
    
    // ipcRenderer.send(channels.GET_RESPONSE_TIME, {
    //   uriID: uriID,
    //   query: query,
    //   uri: uri,
    // });
    window.api.send('QueryDetailstoMain', {
      uriID: uriID,
      query: query,
      uri: uri,      
    })

    // Initiate load test when user clicks 'Submit Query'
    // TODO: Move this to new component, and don't hardcode numofChildProcesses
    // ipcRenderer.send(channels.TEST_LOAD, {
    //   numOfChildProccesses: 3,
    //   query: query,
    //   uri: uri,
    // })
  };

  // commented out because calculating runtime from FE (for now)
  useEffect(() => {
    // useEffect hook - listens to the get_response channel for the response from electron.js    
    window.api.receiveArray("ResponseTimesFromMain", (event, arg) => {
      console.log('Listening for response from main process...')
      console.log('arg object received from electronjs: ', arg);

      const currRuntime = arg[arg.length - 1].response_time.toFixed(1);
      console.log('runtime: ', currRuntime);

      setRuntime(currRuntime);

      // REFACTOR - it would be better to isolate lines 45 - 77 to its own function 
      //arg is received as an array of objects
      const pastRuntimes = [];
      let x_sum = 0
      let y_sum = 0
      let numerator = 0;
      let denominator = 0;

      arg.forEach((query, index) => {
        x_sum += index;
        y_sum += query.response_time;
      })        

      const x_avg = x_sum / arg.length;
      const y_avg = y_sum / arg.length;

      arg.forEach((query, index) => {
        numerator += ((index - x_avg) * (query.response_time - y_avg));
        denominator += (index - x_avg) ** 2;
      });  

      const slope = numerator / denominator;
      const y_intercept = y_avg - slope * x_avg;
      const lineOfBestFit = (x) => slope * x + y_intercept;

      arg.forEach((query, index) => {
      const date = new Date(query.date).toDateString();

        pastRuntimes.push({
          index: index,
          date: date,
          runtime: query.response_time.toFixed(1),
          best_fit: lineOfBestFit(index).toFixed(1)
        });
      });

      setHistory(pastRuntimes);
      console.log('all past runtimes: ', pastRuntimes);
    });
    // getResponseTimes();
    
    // Clean the listener after the component is dismounted
    // return () => {
    //   ipcRenderer.removeAllListeners();
    // };
  });

  return (
    <div id='test-query' style={themeStyle}> 
      <header class='uri'>
        <h2>Currently connected to: {uri}</h2>
      </header>
      <div id='query-space'>
        <textarea 
          placeholder='input for user query'
          id='text-area'
          onChange={(e) => setQuery(e.target.value)}
          style={themeStyle}
        >{queryProp}</textarea>
        <Button 
          variant="contained" 
          id='send-query' 
          color="primary"
          onClick={sendQuery}
        >Send Query</Button>
      </div>
      <div id='stats'>
        <div class='category'>
          <div class='category-title'>Query Response Time (ms)</div>
          <div class='category-number'>{`${runtime}`}</div>
          {/* <div class='category-number'>100</div> */}
          {/* {runtime && (
            <p>{`${runtime}`}</p>
          )} */}
        </div>
        <div class='category' id='failure'>
          <div class='category-title'>Number of Requests to Failure</div>
          <div class='category-number'>100</div>
        </div>
        <div class='category'>
          <div class='category-title'>Number of Null Responses</div>
          <div class='category-number'>100</div>
        </div>
        {/* <div class='category'>
          <div class='category-title'>Response Time for Batch Test</div>
          <div class='category-number'>100</div>
        </div> */}
      </div>
      <div id='response-chart'> 
        <LineChartComponent history={history}/>
      </div>
    </div>
  ) 
};


    // const startTime = performance.now();

    // fetch(uri, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json,text/plain, */*',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ query: query })
    // })
    //   .then(res => res.json())
    //   .then(result => {
    //     let responseTime = (performance.now() - startTime)
    //     setRuntime(Number(responseTime.toFixed(1)));
    //   })

    /**this seems to be measuring runtime of promise 
    client.query({
      query: gql`${query}`
    }).then(result => {
      let responseTime = (performance.now() - startTime)
      // let responseTime = (Date.now() - startTime)
      setRuntime(Number(responseTime.toFixed(1)));
    })
    */

// client.query({
  // query: gql`
    // query {
    //   launchesPast(limit: 10) {
    //     mission_name
    //     launch_date_local
    //     launch_site {
    //       site_name_long
    //     }
    //   }
    // }
//   `
// }).then(result => console.log(result))


export default TestQuery;