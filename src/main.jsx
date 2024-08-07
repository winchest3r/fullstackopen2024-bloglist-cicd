import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Provider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Provider>
  </Router>
);
