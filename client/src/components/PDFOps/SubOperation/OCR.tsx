import React, {useContext} from "react";
import { LangSelector } from "./utils/LangSelector";
import { Stack } from "@mui/material";
import { DataStore, LangStateData, SubOpState } from "./ContextStore";
import * as Types from "./subTypes/types";
import * as H from "history";
import { TaskButton } from "./utils/Button";

interface Props {
  history: H.History;
  allFiles: (File | null)[];
}

export default function OCR({ history, allFiles }: Props) {
  const state = useContext(DataStore).find(
    (store) => store.data.type === Types.SubTypes.LANG_SELECT
  )!;
  
  const processTheData = (langData: LangStateData) => {
    history.push({
      pathname: `/operation/ocr-pdf`,
      state: {
        allFiles,
        dataFrmRoute: JSON.stringify(langData),
        forwarded: true,
      },
    });
  };
  
  return (
    <Stack direction="column" alignItems="center" spacing={3}>
      <LangSelector heading="Select the language of your pdf file" />
      <TaskButton<typeof processTheData>
        task={processTheData.bind(null, state.data)}
        width="20%"
        text="Next"
      />
    </Stack>
  );
}

