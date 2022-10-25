import './style.scss';
import { FaUserPlus, FaPuzzlePiece } from 'react-icons/fa'
import { BsFillBookmarkStarFill, BsFillPlayFill, BsFillStarFill, BsHourglassTop, BsPlusCircleFill, BsTrophyFill } from 'react-icons/bs'
import { SiHotjar } from 'react-icons/si'
import CardGame from '../../components/CardGameTop';
import CardGameBottom from '../../components/CardGameBottom';
import { Link, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useModal } from '../../hooks/use-modal';
import Menu from '../../components/Menu';
import Rightbar from '../../components/Right-bar';
import Expbar from '../../components/Expbar';
import { useEffect, useState } from 'react';
import { get, getDatabase, ref, set, update } from 'firebase/database';
import { getTimeOfGame } from '../../utils/getTimeOfGame';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';

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

interface ScoreProps {
  gameId: string;
  questionId: string;
  correct: boolean;
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
  createdBy: string
  createdCover: string
  ranking: {
    [key: string]: {
      date: number
      hitPercent: number
      id: string
      score: ScoreProps[]
    }
  }
}

export default function Home() {

  const { modal } = useModal();
  const [games, setGames] = useState<Game[]>([]);
  const [topGameFirst, setTopGameFirst] = useState<Game>({} as Game);
  const [topGameSecond, setTopGameSecond] = useState<Game>({} as Game);
  const [topGameThird, setTopGameThird] = useState<Game>({} as Game);

  const [width, setWidth] = useState(window.innerWidth);
  const [slidesPerView, setSlidesPerView] = useState(4);


  useEffect(() => {
    const db = getDatabase()
    const gameRef = ref(db, 'games/')

    get(gameRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data: Game[] = Object.values(snapshot.val())
        setGames(data)

        data.forEach((key: any, value) => {
          key.id === "f9594326-5db9-40da-b171-bae83156452a" && setTopGameFirst(key)
          key.id === "d2f545e8-2fe8-45a7-b4df-9b926975270c" && setTopGameSecond(key)
          key.id === "1cd3e915-58f5-4114-be0f-8f53a8d88b27" && setTopGameThird(key)
        })

      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    })
  }, [])

  //get width of page
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1200) {
        setSlidesPerView(1)
      }
      if (window.innerWidth >= 1201 && window.innerWidth < 1599) {
        setSlidesPerView(2)
      }
      if (window.innerWidth >= 1600 && window.innerWidth < 2099) {
        setSlidesPerView(3)
      }
      if (window.innerWidth > 2100) {
        setSlidesPerView(4)
      }
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize)
    handleResize()
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
                <a href="#" className="active"> <BsFillBookmarkStarFill /> Todos os jogos</a>
                <a href="#"> <BsFillStarFill /> Top Games</a>
                <a href="#"> <SiHotjar /> Upcoming</a>
                <a href="#"> <BsTrophyFill /> Líderes</a>
                <a href="#"> <FaPuzzlePiece /> Free to Play</a>
              </div>

              <div className="tab-content" id="dev-choice">
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={slidesPerView}
                  pagination={{ clickable: true }}
                  navigation={true}
                  scrollbar={{ draggable: true }}
                  autoplay={{
                    delay: 5000,
                    reverseDirection: true,
                  }}
                  speed={1800}
                  loop={true}
                  onSlideChange={() => console.log('slide change')}
                  onSwiper={(swiper) => console.log(swiper)}
                  className="swiper-container"
                >
                  {games.map((game) => (
                    <SwiperSlide>
                      <Link to={`/game/param?id=${game.id}`}>
                        <CardGameBottom
                          image={game.cover}
                          userTop={`${game.createdBy} - 234`}
                          userTopImage={game.createdCover || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTumrVUqlij3LaHLF-oz8vE7hLWPbC2pWywZEi5uiYZeAX0W7kPUkHiaeM0z1P-ItydW6A&usqp=CAU"}
                          title={game.name}
                          tags={game.categories}
                        />
                      </Link>
                    </SwiperSlide>
                  ))}

                </Swiper>

              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  )
}