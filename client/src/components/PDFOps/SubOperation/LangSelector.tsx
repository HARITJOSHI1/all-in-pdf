import React, { useContext, useEffect, useRef, useState } from "react";
import { Grid, Stack, Typography, Button, Box } from "@mui/material";
import { DataStore } from "./ContextStore";
import { SubTypes } from "./subTypes/types";

const LANGUAGES = [
  "Abkhazian",
  "Afar",
  "Afrikaans",
  "Akan",
  "Albanian",
  "Amharic",
  "Arabic",
  "Aragonese",
  "Armenian",
  "Assamese",
  "Avaric",
  "Avestan",
  "Aymara",
  "Azerbaijani",
  "Bambara",
  "Bashkir",
  "Basque",
  "Belarusian",
  "Bengali",
  "Bihari",
  "Bislama",
  "Bosnian",
  "Breton",
  "Bulgarian",
  "Burmese",
  "Catalan",
  "Central Khmer",
  "Chamorro",
  "Chechen",
  "Chichewa",
  "Chinese",
  "Church Slavonic",
  "Chuvash",
  "Cornish",
  "Corsican",
  "Cree",
  "Croatian",
  "Czech",
  "Danish",
  "Divehi",
  "Dutch",
  "Dzongkha",
  "English",
  "Esperanto",
  "Estonian",
  "Ewe",
  "Faroese",
  "Fijian",
  "Finnish",
  "French",
  "Fulah",
  "Gaelic",
  "Galician",
  "Ganda",
  "Georgian",
  "German",
  "Gikuyu",
  "Greek",
  "Greenlandic",
  "Guarani",
  "Gujarati",
  "Haitian",
  "Hausa",
  "Hebrew",
  "Herero",
  "Hindi",
  "Hiri Motu",
  "Hungarian",
  "Icelandic",
  "Ido",
  "Igbo",
  "Indonesian",
  "Interlingua",
  "Interlingue",
  "Inuktitut",
  "Inupiaq",
  "Irish",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kanuri",
  "Kashmiri",
  "Kazakh",
  "Kinyarwanda",
  "Komi",
  "Kongo",
  "Korean",
  "Kwanyama",
  "Kurdish",
  "Kyrgyz",
  "Lao",
  "Latin",
  "Latvian",
  "Letzeburgesch",
  "Limburgish",
  "Lingala",
  "Lithuanian",
  "Luba-Katanga",
  "Macedonian",
  "Malagasy",
  "Malay",
  "Malayalam",
  "Maltese",
  "Manx",
  "Maori",
  "Marathi",
  "Marshallese",
  "Romanian",
  "Mongolian",
  "Nauru",
  "Navajo",
  "Northern Ndebele",
  "Ndonga",
  "Nepali",
  "Northern Sami",
  "Norwegian",
  "Norwegian Bokmål",
  "Norwegian Nynorsk",
  "Nuosu, Sichuan Yi",
  "Occitan",
  "Ojibwa",
  "Oriya",
  "Oromo",
  "Ossetian",
  "Pali",
  "Punjabi",
  "Pashto",
  "Persian",
  "Polish",
  "Portuguese",
  "Quechua",
  "Romansh",
  "Rundi",
  "Russian",
  "Samoan",
  "Sango",
  "Sanskrit",
  "Sardinian",
  "Serbian",
  "Shona",
  "Sindhi",
  "Sinhalese",
  "Slovak",
  "Slovenian",
  "Somali",
  "Sotho, Southern",
  "South Ndebele",
  "Spanish",
  "Sundanese",
  "Swahili",
  "Swati",
  "Swedish",
  "Tagalog",
  "Tahitian",
  "Tajik",
  "Tamil",
  "Tatar",
  "Telugu",
  "Thai",
  "Tibetan",
  "Tigrinya",
  "Tonga",
  "Tsonga",
  "Tswana",
  "Turkish",
  "Turkmen",
  "Twi",
  "Uighur",
  "Ukrainian",
  "Urdu",
  "Uzbek",
  "Venda",
  "Vietnamese",
  "Volap_k",
  "Walloon",
  "Welsh",
  "Western Frisian",
  "Wolof",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zhuang",
  "Zulu",
];

