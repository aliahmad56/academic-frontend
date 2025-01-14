import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SocketProvider } from './SocketProvider';
import { store } from './redux/store';
import Routes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    // Ensure Redux Provider is at the topmost level
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
        <SocketProvider>
          <BrowserRouter>
            <Routes />
            <ToastContainer />
          </BrowserRouter>
        </SocketProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
