import { ToastContainer, Zoom } from 'react-toastify'
import { AuthContextProvider } from './contexts/Auth-context'
import { ExperienceProvider } from './contexts/Experience-context';
import { ModalContextProvider } from './contexts/Modal-context';
import { GameProvider } from './contexts/Game-context';

import MyRoutes from './routes'

import './styles/global.scss'
import "react-toastify/dist/ReactToastify.css";
import 'swiper/css';
import '../node_modules/highlight.js/scss/atom-one-dark.scss'

export default function App() {
  return (
    <AuthContextProvider>
      <GameProvider>
        <ModalContextProvider>
          <ExperienceProvider>
            <MyRoutes />

            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              transition={Zoom}
            />
          </ExperienceProvider>
        </ModalContextProvider>
      </GameProvider>
    </AuthContextProvider>
  )
}
