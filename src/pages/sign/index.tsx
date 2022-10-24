import { Navigate, useNavigate } from 'react-router-dom';

import logo from '../../assets/logo.png';
import code from '../../assets/code.svg';
import './style.scss'
import { useAuth } from '../../hooks/use-auth';
import Cookies from 'js-cookie';

export default function Sign() {
  const navigate = useNavigate();
  const { googlePopUpSignIn } = useAuth();

  //Condicional que verifica se o usuário está autenticado
  if (typeof window !== 'undefined') {
    const token = Cookies.get('token')

    if (token) {
      return <Navigate to="/" replace />
    }
  }

  return (
    <div className="sign">
      <div className="header">
        <h1>
          <img src={logo} alt="Logo" />
          Programing Gamming Room
        </h1>
      </div>

      <div className="header-cover">
        <div className="text">
          <h1>Let's Play</h1>
          <h2>Let's Play</h2>
        </div>
        <img src={code} alt="Code" />
      </div>

      <div className="sign-content">
        <div>
          <h2>Vamos lá, aprenda jogando!</h2>
          <p>
            Aprenda programação de forma divertida e interativa.
            Resposnda as perguntas e ganhe pontos.
            Mostre que você é o melhor!
          </p>
        </div>

        <div>
          <div className="buttons">
            <button className="google" onClick={googlePopUpSignIn}>
              <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
              Entrar com Google
            </button>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>
          Copyright © 2022 | <a href="js-dev-portfolio.vercel.app">Jonata Santos</a>
        </p>
      </div>
    </div>
  )
}
