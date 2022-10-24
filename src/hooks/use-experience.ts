//Importa o contexto de autenticação
import { ExperienceContext } from "../contexts/Experience-context";
//Importa a Api de contexto do React
import { useContext } from "react";

//Exporta o a função(useAuth)
export function useExp() {
  //define o valor de value com o contexto
  const value = useContext(ExperienceContext);

  //Retorna value
  return value;
}
