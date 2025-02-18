// main.jsx
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css' // or your global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  // eslint-disable-next-line react/jsx-no-undef
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
