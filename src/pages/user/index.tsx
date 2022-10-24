import { getAuth, updateProfile } from 'firebase/auth'
import { getDatabase, ref, update } from 'firebase/database'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { BsCardImage } from 'react-icons/bs'
import { FaHome } from 'react-icons/fa'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Expbar from '../../components/Expbar'
import Menu from '../../components/Menu'
import Rightbar from '../../components/Right-bar'
import { useAuth } from '../../hooks/use-auth'
import { useExp } from '../../hooks/use-experience'
import app from '../../services/firebase'
import './style.scss'

export default function User() {
  const { user } = useAuth()
  const { nickName, level } = useExp()
  const [updateNickName, setUpdateNickName] = useState(nickName)

  function toggleEditImage(e: any) {

    const data = new FormData()
    data.append('image', e.target.files[0])

    fetch('http://localhost:3333/update-avatar', {
      method: 'POST',
      body: data,
    }).then(response => response.json())
      .then(data => {
        const url = 'http://localhost:3333/uploads/' + data[0].path
        const auth = getAuth(app).currentUser
        updateProfile(auth!, {
          photoURL: url,
        }).then(() => {
          // Update successful
          toast.success('Imagem de perfil atualizada com sucesso!')
          const avatar = document.querySelector('#avatar') as HTMLImageElement
          avatar.src = url
        }).catch((error) => {
          // An error occurred
          toast.error('Erro ao atualizar a imagem de perfil!' + error.code)
        })
      }).catch((error) => {
        toast.error('Erro ao atualizar a imagem de perfil!' + error.code)
      })

    // Now you have valid `imageURL` from async call

  }

  function selectContent(e: any) {
    const ul = document.querySelectorAll('li').forEach((el) => el.classList.remove('active'));
    e.target.classList.add('active');
  }

  function updateUser() {
    const db = getDatabase()
    const dbRef = ref(db, 'users/' + user?.uid)

    update(dbRef, {
      nickName: updateNickName,
    }).then(() => toast.success('Nome de usuário atualizado com sucesso!'))
      .catch((error) => toast.error('Erro ao atualizar o nome de usuário!' + error.code))
  }

  //Condicional que verifica se o usuário está autenticado
  if (typeof window !== 'undefined') {
    const token = Cookies.get('token')
    const nickName = Cookies.get('nickName')

    if (!token) {
      return <Navigate to="/sign" replace />
    }
  }

  return (
    <>
      <Menu />

      <div className="screen">

        <div className="user-left">
          <div className="user-left-top">
            <div className="avatar">
              <label htmlFor="insertNewImage"><BsCardImage size={20} /></label>
              <input type="file" name="insertNewImage" id="insertNewImage" onChange={toggleEditImage} />

              <img src={user?.avatar || ""} alt="avatar" id="avatar" />
              <svg>
                <circle cx="100" cy="100" r="98" stroke="black" stroke-width="4" fill="red" />
                <circle cx="100" cy="100" r="98" stroke="black" stroke-width="4" fill="red" />

              </svg>
              <div className="level">{level}</div>
            </div>

            {nickName ? <span>{nickName}#{user?.uid.slice(user.uid.length - 4).toUpperCase()}</span> : <span>Usuário sem nickname</span>}
            <p>{user?.name}</p>
          </div>

          <div className="user-navigation">
            <ul>
              <li onClick={selectContent} className="active"><FaHome /> Dashboard</li>
              <li onClick={selectContent}><FaHome /> Nível</li>
              <li onClick={selectContent}><FaHome /> Mensagens</li>
              <li onClick={selectContent}><FaHome /> Meus Jogos</li>
              <li onClick={selectContent}><FaHome /> Amigos</li>
            </ul>
          </div>
        </div>

        <div className="user-content">

          <div className="user-details">
            <form>
              <label htmlFor="userName">Apelido:</label>
              <input
                type="text"
                name="userName"
                id="userName"
                value={updateNickName}
                onChange={(e) => setUpdateNickName(e.target.value)}
                placeholder="Digite seu apelido para o jogo"
              />
            </form>
          </div>

          <button className="save" onClick={updateUser}>Salvar</button>
        </div>

      </div>
    </>

  )
}