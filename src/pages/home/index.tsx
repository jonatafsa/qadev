import './style.scss';
import { FaUserPlus, FaPuzzlePiece } from 'react-icons/fa'
import { BsFillBookmarkStarFill, BsFillPlayFill, BsFillStarFill, BsHourglassTop, BsPlusCircleFill, BsTrophyFill } from 'react-icons/bs'
import { SiHotjar } from 'react-icons/si'
import CardGame from '../../components/CardGameTop';
import CardGameBottom from '../../components/CardGameBottom';
import { Link, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useModal } from '../../hooks/use-modal';
import Modal from '../../components/Modal/Modal';
import Menu from '../../components/Menu';
import Rightbar from '../../components/Right-bar';
import Expbar from '../../components/Expbar';
import { useEffect, useState } from 'react';
import { get, getDatabase, ref, set, update } from 'firebase/database';
import { convertMilisecondsToTime } from '../../utils/convertMilisecondsToTime';
import { getTimeOfGame } from '../../utils/getTimeOfGame';
import { stringify } from '@firebase/util';
import { toast } from 'react-toastify';

interface AnswersProps {
  id: number;
  answer: string;
  code: boolean;
}

interface QuestionsProps {
  id: string;
  question: string;
  code: boolean
  codeText?: string;
  answers?: AnswersProps[]
  correctAnswer?: number
  time: number;
}

//Tipagem dos challenges(desafios)
interface Game {
  id: string;
  cover: string
  name: string
  description: string
  questions: QuestionsProps[]
  exp: number
  categories: string[]
}

