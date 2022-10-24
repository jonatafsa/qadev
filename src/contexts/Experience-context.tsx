//createContext - disponibiliza uma forma de passar dados entre a árvore de componentes
//sem precisar passar props manualmente em cada nível.
//ReactNode - O tipo ou valor primário que é criado ao usar o React
import { createContext, useState, ReactNode, useEffect } from 'react';

//Importações do firebase Realtime Database
import {
  getDatabase,
  onValue,
  ref as DatabaseRef,
  set as DatabaseSet,
  get as DatabaseGet,
  child,
  ref,
  get,
} from "firebase/database";

//Import dos Cookies
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/use-auth';
import app from '../services/firebase';

//Tipagem do Componente PAI(ChallengesProvider)
interface ExperienceProviderProps {
  children: ReactNode;
}

//Tipagem dos challenges(desafios)
interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

//Tipagem dos métodos e variáveis dentro do Context
interface ExperienceContextData {
  level: number;
  levelUp: () => void;
  expUpdate: (amount: number) => void;
  currentExperience: number;
  activeChallenge: boolean;
  experienceToNextLevel: number;
  nickName: string;
}

//Exporta todos os métodos e variáveis do Context
export const ExperienceContext = createContext({} as ExperienceContextData);

//Exporta o Componente PAI responsável pelos Challenges(Desafios)
export function ExperienceProvider({ children, ...rest }: ExperienceProviderProps) {

  const { user } = useAuth()

  //Variável resposável pelo level
  const [level, setLevel] = useState(1);

  //variável responsável pela contagem de Experiência
  const [currentExperience, setCurrentExperience] = useState(0);

  //variável responsável a dizer se um desafio está ativo
  const [activeChallenge, setActiveChallenge] = useState(false);

  //variável responsável pelo apelido do usuário
  const [nickName, setNickName] = useState('');

  //variável responsável por calcular a experiência para o próximo nível
  const experienceToNextLevel = Math.pow((level + 1) * 8, 2)

  //useEffect responsável por requisitar permissão no navegador
  useEffect(() => {
    Notification.requestPermission()

    const db = getDatabase(app)
    const userRef = DatabaseRef(db, 'users/' + user?.uid)

    onValue(userRef, ((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setLevel(data.level)
        setCurrentExperience(data.currentExperience)
        setNickName(data.nickName)
        Cookies.set('level', String(data.level))
        Cookies.set('currentExperience', String(data.currentExperience))
        Cookies.set('nickName', String(data.nickName))
      } else {
        DatabaseSet(userRef, {
          level: 1,
          currentExperience: 0,
        }).then(() => {
          setLevel(1)
          setCurrentExperience(0)
        })
      }
    }))
  }, [user?.uid])

  useEffect(() => {
    //porcentagem de experiencia
    const porcentagem = (currentExperience * 100) / experienceToNextLevel;
    document.body.style.setProperty('--porcentagem', `${porcentagem}%`)
    document.body.style.setProperty('--number', `${porcentagem}`)

    Cookies.set('level', String(level))
    Cookies.set('currentExperience', String(currentExperience))

  }, [currentExperience])

  //Função responsável por subir o nível do usuário e Abrir o Modal
  function levelUp() {
    const db = getDatabase()
    const expRef = DatabaseRef(db, 'users/' + user?.uid + '/level')

    DatabaseSet(expRef, level + 1)

    setCurrentExperience(currentExperience - experienceToNextLevel)
    setLevel(level + 1)
    toast.success('Parabéns, você subiu de nível!')

  }

  function expUpdate(amount: number) {
    const db = getDatabase()
    const expRef = DatabaseRef(db, 'users/' + user?.uid + '/currentExperience')

    DatabaseSet(expRef, currentExperience + amount)
    setCurrentExperience(currentExperience + amount)
  }

  if (currentExperience > experienceToNextLevel) {
    levelUp()
  }

  return (
    <ExperienceContext.Provider

      //Exportações de todos os métodos_e_variáveis(ChallengesContext) dentro do Componente PAI(ChallengesProvider)
      value={{
        level,
        levelUp,
        expUpdate,
        currentExperience,
        activeChallenge,
        experienceToNextLevel,
        nickName
      }}
    >
      {children}
    </ExperienceContext.Provider >
  )
}