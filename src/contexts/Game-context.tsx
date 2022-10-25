//createContext - disponibiliza uma forma de passar dados entre a árvore de componentes
//sem precisar passar props manualmente em cada nível.
//ReactNode - O tipo ou valor primário que é criado ao usar o React
import { createContext, ReactNode } from 'react';

//Importações do firebase Realtime Database
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove
} from "firebase/database";

//Import dos Cookies
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/use-auth';

//Tipagem do Componente PAI(ChallengesProvider)
interface QuestionProviderProps {
  children: ReactNode;
}

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
  createdBy: string
  createdID: string
  createdCover: string
}

interface GameProps {
  gameForEdit?: Game
  createGame: (game: Game) => void
  insertQuestion: (questions: QuestionsProps) => void
  editQuestion: (questions: QuestionsProps) => void
  insertAnswer: (question: AnswersProps) => void
  deleteQuestion: (id: string) => void
  selectCorrectAnswer: (id: string) => void
  selectQuestionForEdit: (question: QuestionsProps) => void
  insertUserRanking: (gameId: string, score: ScoreProps[]) => void
}

interface ScoreProps {
  gameId: string;
  questionId: string;
  correct: boolean;
}


//Exporta todos os métodos e variáveis do Context
export const GameContext = createContext({} as GameProps);

