import { useState, useEffect } from 'react';
import { useExp } from '../../hooks/use-experience';

import './style.scss';

export default function Expbar() {
  const { level, currentExperience, experienceToNextLevel } = useExp();
  const [exp, setExp] = useState(0);
  const [totalExp, setTotalExp] = useState(0);

  useEffect(() => {
    setTotalExp(experienceToNextLevel)
    setExp(currentExperience)

    //porcentagem de experiencia
    const porcentagem = (exp * 100) / totalExp;
    document.body.style.setProperty('--porcentagem', `${porcentagem}%`)
    document.body.style.setProperty('--number', `${porcentagem}`)

  }, [currentExperience, level])

  useEffect(() => {
    //porcentagem de experiencia
    const porcentagem = (exp * 100) / totalExp;
    document.body.style.setProperty('--porcentagem', `${porcentagem}%`)
    document.body.style.setProperty('--number', `${porcentagem}`)

  }, [exp])

  return (
    <div className="exp-content">
      <div className="level">
        <span className="level-name">Nível</span>
        <span className="level-number">{level}</span>
      </div>

      <div className="exp">
        <span>{exp}</span>
        <div className="exp-bar"></div>
        <span>{totalExp}</span>
      </div>
    </div>
  )
}