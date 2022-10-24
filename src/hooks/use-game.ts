//Importa o contexto de autenticação
import { GameContext } from "../contexts/Game-context";

//Importa a Api de contexto do React
import { useContext } from "react";

//Exporta o a função(useAuth)
export function useGame() {
  //define o valor de value com o contexto
  const value = useContext(GameContext);

  //Retorna value
  return value;
}
