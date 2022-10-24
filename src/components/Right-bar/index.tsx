import { useAuth } from '../../hooks/use-auth'
import './style.scss'

export default function Rightbar() {

  const { user } = useAuth()

  return (
    <nav>
      <div className="avatar">
        <div className="percent">
          <svg>
            <circle cx="30" cy="30" r="29" />
            <circle cx="30" cy="30" r="29" id="circleOffset" />
          </svg>
          <img src={user?.avatar || ""} alt="avatar" />
        </div>
      </div>

      <div className="games">
        <img
          src="https://play-lh.googleusercontent.com/AFY95yFw1P4ErzREpYWiSRyy6GyFA34pc70dP7MuHfkP12alfktC0Rp2ht-LbPAvO5sg"
          alt="React"
          style={{ backgroundColor: '#61dafb' }}
        />
        <img src="https://cdn-icons-png.flaticon.com/512/2721/2721616.png" alt="Front-en" style={{ backgroundColor: 'orange' }} />
        <img src="https://cdn-icons-png.flaticon.com/512/6132/6132221.png" alt="C#" style={{ backgroundColor: 'violet' }} />
        <img src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png" alt="Javascript" style={{ backgroundColor: 'yellow' }} />
      </div>

      <div className="friends">
        <div>
          <div className="status online"></div>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR8QOHASjkYcbA8XeEE25AVowu25QSfN_qkPUV4g8mEUEamWYx-WMo3eLqpNZeEnHnEfg&usqp=CAU "
            alt=""
            style={{ border: '2px solid green' }}
          />
        </div>
        <div>
          <div className="status busy"></div>
          <img
            src="https://http2.mlstatic.com/D_NQ_NP_860504-MLB41813292930_052020-O.jpg"
            alt="Another"
            style={{ border: '2px solid red' }}
          />
        </div>
        <div>
          <img
            src="https://play-lh.googleusercontent.com/p7rx-TDw8mSXmnN5oreMbOrC6FTumoRsnz8rDxUHL6-7xYtLlzcyj1GS8UKyBx5eJg"
            alt="mario"
            style={{ border: '2px solid red' }}
          />
        </div>
      </div>
    </nav>
  )
}