export default function Home() {

  const { modal } = useModal();
  const [topGameFirst, setTopGameFirst] = useState<Game>({} as Game);
  const [topGameSecond, setTopGameSecond] = useState<Game>({} as Game);
  const [topGameThird, setTopGameThird] = useState<Game>({} as Game);

  useEffect(() => {
    const db = getDatabase()
    const gameRef = ref(db, 'games/')

    get(gameRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val())

        data.forEach((key: any, value) => {
          key.id === "f9594326-5db9-40da-b171-bae83156452a" && setTopGameFirst(key)
          key.id === "d2f545e8-2fe8-45a7-b4df-9b926975270c" && setTopGameSecond(key)
          key.id === "d2f545e8-2fe8-45a7-b4df-9b926975270c" && setTopGameThird(key)
        })
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    })
  }, [])

  //Condicional que verifica se o usuário está autenticado
  if (typeof window !== 'undefined') {
    const token = Cookies.get('token')
    const nickName = Cookies.get('nickName')

    if (!token) {
      return <Navigate to="/sign" replace />
    }

    if (nickName === "undefined") {
      return <Navigate to="/user" replace />
    }
  }

  function registerRankinkTest() {

    const db = getDatabase();
    const dbRef = ref(db, 'games/d2f545e8-2fe8-45a7-b4df-9b926975270c/ranking/');

    let score = 30

    const newScore = {
      nickName: "Dois teste",
      score,
      id: "teste",
    }

    get(dbRef).then((snapshot) => {

      if (snapshot.exists()) {

        if (!snapshot.val()[0]) {
          update(dbRef, { 0: newScore })
          toast.success("Você está no top 1")
          return
        }

        if (!snapshot.val()[1]) {
          update(dbRef, { 1: newScore })
          toast.success("Você está no top 2")
          return
        }

        if (!snapshot.val()[2]) {
          update(dbRef, { 2: newScore })
          toast.success("Você está no top 3")
          return
        }

        if (score > snapshot.val()[0].score) {
          update(dbRef, { 0: newScore })
          toast.success("Você está no top 1")
          return
        }

        if (score > snapshot.val()[1].score) {
          update(dbRef, { 1: newScore })
          toast.success("Você está no top 2")
          return
        }

        if (score > snapshot.val()[2].score) {
          update(dbRef, { 2: newScore })
          toast.success("Você está no top 3")
          return
        }

        update(dbRef, { "UUID": newScore })

      } else {
        set(dbRef, { 0: newScore })
      }

    })
  }

  return (
    <>
      <Menu />
      <div className="screen">
        <Rightbar />

        <div className="content">
          <Expbar />

          <div className="games-content">
            <div className="top-game">
              <img src={topGameFirst.cover || "https://i.pinimg.com/originals/e2/63/00/e26300c0c746d3163a0f48223c897cee.gif"} alt="" />
              <div className="game-info">
                <span className="game-name">{topGameFirst.name}</span>
                <span className="game-description">{topGameFirst.description}</span>
                {topGameFirst.categories?.map((category) => (
                  <span className="game-category" key={category}>{category}</span>
                ))}
                <div className="game-info-footer">
                  <div className="game-time"> <BsHourglassTop /> {getTimeOfGame(topGameFirst.questions || [])} minutos</div>
                  <div className="game-exp"> <BsPlusCircleFill /> {topGameFirst.exp} exp</div>

                  <div className="game-buttons">
                    <Link to={`/game/param?id=${topGameFirst.id}`}><button className="game-button"><BsFillPlayFill /></button></Link>
                    <button className="game-button"><FaUserPlus /></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="games">

              <CardGame
                id={topGameSecond.id}
                title={topGameSecond.name}
                description={topGameSecond.description}
                image={topGameSecond.cover}
                played={true}
                tags={topGameSecond.categories}
                time={topGameSecond.questions ? getTimeOfGame(topGameSecond.questions) : "0"}
                exp={topGameSecond.exp}
              />

              <CardGame
                id={topGameThird.id}
                title={topGameThird.name}
                description={topGameThird.description}
                image={topGameThird.cover}
                played={true}
                tags={topGameThird.categories}
                time={topGameThird.questions ? getTimeOfGame(topGameThird.questions) : "0"}
                exp={topGameThird.exp}
              />
            </div>
          </div>

          <div className="bottom-content">
            <h2>Your top selection</h2>

            <div className="tabs">
              <div className="tab-links">
                <a href="#" className="active" onClick={registerRankinkTest}> <BsFillBookmarkStarFill /> Escolhas do Desenvolvedor</a>
                <a href="#"> <BsFillStarFill /> Top Games</a>
                <a href="#"> <SiHotjar /> Upcoming</a>
                <a href="#"> <BsTrophyFill /> Líderes</a>
                <a href="#"> <FaPuzzlePiece /> Free to Play</a>
              </div>

              <div className="tab-content" id="dev-choice">
                <CardGameBottom
                  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2qjG5_kBOecctnzB-B_7ITF7RQ6QZmm9PgA&usqp=CAU"
                  userTop="Jonata Santos - 234"
                  userTopImage="http://github.com/jonatafsa.png"
                  title="ReactJS - teste iniciante básico de quatro camadas"
                  tags={['Front-end', 'Cliente']}
                />

                <CardGameBottom
                  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNdfYxLMF2su2mhl5GU0IITKX0aSKlLLR1lw&usqp=CAU"
                  userTop="Avatar - 185"
                  userTopImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR8QOHASjkYcbA8XeEE25AVowu25QSfN_qkPUV4g8mEUEamWYx-WMo3eLqpNZeEnHnEfg&usqp=CAU"
                  title="ReactJS - teste iniciante básico de quatro camadas"
                  tags={['Front-end', 'Cliente']}
                />

                <CardGameBottom
                  image="https://www.grandeporte.com.br/images/banner-curso-1.jpg"
                  userTop="Mário - 384"
                  userTopImage="https://play-lh.googleusercontent.com/p7rx-TDw8mSXmnN5oreMbOrC6FTumoRsnz8rDxUHL6-7xYtLlzcyj1GS8UKyBx5eJg"
                  title="ReactJS - teste iniciante básico de quatro camadas"
                  tags={['Front-end', 'Cliente']}
                />

                <CardGameBottom
                  image="https://thumbs.dreamstime.com/b/programa%C3%A7%C3%A3o-e-desenvolvimento-de-software-p%C3%A1gina-web-banner-c%C3%B3digo-programa-em-tela-processo-codifica%C3%A7%C3%A3o-conceito-aplicativo-173058012.jpg"
                  userTop="Jonata Santos - 234"
                  userTopImage="https://play-lh.googleusercontent.com/p7rx-TDw8mSXmnN5oreMbOrC6FTumoRsnz8rDxUHL6-7xYtLlzcyj1GS8UKyBx5eJg"
                  title="ReactJS - teste iniciante básico de quatro camadas"
                  tags={['Front-end', 'Cliente']}
                />

                {/* <div className="game">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2qjG5_kBOecctnzB-B_7ITF7RQ6QZmm9PgA&usqp=CAU" alt="game1" />

                  <div className="bottom-game">
                    <img src="http://github.com/jonatafsa.png" alt="" />
                    <div className="game-info">
                      <h3>Jonata Santos - 234 <BsFillStarFill style={{ color: 'yellow' }} /> </h3>
                      <p>ReactJS - teste iniciante básico de quatro camadas</p>
                      <div className="tags">
                        <span>Tag 1</span>
                        <span>Tag 2</span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  )
}