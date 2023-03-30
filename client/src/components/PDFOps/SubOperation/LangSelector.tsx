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
  "Bihari languages",
  "Bislama",
  "Bosnian",
  "Breton",
  "Bulgarian",
  "Burmese",
  "Catalan, Valencian",
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
  "Greek (Modern)",
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
  "Interlingua (International Auxiliary Language Association)",
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
  "Sinhala, Sinhalese",
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
  "Uighur, Uyghur",
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
  eleSelected: number
) => {
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
                  p: "2.5rem", // p -> padding
                  backgroundColor: eleSelected === idx ? "#a6cef5" : "#dae9f7",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "all .5s",

                  "&:hover": {
                    backgroundColor: "#a6cef5",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#1d77cc",
                    fontSize: "1.2rem",
                    fontWeight: "700",
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
    <Box width= {props.width}>
      <Typography variant="h2" sx={{ fontSize: "2rem" }}>
        Select the language of your pdf file
      </Typography>

      {/* ----------------------------------------------------------------------- */}
      <div style={{ width: "80%" }}>
        {generateLangGrid(LANGUAGES, start, 21, ref, selectedLang)}
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
    </Box>
  );
};
