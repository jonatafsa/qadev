import { useEffect, useRef, useState } from 'react';
import Highlight from 'react-highlight'

import { BsHourglassTop, BsPlusCircleFill } from 'react-icons/bs';
import { FaPlay } from 'react-icons/fa';
import { toast } from 'react-toastify';

import Expbar from '../../components/Expbar';
import Menu from '../../components/Menu';
import Modal from '../../components/Modal/Modal'
import Rightbar from '../../components/Right-bar';
import { useModal } from '../../hooks/use-modal';
import errorSound from '../../assets/sounds/error.wav';
import hitSound from '../../assets/sounds/hit.wav';

import './style.scss'
import { get, getDatabase, ref } from 'firebase/database';
import { getTimeOfGame } from '../../utils/getTimeOfGame';
import { useExp } from '../../hooks/use-experience';
import { useGame } from '../../hooks/use-game';
import { Link, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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
  answers: AnswersProps[]
  correctAnswer: number
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

interface ScoreProps {
  gameId: string;
  questionId: string;
  correct: boolean;
}

interface rankingProps {
  date: number
  hitPercent: number
  id: string
  score: ScoreProps[]
  name: string
  cover: string
}

interface User {
  avatar: string;
  nickName: string;
}

export default function Game() {

  const { expUpdate } = useExp();
  const { insertUserRanking } = useGame()

  const [activeQuestion, setActiveQuestion] = useState(999)
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [answerSelected, setAnswerSelected] = useState("")
  const [initTimeout, setInitTimeout] = useState<any>()
  const [game, setGame] = useState({} as Game)
  const [questions, setQuestions] = useState<QuestionsProps[]>([])
  const [score, setScore] = useState<ScoreProps[]>([])
  const [ranking, setRanking] = useState<rankingProps[]>([])
  const [rankOne, setRankOne] = useState<User>({} as User)
  const [rankTwo, setRankTwo] = useState<User>({} as User)
  const [rankThree, setRankThree] = useState<User>({} as User)

  useEffect(() => {
    const gameId = new URL(window.location.href).searchParams.get('id')
    const db = getDatabase()
    const gameRef = ref(db, 'games/' + gameId)

    get(gameRef).then((snapshot) => {
      if (snapshot.exists()) {
        setGame(snapshot.val())
        setQuestions(snapshot.val().questions)

        //set 3 top hitPercent of game
        const rankingRef = snapshot.val().ranking
        const rankingArray = Object.keys(rankingRef).map((key) => rankingRef[key])
        const rankingSorted = rankingArray.sort((a, b) => b.hitPercent - a.hitPercent).slice(0, 3)
        setRanking(rankingSorted)

        //set 1st, 2nd and 3rd of ranking
        const rankOneRef = ref(db, 'users/' + rankingSorted[0].id)
        get(rankOneRef).then((snapshot) => { setRankOne(snapshot.val()) })
        const rankTwoRef = ref(db, 'users/' + rankingSorted[1].id)
        get(rankTwoRef).then((snapshot) => { setRankTwo(snapshot.val()) })
        const rankThreeRef = ref(db, 'users/' + rankingSorted[2].id)
        get(rankThreeRef).then((snapshot) => { setRankThree(snapshot.val()) })

      } else {
        toast.error("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [])

  useEffect(() => {
    if (activeQuestion !== 999 && activeQuestion < questions.length - 1) {
      const prepareForTheNextQuestion = setTimeout(() => {
        nextQuestion()
      }, questions[activeQuestion].time);

      return () => clearTimeout(prepareForTheNextQuestion);
    }

  }, [activeQuestion]);

  //Inicia o jogo trazendo a primeira pergunta
  function startNewGame() {
    //Define a primeira pergunta
    setActiveQuestion(0)
    //Remove a tela de detalhes do game
    document.querySelector('.game-details')?.classList.add('puff-out-center')
    //Exibe a tela de  perguntas
    document.querySelector('.game-questions')?.classList.add('puff-in-center')
    //Exibe a barra de tempo
    document.querySelector('.timer-bar')?.classList.add('timer-animation')
    //Começa a contar o tempo na barra
    document.body.style.setProperty('--timer', `${questions[0].time / 1000}s`)

    //Define a primeira pergunta
    setActiveQuestion(0)
    //define a reposta da primeira pergunta
    setCorrectAnswer(questions[0].correctAnswer.toString())

    //Pula para a próxima pergunta
    setInitTimeout(setTimeout(() => {
      nextQuestion()
    }, questions[0].time))
  }

  function selectAnswer(e: any) {

    if (e.target.classList.contains('selected')) {
      e.target.classList.remove('selected')
      document.body.classList.remove('selected')
      return
    }

    document.querySelectorAll('.answer').forEach(answer => {
      answer.classList.remove('selected')
    })
    e.target.classList.add('selected')
    document.body.classList.add('selected')
    setAnswerSelected(e.target.id)
  }

  //Função que gera a próxima pergunta
  function nextQuestion() {

    const timer = document.querySelector('.timer-bar')
    timer?.before(timer?.cloneNode(true))

    // //Limpa o timer visual
    // document.querySelector('.timer')?.classList.remove('timer-animation')
    //Limpa o timeout de chamada se houver
    clearTimeout(initTimeout)

    //Remove a classe selected de todas as respostas
    document.querySelectorAll('.answer').forEach(answer => {
      answer.classList.remove('selected')
    })

    //Verifica se a resposta selecionada é a correta
    if (answerSelected === correctAnswer && answerSelected !== "") {
      //Adiciona o som e mensagem de acerto
      document.querySelector('.hit-message')?.classList.add('show-message')
      new Audio(hitSound).play()

      //Adiciona o score
      let scoreArr = score
      score.push({
        gameId: game.id,
        questionId: questions[activeQuestion].id,
        correct: true,
      })
      setScore(scoreArr)
      setAnswerSelected("")
    } else {
      //Adiciona o som e mensagem de erro
      document.querySelector('.error-message')?.classList.add('show-message')
      new Audio(errorSound).play()

      //Adiciona o score
      let scoreArr = score
      score.push({
        gameId: game.id,
        questionId: questions[activeQuestion].id,
        correct: false,
      })
      setScore(scoreArr)
      setAnswerSelected("")
    }

    //Remove a mensagem de acerto ou erro
    setTimeout(() => {
      document.querySelector('.error-message')?.classList.remove('show-message')
      document.querySelector('.hit-message')?.classList.remove('show-message')
    }, 1000)

    //Verifica se a pergunta atual é a última, se caso for, finaliza o jogo
    if (activeQuestion === (questions.length - 1)) {
      document.querySelector('.game-questions')?.classList.remove('puff-in-center')
      document.querySelector('.game-score')?.classList.add('puff-in-center')
      document.querySelector('.medal')?.classList.add('slit-in-vertical')
      document.querySelector('.congratulations-text')?.classList.add('text-pop-up-top')

      expUpdate(getExpSum())
      insertUserRanking(game.id, score)
      return
    }

    //Define o tempo da próxima pergunta no timer visual
    document.body.style.setProperty('--timer', `${questions[activeQuestion + 1].time / 1000}s`)

    //Sobe em 1 o index da questão, fazendo assim aparecer a próxima questão
    setActiveQuestion(activeQuestion + 1)
    console.log("activeQuestion", activeQuestion);

    //Define a resposta correta da próxima questão
    setCorrectAnswer(questions[activeQuestion + 1].correctAnswer.toString())
  }

  function getHitQuestions() {
    return score.filter((item) => item.correct === true).length
  }

  function getExpSum() {
    let totalExp = game.exp
    let questionExp = totalExp / questions.length
    let hit = score.filter((item) => item.correct === true).length

    return Math.floor(hit * questionExp)
  }

  function getImageWithMedal() {
    let image: any
    let hit = score.filter((item) => item.correct === true).length

    //pegar porcentagem das questões acertadas
    let percentage = (hit / questions.length) * 100

    percentage > 40 && hit < 60 && (image = <img className="medal" src="/medal-gold.svg" alt="" />)
    percentage <= 40 && (image = <img className="medal" src="/medal-silver.svg" alt="" />)
    percentage >= 60 && (image = <img className="medal" src="/medal-vip-bronze.svg" alt="" />)
    percentage >= 80 && (image = <img className="medal" src="/medal-vip-silver.svg" alt="" />)
    percentage === 100 && (image = <img className="medal" src="/medal-vip-gold.svg" alt="" />)

    return image
  }

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

          <div className="game-details">
            <div className="game-header">
              <div className="image">
                <img src={game.cover} alt="" />

                <div className="header-details">
                  <h1>{game.name}</h1>

                  <div className="tags">
                    {game.categories?.map(category => (
                      <span key={category}>{category}</span>
                    ))}
                  </div>

                  <p>{game.description}</p>
                </div>
              </div>
            </div>

            <div className="header-bottom">
              <div className="element">
                <BsHourglassTop /> <p> {getTimeOfGame(game.questions || [])} minutos</p>
              </div>

              <div className="element">
                <BsPlusCircleFill /> <p> {game.exp} exp</p>
              </div>

              {ranking[0] && (
                <span className="rank-first">
                  <img src={rankOne.avatar || "https://media.istockphoto.com/vectors/missing-image-of-a-person-placeholder-vector-id1288129985?k=20&m=1288129985&s=612x612&w=0&h=OHfZHfKj0oqIDMl5f_oRqH13MHiB63nUmySYILbWbjE="} alt="Avatar" />
                  <img src="/icon-first.svg" className="icon-medal" />
                  <p>{rankOne.nickName || "Sem nickname"}</p>
                </span>
              )}

              {ranking[1] && (
                <span className="rank-second">
                  <img src={rankTwo.avatar || "https://media.istockphoto.com/vectors/missing-image-of-a-person-placeholder-vector-id1288129985?k=20&m=1288129985&s=612x612&w=0&h=OHfZHfKj0oqIDMl5f_oRqH13MHiB63nUmySYILbWbjE="} alt="Avatar" />
                  <img src="/icon-second.svg" className="icon-medal" />
                  <p>{rankTwo.nickName || "Sem nickname"}</p>
                </span>
              )}

              {ranking[2] && (
                <span className="rank-third">
                  <img src={ranking[2].cover} />
                  <img src="/icon-third.svg" />
                  <p>{ranking[2].name}</p>
                </span>
              )}

              <div className="play" onClick={startNewGame}><FaPlay /></div>
            </div>
          </div>

          <div className="game-questions">
            <div className="question">
              <h1>{questions[activeQuestion]?.question || ""}</h1>

              {questions[activeQuestion]?.codeText && (
                <Highlight className="question-code">
                  {questions[activeQuestion]?.codeText || ""}
                </Highlight>
              ) || ""}
            </div>

            <div className="answers">
              {questions[activeQuestion]?.answers.map(answer => (
                <div
                  className="answer"
                  key={answer.id}
                  onClick={selectAnswer}
                  onDoubleClick={nextQuestion}
                  id={answer.id.toString()}
                >
                  {answer.code ? (
                    <Highlight className="code">
                      {answer.answer}
                    </Highlight>
                  ) : <p>{answer.answer}</p>}
                </div>
              )) || ""}
            </div>

            <button className="onSelectedAnswer" onClick={nextQuestion}>Confirmar resposta</button>

            <div className="timer">
              <div className="timer-bar"></div>
            </div>
          </div>

          <div className="game-score">

            {getImageWithMedal()}

            <div className="score-details">

              <div className="congratulations">
                <img src="/span-border-left.svg" />
                <h2 className="congratulations-text">Parabéns!</h2>
                <img src="/span-border-right.svg" />
              </div>
              <p>Você concluiu o</p>
              <strong>"{game.name}"</strong>

              <div className="status">

                <div className="status-element">
                  <p>Questões</p>
                  <span><strong>{getHitQuestions()}</strong> acertos</span>
                </div>

                <div className="status-element">
                  <p>Experiência</p>
                  <span><strong>{getExpSum()}</strong> exp</span>
                </div>

              </div>
            </div>

            <Link to="/">Voltar</Link>
          </div>
        </div>

        <div className="error-message">
          <img src="https://media0.giphy.com/media/Ll22OhMLAlVDb8UQWe/giphy.gif?cid=6c09b952oklutkuwm0d0z6nfsvrs1svn15jz0nw1rrqvqbll&rid=giphy.gif&ct=s" alt="" />
        </div>

        <div className="hit-message">
          <img src="https://thumbs.gfycat.com/SneakyBarrenHorsefly-max-1mb.gif" alt="" />
        </div>
      </div>
    </>
  )
}