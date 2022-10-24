import { convertMilisecondsToTime } from "./convertMilisecondsToTime";

export function getTimeOfGame(questions: any) {
  //somar tempo dentro das questões
  let time = 0;
  questions.forEach((question: any) => {
    time += question.time;
  });

  console.log();
  return convertMilisecondsToTime(time);
}
