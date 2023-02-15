import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client'
import { cache } from './cache'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// 임시
if (!window.location.search) window.location.href = '/access.html'
else {
  const client = new ApolloClient({
    //uri: 'https://flyby-gateway.herokuapp.com/',
    uri: 'http://localhost:2222/graphql',
    cache,
    connectToDevTools: true,
    headers: {
      authorization: 'Bearer ' + (sessionStorage.getItem('_token') || 'Q98kcWfYxymaxQel'),
    },
  })

  root.render(
    <ApolloProvider client={client}>
      {/* <React.StrictMode> */}
      <App />
      {/* </React.StrictMode> */}
    </ApolloProvider>,
  )

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals()
}
