import { BsFillPlayFill, BsHourglassTop, BsPlusCircleFill, BsTags } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ConvertNumberToMinutes } from "../../utils/ConvertNumberToMinutes";
import './style.scss';

interface CardGameProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  played: boolean;
  time: string;
  exp: number;
  id: string;
}

export default function CardGameTop(props: CardGameProps) {
  return (
    <div className="card-game">
      <img src={props.image} alt="" />

      <div className="game-info">
        <span className="game-name">{props.title}</span>
        <span className="game-description">{props.description}</span>
        <div className="tags">
          {props.tags?.map(tag => (
            <div className="game-category" key={tag}>{tag}</div>
          ))}
        </div>

        <div className="game-info-footer">
          <div className="game-time"> <BsHourglassTop /> {props.time} minutos</div>
          <div className="game-exp"> <BsPlusCircleFill /> {props.exp} exp</div>

          <div className="game-buttons">
            <Link to={`/game/param?id=${props.id}`}>
              <button className="game-button"><BsFillPlayFill /></button>
            </Link>
            <button className="game-button"><FaUserPlus /></button>
          </div>
        </div>
      </div>
    </div>
  )
}