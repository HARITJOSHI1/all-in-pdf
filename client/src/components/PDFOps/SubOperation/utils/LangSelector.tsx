import React, { useContext, useEffect, useRef, useState } from "react";
import { Grid, Stack, Typography, Button, Box } from "@mui/material";
import { DataStore } from "../ContextStore";
import { SubTypes } from "../subTypes/types";
import LANGUAGES from "./Languages";

const generateLangGrid = (
  lang: {
    code: string;
    name: string;
  }[],
  start: number,
  end: number,
  ref: React.RefObject<HTMLDivElement>,
  eleSelected: number,
  labelStyle: Props
) => {
  const { width, borderRadius, itemPadding, itemFontSize, borderType } =
    labelStyle;

  return (
    <Grid container spacing={3} ref={ref}>
      {lang.slice(start).map((l, idx) => {
        if (idx + 1 > end) return null;
        else {
          return (
            <Grid
              key={idx}
              item
              xs={12} // mobile
              sm={4} // potrait
              md={4} // tab landscape
              lg={3} // desktop
              data-id={idx}
            >
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                  p: itemPadding ? itemPadding : "2.5rem 1.2rem", // p -> padding
                  backgroundColor: eleSelected === idx ? "#a6cef5" : "#dae9f7",
                  borderRadius: borderRadius ? borderRadius : "5px",
                  cursor: "pointer",
                  transition: "all .5s",
                  width: width ? width : "100%",
                  border: borderType ? `1.7px ${borderType} #1d77cc` : null,

                  "&:hover": {
                    backgroundColor: "#a6cef5",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#1d77cc",
                    fontSize: itemFontSize ? itemFontSize : "1.2rem",
                    fontWeight: "650",
                  }}
                >
                  {l.name}
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
  selectorWidth?: string;
  heading?: string;
  width?: string;
  itemPadding?: string;
  borderRadius?: string;
  headingSize?: string;
  itemFontSize?: string;
  itemsCount?: number;
  borderType?: "dashed" | "solid";
}

const divider = (itemsCount = 20, total: number) =>
  Math.ceil(total / itemsCount);

export const LangSelector: React.FC<Props> = (props) => {
  const state = useContext(DataStore).find(
    (store) => store.data.type === SubTypes.LANG_SELECT
  )!;

  const [start, setStart] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [selectedLang, setSelectedLang] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);

  const {
    selectorWidth,
    heading,
    width,
    itemPadding,
    borderRadius,
    headingSize,
    itemFontSize,
    itemsCount,
    borderType,
  } = props;

  const totalPages = divider(itemsCount ? itemsCount : 20, LANGUAGES.length);

  useEffect(() => {
    const NodeArr: { child: ChildNode; id: number }[] = [];
    const selectLang = (e: Event) => {
      const id = (e.target as Element)
        .closest(".MuiGrid-item")
        ?.getAttribute("data-id");
      setSelectedLang(+id!);
    };

    Array.from(ref.current?.children!).forEach((node) => {
      NodeArr.push({
        child: node.firstChild!,
        id: Number(node.getAttribute("data-id")),
      });
    });

    NodeArr.forEach(({ child, id }) =>
      child.addEventListener("click", selectLang)
    );

    return () => {
      NodeArr.forEach(({ child, id }) =>
        child.removeEventListener("click", selectLang)
      );
    };
  }, [start]);

  useEffect(() => {
    state.setData({
      type: SubTypes.LANG_SELECT,
      value: LANGUAGES[selectedLang + start]?.name,
    });
  }, [selectedLang]);

  useEffect(() => {
    // window.scrollTo(0, 0);
    setSelectedLang(-1);
  }, [page]);

  return (
    <Stack direction="column" alignItems="center" spacing="2rem">
      <Typography
        variant="h2"
        sx={{ fontSize: headingSize ? headingSize : "2rem" }}
      >
        {heading!}
      </Typography>

      {/* ----------------------------------------------------------------------- */}
      <div style={{ width: selectorWidth ? selectorWidth : "80%" }}>
        {generateLangGrid(
          LANGUAGES,
          start,
          itemsCount ? itemsCount : 20,
          ref,
          selectedLang,
          {
            width,
            borderRadius,
            itemPadding,
            itemFontSize,
            borderType,
          }
        )}
      </div>
      {/* ----------------------------------------------------------------------- */}

      <Stack direction="row" spacing={2}>
        {/* Paginate logic */}
        <Button
          onClick={() => {
            if (page >= totalPages) return;
            setStart(start + (itemsCount ? itemsCount : 20));
            setPage(page + 1);
          }}
          variant="outlined"
          sx={{ p: "1rem 2rem", textDecoration: "none", textTransform: "none" }}
        >{`Page ${page}/${totalPages} >>`}</Button>

        {/* Back Paginate logic */}
        {start > 0 && (
          <Button
            onClick={() => {
              setStart(start - (itemsCount ? itemsCount : 20));
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
