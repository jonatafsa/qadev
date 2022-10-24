import { useAuth } from "../../hooks/use-auth";
import { useModal } from "../../hooks/use-modal"

export default function ModalLogout() {

  const { logout } = useAuth();
  const { closeModal } = useModal()

  return (
    <div className="modal-logout">
      <h2>Tem certeza que deseja sair?</h2>

      <div className="modal-logout-buttons">
        <button className="modal-logout-button-cancel" onClick={closeModal} >Não</button>
        <button className="modal-logout-button-confirm" onClick={() => logout()} >Sim</button>
      </div>
    </div>
  )
}