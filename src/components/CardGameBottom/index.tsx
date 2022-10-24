import { BsFillStarFill } from "react-icons/bs";
import './style.scss';

interface CardGameProps {
  title: string;
  userTop: string
  userTopImage: string
  tags: string[];
  image: string;
}

export default function CardGameBottom(props: CardGameProps) {
  return (
    <div className="game-bottom">
      <img src={props.image} alt="game1" />

      <div className="bottom-game">
        <img src={props.userTopImage} alt="" />
        <div className="game-info">
          <h3>{props.userTop} <BsFillStarFill style={{ color: 'yellow' }} /> </h3>
          <p>{props.title}</p>
          <div className="tags">
            {props.tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}