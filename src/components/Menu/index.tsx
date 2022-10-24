import { useEffect } from "react";
import { BsMegaphoneFill } from "react-icons/bs";
import { FaPlus, FaUserAlt } from "react-icons/fa";
import { IoIosBookmarks } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { RiGameFill, RiLogoutBoxFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useModal } from "../../hooks/use-modal";
import Modal from "../Modal/Modal";
import ModalLogout from "../Modal/Modal-logout";
import './style.scss'


export default function Menu() {

  useEffect(() => {

    const path = window.location.pathname.replace('/', '').split('/')[0] || 'home'
    document.querySelectorAll('li').forEach((el) => el.classList.remove('menu-active'));
    const active = document.querySelector('#' + path) as HTMLLIElement
    active.classList.add('menu-active');

  }, [window.location.search])

  const { modalChange, modal } = useModal();

  function handleLogout() {
    modalChange('', <ModalLogout />)
  }

  return (
    <div className="menu">
      <Modal title={modal?.title}>{modal?.content}</Modal>
      <ul>
        <Link to="/"><li className="menu-active" id="home"><IoHome /></li></Link>
        <li id="game"><RiGameFill /></li>
        <Link to='/user'><li id="user"><FaUserAlt /></li></Link>
        <Link to='/insert-new-game'><li id="insert-new-game"><FaPlus /></li></Link>
        <li><BsMegaphoneFill /></li>
        <li onClick={handleLogout}><RiLogoutBoxFill /></li>
      </ul>
    </div>
  )
}