const generateLangGrid = (
  lang: string[],
  start: number,
  end: number,
  ref: React.RefObject<HTMLDivElement>,
  eleSelected: number,
  labelStyle: Props
) => {

  const { width, borderRadius, itemPadding } = labelStyle;
  return (
    <Grid container spacing={3} ref={ref}>
      {lang.slice(start).map((l, idx) => {
        if (idx >= end - 1) return null;
        else {
          return (
            <Grid
              key={idx}
              item
              xs={12} // mobile
              sm={4} // potrait
              md={4} // tab landscape
              lg={3} // desktop
              data-id={start + idx}
            >
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                  p: itemPadding? itemPadding : "1.1rem", // p -> padding
                  backgroundColor: eleSelected === idx ? "#a6cef5" : "#dae9f7",
                  borderRadius: borderRadius ? borderRadius : "12px",
                  cursor: "pointer",
                  transition: "all .5s",
                  width: width? width : "100%",

                  "&:hover": {
                    backgroundColor: "#a6cef5",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#1d77cc",
                    fontSize: "1rem",
                    fontWeight: "650",
                  }}
                >
                  {l}
                </Typography>
              </Stack>
            </Grid>
          );
        }
      })}
    </Grid>
  );
};

interface Props {
  containerWidth?: string;
  width?: string;
  itemPadding?: string;
  borderRadius?: string;
  fontSize?: string;
  rows?: number;
  cols?: number;
}


const divider = (rows: number, cols: number, total = 184) => {
  // return {totalPages, incrementer};
};

export const LangSelector: React.FC<Props> = (props) => {
  const state = useContext(DataStore).find(
    (store) => store.data.type === SubTypes.LANG_SELECT
  )!;

  const [start, setStart] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [selectedLang, setSelectedLang] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);

  const { containerWidth, width, itemPadding, borderRadius, fontSize, rows, cols } = props;

  useEffect(() => {
    Array.from(ref.current?.children!).forEach((node, idx) =>
      node.firstChild?.addEventListener("click", () => {
        setSelectedLang(Number(node.getAttribute("data-id")));
      })
    );
  }, []);

  useEffect(() => {
    state.setData({
      type: SubTypes.LANG_SELECT,
      value: LANGUAGES[selectedLang],
    });
  }, [selectedLang]);

  useEffect(() => {
    // window.scrollTo(0, 0);
    setSelectedLang(-1);
  }, [page]);

  return (
    <Stack direction="column" alignItems="center" spacing= "2rem">
      <Typography variant="h2" sx={{ fontSize: fontSize ? fontSize : "2rem" }}>
        Select the language of your pdf file
      </Typography>

      {/* ----------------------------------------------------------------------- */}
      <div style={{ width: containerWidth ? containerWidth : "80%" }}>
        {generateLangGrid(LANGUAGES, start, 41, ref, selectedLang, { width, borderRadius, itemPadding })}
      </div>
      {/* ----------------------------------------------------------------------- */}

      <Stack direction="row" spacing={2}>
        {/* Paginate logic */}
        <Button
          onClick={() => {
            if (page >= 10) return;
            setStart(start + 20);
            setPage(page + 1);
          }}
          variant="outlined"
          sx={{ p: "1rem 2rem", textDecoration: "none", textTransform: "none" }}
        >{`Page ${page}/10 >>`}</Button>

        {/* Back Paginate logic */}
        {start > 0 && (
          <Button
            onClick={() => {
              setStart(start - 20);
              setPage(page - 1);
            }}
            variant="outlined"
            sx={{
              p: "1rem 2rem",
              textDecoration: "none",
              textTransform: "none",
            }}
          >
            Back
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
