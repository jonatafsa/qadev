import { useState, useEffect } from 'react'
import Highlight from 'react-highlight';
import { useGame } from '../../hooks/use-game';
import './style.scss';

interface AnswersProps {
  id: number;
  answer: string;
  code: boolean;
}

interface InsertAnswerBoxProps {
  id: "answer-code-1" | "answer-code-2" | "answer-code-3" | "answer-code-4"
  answer: "answerOne" | "answerTwo" | "answerThree" | "answerFour"
  answerExists?: AnswersProps
  correctAnswer?: number
}

export default function InsertAnswerBox(props: InsertAnswerBoxProps) {

  const { selectCorrectAnswer, insertAnswer } = useGame()

  const [answerOne, setAnswerOne] = useState("")
  const [answerTwo, setAnswerTwo] = useState("")
  const [answerThree, setAnswerThree] = useState("")
  const [answerFour, setAnswerFour] = useState("")

  useEffect(() => {
    const textarea: any = document.querySelector(`#textarea-${props.id}`)
    textarea.value = props.answerExists?.answer || ""

    const checkboxWithAnswer = document.querySelector(`#answer-${props.id}`)
    toggleDefineAnswer(checkboxWithAnswer)


    const checkboxWithCode: any = document.querySelector(`#${props.id}`)

    if (props.answerExists?.code === true) {
      document.querySelector('.' + props.id)?.classList.remove('hide')
      checkboxWithCode.checked = true
      changeAnswer(props.answer, textarea.value)
    } else {
      document.querySelector('.' + props.id)?.classList.add('hide')
      checkboxWithCode.checked = false
    }
  }, [props.answerExists])

  function toggleAnswerCode(e: any) {
    document.querySelector('.' + e.target.id)?.classList.toggle('hide')
    const textarea: any = document.querySelector(`#textarea-${e.target.id}`)
    changeAnswer(props.answer, textarea.value)
  }

  function getAnswerProps(e: any) {
    switch (e) {
      case "answerOne": return answerOne
      case "answerTwo": return answerTwo
      case "answerThree": return answerThree
      case "answerFour": return answerFour
    }
  }

  function changeAnswer(answer: string, e: any) {
    const code: any = document.querySelector('#' + props.id)

    if (props.answer === "answerOne") {
      setAnswerOne(e)
      insertAnswer({ id: 1, answer: e, code: code.checked })
    }
    if (props.answer === "answerTwo") {
      setAnswerTwo(e)
      insertAnswer({ id: 2, answer: e, code: code.checked })
    }
    if (props.answer === "answerThree") {
      setAnswerThree(e)
      insertAnswer({ id: 3, answer: e, code: code.checked })
    }
    if (props.answer === "answerFour") {
      setAnswerFour(e)
      insertAnswer({ id: 4, answer: e, code: code.checked })
    }

  }

  function toggleShowHideCode(e: any) {
    document.querySelector('.' + props.id)?.classList.toggle('code-box-top')

    toggleRotate(e)
  }

  function toggleRotate(e: any) {

    if (e.target.classList.contains('rotate')) {
      e.target.classList.remove('rotate')
    } else {
      e.target.classList.add('rotate')
    }
  }

  function toggleDefineAnswer(e: any) {

    if (e.target) {
      if (e.target.checked === true) {
        document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.disabled = true })
        e.target.disabled = false
        selectCorrectAnswer(props.answer)
      } else {
        document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.disabled = false })
        selectCorrectAnswer("")
      }

      return
    }

    if (props.correctAnswer === undefined) {
      document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.disabled = false })
      document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.checked = false })
    }

    if (props.answer === "answerOne" && props.correctAnswer === 1) {
      document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.disabled = true })
      document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.checked = false })
      e.disabled = false
      e.checked = true
      return
    }
    if (props.answer === "answerTwo" && props.correctAnswer === 2) {
      document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.disabled = true })
      document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.checked = false })
      e.disabled = false
      e.checked = true
      return
    }
    if (props.answer === "answerThree" && props.correctAnswer === 3) {
      document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.disabled = true })
      document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.checked = false })
      e.disabled = false
      e.checked = true
      return
    }
    if (props.answer === "answerFour" && props.correctAnswer === 4) {
      document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.disabled = true })
      document.querySelectorAll('.toggle__input')?.forEach((input: any) => { input.checked = false })
      e.disabled = false
      e.checked = true
      return
    }

    // switch (props.answer) {
    //   case "answerOne": {
    //     if (props.correctAnswer === 1) {
    //       e.disabled = false
    //       return e.checked = true
    //     }
    //   }
    //   case "answerTwo": {
    //     if (props.correctAnswer === 2) {
    //       return e.checked = true
    //     }
    //   }
    //   case "answerThree": {
    //     if (props.correctAnswer === 3) {
    //       return e.checked = true
    //     }
    //   }
    //   case "answerFour": {
    //     if (props.correctAnswer === 4) {
    //       return e.checked = true
    //     }
    //   }
    // }
  }

  return (
    <div className="answer">
      <div className="code-ask">
        <input
          type="checkbox"
          id={props.id}
          className="toggle-code-input"
          onChange={toggleAnswerCode}
        />
        <label htmlFor={props.id}>É código?</label>
      </div>

      <div className="correct-answer">
        <label className="toggle" htmlFor={`answer-${props.id}`}>
          <input
            type="checkbox"
            className="toggle__input"
            id={`answer-${props.id}`}
            onChange={toggleDefineAnswer}
          />

          <span className="toggle-track">
            <span className="toggle-indicator">
              <span className="checkMark">
                <svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
                  <path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
                </svg>
              </span>
            </span>
          </span>
          É a resposta correta?
        </label>
      </div>

      <div className={`code-box hide hide code-box-top ${props.id}`} onChange={toggleAnswerCode}>
        <Highlight className={`${props.id}`}>
          {getAnswerProps(props.answer)}
        </Highlight>
        <img
          src="https://cdn-icons-png.flaticon.com/512/892/892692.png"
          className="code-icon rotate"
          onClick={e => toggleShowHideCode(e)}
        />

      </div>

      <textarea
        onChange={e => changeAnswer(props.answer, e.target.value)}
        id={`textarea-${props.id}`}
      />
      <p>Escreva sua resposta</p>
    </div>
  )
}