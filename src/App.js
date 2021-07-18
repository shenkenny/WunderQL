import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
// import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';

import { useState, useEffect } from 'react';
import Login from "./components/Login"
import './stylesheets/index.css';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ThemeProvider, useDarkTheme } from "./components/ThemeContext"; 
import MainContainer from "./components/MainContainer";


// fake data for cards in previous-searches
// const fakeData = [
//   {
//     id: 1,
//     'Query Name': 'Rocket ships',
//     'Num of runtimes': 38,
//     'Avg Runtime(ms)': 150,
//     'Last Date Ran': new Date().toDateString(),
//     query: `query {
//       launchesPast(limit: 1) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }`
    
//   },
//   {
//     id: 2,
//     'Query Name': 'Raubern ships',
//     'Num of runtimes': 38,
//     'Avg Runtime(ms)': 150,
//     'Last Date Ran': new Date().toDateString(),
//     query: `query {
//       launchesPast(limit: 2) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }`
    
//   },
//   {
//     id: 3,
//     'Query Name': 'Raubern sucks',
//     'Num of runtimes': 38,
//     'Avg Runtime(ms)': 150,
//     'Last Date Ran': new Date().toDateString(),
//     query: `query {
//       launchesPast(limit: 3) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }`
    
//   },
//   {
//     id: 4,
//     'Query Name': 'Rockets dont suck',
//     'Num of runtimes': 38,
//     'Avg Runtime(ms)': 150,
//     'Last Date Ran': new Date().toDateString(),
//     query: `query {
//       launchesPast(limit: 4) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }`
    
//   },
//   {
//     id: 5,
//     'Query Name': 'Rocket is bbygorl',
//     'Num of runtimes': 38,
//     'Avg Runtime(ms)': 150,
//     'Last Date Ran': new Date().toDateString(),
//     query: `query {
//       launchesPast(limit: 5) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }`
    
//   },
//   {
//     id: 6,
//     'Query Name': 'Rocket me',
//     'Num of runtimes': 38,
//     'Avg Runtime(ms)': 150,
//     'Last Date Ran': new Date().toDateString(),
//     query: `query {
//       launchesPast(limit: 6) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }`
    
//   },
//   {
//     id: 7,
//     'Query Name': 'i ship rockets',
//     'Num of runtimes': 38,
//     'Avg Runtime(ms)': 150,
//     'Last Date Ran': new Date().toDateString(),
//     query: `query {
//       launchesPast(limit: 7) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }`
    
//   },
//   {
//     id: 8,
//     'Query Name': 'me like rockets',
//     'Num of runtimes': 38,
//     'Avg Runtime(ms)': 150,
//     'Last Date Ran': new Date().toDateString(),
//     query: `query {
//       launchesPast(limit: 8) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }`
    
//   },
//   {
//     id: 9,
//     'Query Name': 'Rocket rocket rocket',
//     'Num of runtimes': 38,
//     'Avg Runtime(ms)': 150,
//     'Last Date Ran': new Date().toDateString(),
//     query: `query {
//       launchesPast(limit: 9) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }`
    
//   },
//   {
//     id: 10,
//     'Query Name': 'Rocks in a rocket',
//     'Num of runtimes': 38,
//     'Avg Runtime(ms)': 150,
//     'Last Date Ran': new Date().toDateString(),
//     query: `query {
//       launchesPast(limit: 10) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }`
    
//   },
//   {
//     id: 11,
//     'Query Name': 'Rocket of rocks',
//     'Num of runtimes': 38,
//     'Avg Runtime(ms)': 150,
//     'Last Date Ran': new Date().toDateString(),
//     query: `query {
//       launchesPast(limit: 11) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }`
    
//   },
// ];

const fakeURIs = [
  'raubern big dum-dum',
  'he dum-dum of all dum-dum',
  'raubern scrum master? more like dum master',
  'why is raubern',
  'no more raubern',
]

function App() {
  const [dark, setDark] = useState(false); // or true?
  const [uri, setURI] = useState('(please enter a URI to begin)');
  const [nickname, setNickname] = useState(null)
  const [history, setHistory] = useState(null);
  const [uriID, setUriID] = useState(0);
  const [runtime, setRuntime] = useState(0);
  const [queriesList, setQueriesList] = useState(null);
  const [uriList, setUriList] = useState(fakeURIs); // to use in dashboard
  const [user, setUser] = useState({
    loggedIn: false
  });
  const [userID, setuserID] = useState(null); // to use in dashboard
  // const toggleDarkMode = () => {console.log('changed theme'); setDark(prevDarkTheme => !prevDarkTheme)}

  // Set userID when user is logged in 
  window.api.receive("userIDfromMain", (userID) => {
    console.log("In userIDfromMain in App.jsx", userID)
    setuserID(userID)
  })


  const client = new ApolloClient({
    uri: uri,
    cache: new InMemoryCache()
  });

  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }
    
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <CssBaseline />
        <div id="App" style={themeStyle}>
          <div className="title-bar">
            <div className="titlebar-drag-region"></div>
            <div className="title">Window Header</div>
            <div className="title-bar-btns">
              <button id="min-btn">-</button>
              <button id="max-btn">+</button>
              <button id="close-btn">x</button>
            </div>
          </div>

          <Router>
            <Switch>
        <Route exact path='/'>
          {user.loggedIn ? 
          <MainContainer 
            uri={uri}
            setURI={setURI}
            uriID={uriID}
            setUriID={setUriID}
            nickname={nickname}
            setNickname={setNickname}
            runtime={runtime}
            setRuntime={setRuntime}
            history={history}
            setHistory={setHistory}
            queriesList={queriesList}
            setQueriesList={setQueriesList}
            uriList={uriList}
            setUriList={setUriList}
            userID={userID}
          /> 
          :
          <Login
            user={user}
            setUser={setUser}
          />}
        </Route>
            </Switch>
          </Router>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;