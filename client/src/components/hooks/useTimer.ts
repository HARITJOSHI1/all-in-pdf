import { useContext, useEffect } from "react";
import { Context} from "../Layout";

export const useTimer = (type: string) => {
  const {setErr, errors } = useContext(Context)[2];

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (errors?.length) {
      id = setTimeout(() => {
        setErr(errors?.filter((e) => e.type !== type));
      }, 3000);
    }

    return () => {
      clearTimeout(id);
    };
  }, [errors?.length]);
}