//Exporta o Componente PAI responsável pelos Challenges(Desafios)
export function GameProvider({ children, ...rest }: QuestionProviderProps) {

  const { user } = useAuth()

  let gameForEdit = {
    id: "1",
    cover: 'https://images.unsplash.com/photo-1617670000000-1b1b1b1b1b1b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    name: 'Game 1',
    description: 'Game 1 description',
    questions: [{
      id: "1",
      question: 'Qual a melhor linguagem de programação?',
      code: false,
      codeText: '',
      time: 5000,
      correctAnswer: 1,
      answers: [{
        id: 1,
        answer: 'Javascript',
        code: false
      },
      {
        id: 2,
        answer: 'Python',
        code: false
      },
      {
        id: 3,
        answer: 'C#',
        code: false
      },
      {
        id: 4,
        answer: 'Java',
        code: false
      }]
    }],
    exp: 100,
    categories: ['Front-end', 'Back-end'],
    createdBy: "game.createdBy",
    createdID: "game.createdID",
    createdCover: "game.createdCover",
  }

  let answerForEdit: AnswersProps[] = [{
    id: 1,
    answer: '',
    code: false
  },
  {
    id: 2,
    answer: '',
    code: false
  },
  {
    id: 3,
    answer: '',
    code: false
  },
  {
    id: 4,
    answer: '',
    code: false
  }]

  let questionForEdit: QuestionsProps = {
    id: "",
    question: '',
    code: false,
    codeText: '',
    time: 5000,
    correctAnswer: 0,
    answers: answerForEdit
  }

  function createGame(game: Game) {

    const newGame = {
      id: game.id,
      cover: game.cover,
      createdBy: game.createdBy,
      createdID: game.createdID,
      createdCover: game.createdCover,
      name: game.name,
      description: game.description,
      exp: game.exp,
      categories: game.categories,
      questions: game.questions,
      insertIn: new Date()
    }

    const db = getDatabase()
    const dbRef = ref(db, 'games/' + newGame.id)

    set(dbRef, newGame)
      .then(() => {
        toast.success('Game criado com sucesso!')
        document.querySelector('.insert-game')?.classList.add('hide')
        document.querySelector('.games-for-admin')?.classList.remove('hide')
      }).catch((error) => { toast.error('Erro ao criar o game!') })
  }

  function insertQuestion(question: QuestionsProps) {
    questionForEdit.id = question.id
    questionForEdit.question = question.question
    questionForEdit.code = question.code
    questionForEdit.codeText = question.codeText || ""
    questionForEdit.time = question.time
    questionForEdit.answers = answerForEdit

    if (questionForEdit.id === '' || questionForEdit.question === '') {
      toast.error('Insira todos os dados antes de continuar')
      return
    }

    if (answerForEdit[0].answer === '' || answerForEdit[1].answer === '' || answerForEdit[2].answer === '' || answerForEdit[3].answer === '') {
      toast.error('Nenhuma resposta pode ficar em branco')
      return
    }

    console.log(questionForEdit)
    const db = getDatabase();
    const dbRef = ref(db, 'users/' + user?.uid + '/questions-for-update/' + questionForEdit.id);

    set(dbRef, questionForEdit)
      .then(() => toast.success('Questão inserida com sucesso!'))
      .catch((error) => toast.error('Erro ao inserir questão!'))

    document.querySelector('.insert-new-question')?.classList.add('question-hide')

  }

  function editQuestion(question: QuestionsProps) {
    questionForEdit.id = question.id
    questionForEdit.question = question.question
    questionForEdit.code = question.code
    questionForEdit.codeText = question.codeText || ""
    questionForEdit.time = question.time
    questionForEdit.answers = answerForEdit

    if (questionForEdit.id === '' || questionForEdit.question === '') {
      toast.error('Insira todos os dados antes de continuar')
      return
    }

    if (answerForEdit[0].answer === '' || answerForEdit[1].answer === '' || answerForEdit[2].answer === '' || answerForEdit[3].answer === '') {
      toast.error('Nenhuma resposta pode ficar em branco')
      return
    }

    const db = getDatabase();
    const dbRef = ref(db, 'users/' + user?.uid + '/questions-for-update/' + questionForEdit.id);

    update(dbRef, questionForEdit)
      .then(() => toast.success('Questão Editada com sucesso!'))
      .catch((error) => toast.error('Erro ao inserir questão!'))

    document.querySelector('.insert-new-question')?.classList.add('question-hide')

  }

  function selectCorrectAnswer(id: string) {
    id === '' && (questionForEdit.correctAnswer = 0)
    id === 'answerOne' && (questionForEdit.correctAnswer = 1)
    id === 'answerTwo' && (questionForEdit.correctAnswer = 2)
    id === 'answerThree' && (questionForEdit.correctAnswer = 3)
    id === 'answerFour' && (questionForEdit.correctAnswer = 4)
  }

  function insertAnswer(answer: AnswersProps) {
    answerForEdit[answer.id - 1] = answer
    console.log(answerForEdit)
    console.log(answer)
  }

  function selectQuestionForEdit(question: QuestionsProps) {
    questionForEdit = question
    answerForEdit = question.answers as AnswersProps[]
  }

  function deleteQuestion(id: string) {
    const db = getDatabase();
    const dbRef = ref(db, 'users/' + user?.uid + '/questions-for-update/' + id);

    remove(dbRef)
      .then(() => toast.success('Questão deletada com sucesso!'))
      .catch((error) => toast.error('Erro ao deletar questão!'))
  }

  async function insertUserRanking(gameId: string, score: ScoreProps[]) {

    let hit = score.filter((item) => item.correct === true).length
    let hitPercent = (hit / score.length) * 100

    const db = getDatabase();
    const dbRef = ref(db, 'games/' + gameId + '/ranking/');
    const dbRefUser = ref(db, 'users/' + user!.uid);

    const userRef = await get(dbRefUser)

    let newScore = {
      id: user?.uid,
      name: userRef.val().nickName,
      cover: user?.avatar,
      hitPercent,
      score,
      date: new Date().getTime()
    }

    get(dbRef).then((snapshot) => {

      if (snapshot.exists()) {
        if (user!.uid === snapshot.val()[user!.uid] && snapshot.val()[user!.uid].hitPercent < hitPercent) {
          snapshot.val()[user!.uid].hitPercent < hitPercent && update(dbRef, { [user!.uid]: newScore })
          return
        } else {
          update(dbRef, { [user!.uid]: newScore })
        }
      } else {
        set(dbRef, { [user!.uid]: newScore })
      }

    })
  }

  return (
    <GameContext.Provider
      //Exportações de todos os métodos_e_variáveis(ChallengesContext) dentro do Componente PAI(ChallengesProvider)
      value={{
        gameForEdit,
        createGame,
        insertQuestion,
        editQuestion,
        deleteQuestion,
        insertAnswer,
        selectCorrectAnswer,
        selectQuestionForEdit,
        insertUserRanking
      }}
    >
      {children}
    </GameContext.Provider >
  )
}