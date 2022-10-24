import { getDatabase, onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import Highlight from 'react-highlight'
import { FaPlus, FaPlusSquare } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Expbar from '../../components/Expbar'
import InsertAnswerBox from '../../components/InsertAnswerBox'
import InsertQuestion from '../../components/InsertQuestion'
import Menu from '../../components/Menu'
import Rightbar from '../../components/Right-bar'
import { useAuth } from '../../hooks/use-auth'
import { useGame } from '../../hooks/use-game'
import { useModal } from '../../hooks/use-modal'
import './style.scss'

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

export default function InsertNewGame() {

  const { user } = useAuth()
  const { modalChange } = useModal()
  const { selectQuestionForEdit, createGame } = useGame()

  const [questions, setQuestions] = useState<QuestionsProps[]>([])
  const [questionForEdit, setQuestionForEdit] = useState<QuestionsProps>({} as QuestionsProps)
  const [categories, setCategoties] = useState([])
  const [category, setCategoty] = useState("")
  const [cover, setCover] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [exp, setExp] = useState(0)

  useEffect(() => {
    const db = getDatabase()
    const dbRef = ref(db, 'users/' + user?.uid + '/questions-for-update')

    onValue(dbRef, res => {
      const data: any = Object.values(res.val() || {})
      setQuestions(data)
      // setCategoties(data.categories)
    })
  }, [user?.uid])


  function toggleScrrenChange() {
    document.querySelector('.games-for-admin')?.classList.add('hide')
    document.querySelector('.insert-game')?.classList.remove('hide')
  }

  function updateImageLogo(e: any) {
    const data = new FormData()
    data.append('image', e.target.files[0])

    fetch('http://localhost:3333/update-avatar', {
      method: 'POST',
      body: data,
    }).then(response => response.json())
      .then(data => {
        const url = 'http://localhost:3333/uploads/' + data[0].path
        setCover(url)
        toast.success('Imagem de capa enviada!')
        const avatar = document.querySelector('#gameLogo') as HTMLImageElement
        avatar.src = url
      }).catch((error) => {
        toast.error('Erro ao atualizar a imagem de perfil!' + error.code)
      })
  }

  function insertCategory() {
    const categoryArr: any = categories
    categoryArr.push(category)
    setCategoties(categoryArr)
    setCategoty("")
  }

  function toggleInsertQuestion() {
    setQuestionForEdit({} as QuestionsProps)
    document.querySelector('.insert-new-question')?.classList.remove('question-hide')
  }

  function toggleEditQuestion(quesntion: QuestionsProps) {
    setQuestionForEdit(quesntion)
    document.querySelector('.insert-new-question')?.classList.remove('question-hide')
    selectQuestionForEdit(quesntion)
  }

  function toggleDeleteQuestion(id: string) {
    modalChange('', <DeleteQuestion id={id} />)
  }

  function togglecreateGame() {
    if (name === "" || cover === "" || description === "") {
      toast.error('Preencha todos os campos!')
    } else {
      const InsertNewGame = {
        id: "",
        name,
        description,
        cover,
        exp,
        categories,
        questions
      }
      createGame(InsertNewGame)
    }
  }

  return (
    <>
      <Menu />
      <div className="screen">
        <Rightbar />
        <div className="content">
          <Expbar />

          <div className="games-for-admin">
            <div className="insert-new-game" onClick={toggleScrrenChange}>
              <h1>Insert new game</h1>
            </div>

            <div className="pendency-games">
              <h1>Pendency games</h1>
            </div>
          </div>

          <div className="insert-game hide">
            <div className="insert-game-left">

              <div className="insert-game-left-top">
                <label htmlFor="insertQuestionImage">Selecione uma imagem de capa</label>
                <input
                  type="file"
                  id="insertQuestionImage"
                  onChange={updateImageLogo}
                />
                <img src="" alt="" id="gameLogo" />
              </div>

              <div className="insert-game-details">

                <input
                  type="text"
                  placeholder="Nome do jogo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <textarea
                  placeholder="Aprensentação seu jogo"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                ></textarea>

                <input
                  type="number"
                  placeholder="Exp recomendada"
                  value={exp}
                  onChange={e => setExp(e.target.valueAsNumber)}
                />

                <div>
                  <input
                    type="text"
                    placeholder="Categoria"
                    onChange={(e) => setCategoty(e.target.value)}
                    value={category}
                  />
                  <FaPlus onClick={insertCategory} />
                </div>

                <div className="insert-new-game-categories">
                  {categories.map((category) => <span key={category}>{category}</span>)}
                </div>
              </div>

              <button onClick={togglecreateGame}>Salvar Game</button>
            </div>

            <div className="insert-game-content">
              <div className="insert-question" onClick={toggleInsertQuestion}>Inserir pergunta </div>

              {questions.map(question => (
                <span className='question-for-edit' key={question.id}>
                  {question.question}
                  <div className="buttons">
                    <img src="./pen.svg" alt="" onClick={() => toggleEditQuestion(question)} />
                    <img src="./delete.svg" onClick={() => toggleDeleteQuestion(question.id)} />
                  </div>
                </span>
              )) || <span className='question-for-edit'>Nenhuma pergunta inserida</span>}
            </div>
          </div>

          <InsertQuestion
            class="question-hide"
            question={questionForEdit}
          />
        </div>
      </div>
    </>
  )
}

function DeleteQuestion({ id }: any) {

  const { closeModal } = useModal()
  const { deleteQuestion } = useGame()

  return (
    <div className="delete">
      <h2>Tem certeza que deseja deletar essa pergunta?</h2>
      <div className="buttons">
        <button onClick={closeModal}>Não</button>
        <button onClick={() => {
          deleteQuestion(id)
          closeModal()
        }}>Sim</button>
      </div>
    </div>
  )
}