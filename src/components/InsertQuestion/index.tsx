import { useState, useEffect } from 'react'
import Highlight from 'react-highlight'
import { useGame } from '../../hooks/use-game'
import { convertMilisecondsToTime } from '../../utils/convertMilisecondsToTime'
import InsertAnswerBox from '../InsertAnswerBox'
import { v4 as uuidv4 } from 'uuid';
import './style.scss'

export default function InsertQuestion(props: any) {

  const { insertQuestion, editQuestion } = useGame()

  const [questionText, setQuestionText] = useState("")
  const [code, setCode] = useState("")
  const [codeStatus, setCodeStatus] = useState(false)
  const [time, setTime] = useState(20000)
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    setCode(props.question.codeText)
    setTime(props.question.time || 20000)
    setQuestionText(props.question.question || "")
    setAnswers(props.question.answers || [])
    setCodeStatus(props.question.code || false)
    console.log(props.question)
  }, [props?.question])

  function toggleVisibleCodeArea(e: any) {

    if (e.target.value === "yes") {
      setCodeStatus(true)
      document.querySelector('#code-text')?.classList.remove('hide')
      document.querySelector('.code-box')?.classList.remove('hide')
    } else {
      setCodeStatus(false)
      document.querySelector('#code-text')?.classList.add('hide')
      document.querySelector('.code-box')?.classList.add('hide')
    }
  }

  function insertCodeInQuestion(e: any) {
    if (e.target.innerHTML === "Salvar código") {
      document.querySelector('.code-box')?.classList.remove('top')
      e.target.innerHTML = "Editar código"
    } else {
      document.querySelector('.code-box')?.classList.add('top')
      e.target.innerHTML = "Salvar código"
    }
  }

  function toggleInsertQuestion() {
    let uuid = uuidv4()
    insertQuestion({
      id: uuid,
      question: questionText,
      code: codeStatus,
      codeText: code,
      time
    })
  }

  function toggleEditQuestion() {
    editQuestion({
      id: props.question.id,
      question: questionText,
      code: codeStatus,
      codeText: code,
      time
    })
  }

  function closeInsertQuestionComponent() {
    document.querySelector('.insert-new-question')?.classList.add('question-hide')
  }

  return (
    <div className={`insert-new-question ${props.class}`}>

      <div className="insert-question">
        <div className="question">
          <h2>Escreva sua pergunta</h2>
          <textarea
            onChange={e => setQuestionText(e.target.value)}
            value={questionText}
          />
        </div>

        <div className="code">
          <div className="option">
            <label htmlFor="code">Tem código?</label>
            <select onChange={toggleVisibleCodeArea}>
              <option value="no">Não</option>
              <option value="yes" selected={props.question.code}>Sim</option>
            </select>
          </div>

          <textarea
            className={props.question.code ? "" : "hide"}
            id="code-text"
            onChange={e => setCode(e.target.value)}
            value={code}
          />

          <div className={`code-box top ${props.question.code ? "" : "hide"}`} >
            <Highlight className="code-area">
              {code}
            </Highlight>
            <button onClick={insertCodeInQuestion}>Salvar código</button>
          </div>
        </div>
      </div>

      <div className="insert-answers">

        <InsertAnswerBox
          id="answer-code-1"
          answer="answerOne"
          answerExists={props.question.answers && answers[0]}
          correctAnswer={props.question.correctAnswer}
        />

        <InsertAnswerBox
          id="answer-code-2"
          answer="answerTwo"
          answerExists={props.question.answers && answers[1]}
          correctAnswer={props.question.correctAnswer}
        />

        <InsertAnswerBox
          id="answer-code-3"
          answer="answerThree"
          answerExists={props.question.answers && answers[2]}
          correctAnswer={props.question.correctAnswer}
        />

        <InsertAnswerBox
          id="answer-code-4"
          answer="answerFour"
          answerExists={props.question.answers && answers[3]}
          correctAnswer={props.question.correctAnswer}
        />
      </div>

      <div className="time">
        <h2>Tempo de resposta</h2>
        <input
          type="range"
          min={20000}
          max={300000}
          onChange={e => setTime(e.target.valueAsNumber)}
          value={time}
        />
        <p>{convertMilisecondsToTime(time)}</p>
      </div>

      <div className="buttons">
        <button onClick={closeInsertQuestionComponent} className="cancel">Cancelar</button>
        {props.question.id ?
          <button onClick={toggleEditQuestion} className="ok">Editar pergunta</button>
          :
          <button onClick={toggleInsertQuestion} className="ok">Inserir pergunta</button>
        }
      </div>
    </div>
  )
}