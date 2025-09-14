import React from "react";
import { connect } from "react-redux";
import { addList } from "../redux/midarea/actions";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { getComponent } from "./getComponents";
import Button from "@mui/material/Button";
import { yellow } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const RunButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(yellow[500] || "#fbc02d"),
  backgroundColor: yellow[500] || "#fbc02d",
  fontSize: "13px",
  "&:hover": {
    backgroundColor: yellow[700] || "#f9a825",
  },
}));

function MidArea({ area_list, add_list, event_values }) {
  const eventFire = (el, etype) => {
    if (el && el.fireEvent) {
      el.fireEvent("on" + etype);
    } else if (el) {
      var evObj = document.createEvent("Events");
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  };

  const handleClick = (arr, id) => {
    if (arr.length === 0) return;
    let i = 0;
    let repeat = 1;

    let str1 = `comp${arr[i]}-${id}-${i}`;

    if (arr[i] === "WAIT") {
      let str2 = `comp${arr[i]}-${id}-${i}`;
      let last_time = new Date().getTime();
      let curr_time = new Date().getTime();
      while ((curr_time - last_time) / 1000 < event_values.wait[str2] - 2) {
        curr_time = new Date().getTime();
      }
    } else if (arr[i] !== "REPEAT") {
      eventFire(document.getElementById(str1), "click");
    } else {
      repeat = event_values.repeat[str1] + 1;
    }
    i++;

    var cnt = setInterval(() => {
      if (i === arr.length) {
        clearInterval(cnt);
      }

      if (arr[i] === "WAIT") {
        let str2 = `comp${arr[i]}-${id}-${i}`;
        let last_time = new Date().getTime();
        let curr_time = new Date().getTime();
        while ((curr_time - last_time) / 1000 < event_values.wait[str2] - 2) {
          curr_time = new Date().getTime();
        }
        i++;
      } else if (arr[i] === "REPEAT") {
        let str2 = `comp${arr[i]}-${id}-${i}`;
        repeat = repeat * (event_values.repeat[str2] + 1);
        i++;
      } else if (arr[i - 1] === "REPEAT" && repeat > 2) {
        let str2 = `comp${arr[i]}-${id}-${i}`;
        eventFire(document.getElementById(str2), "click");
        repeat--;
      } else {
        let str2 = `comp${arr[i]}-${id}-${i}`;
        eventFire(document.getElementById(str2), "click");
        i++;
      }
    }, 2000);
  };

  return (
    <div className="flex-1 h-full overflow-auto p-3">
      <div className="flex justify-between">
        <div className="font-bold mb-5 text-center border border-2 rounded text-white bg-pink-400 p-2 w-auto">
          Mid Area
        </div>

        <div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => add_list()}
            sx={{
              margin: 0,
              bgcolor: "yellow.500",
              "&:hover": { bgcolor: "yellow.700" },
            }}
          >
            Add List
          </Button>
        </div>
      </div>

      <div className="grid grid-flow-col">
        {area_list.midAreaLists.map((l) => {
          return (
            <div className="w-60" key={l.id}>
              <Paper elevation={3} className="p-4">
                <div className="w-52 p-2">
                  <Droppable droppableId={l.id} type="COMPONENTS">
                    {(provided) => (
                      <ul
                        className={`${l.id} w-48 h-full`}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        <div className="text-center mx-auto my-2 mb-4">
                          <RunButton
                            variant="contained"
                            startIcon={<PlayArrowIcon />}
                            onClick={() => handleClick(l.comps, l.id)}
                          >
                            Run
                          </RunButton>
                        </div>

                        {l.comps &&
                          l.comps.map((x, i) => {
                            let str = `${x}`;
                            let component_id = `comp${str}-${l.id}-${i}`;

                            return (
                              <Draggable
                                key={`${str}-${l.id}-${i}`}
                                draggableId={`${str}-${l.id}-${i}`}
                                index={i}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {getComponent(str, component_id)}
                                    {provided.placeholder}
                                  </li>
                                )}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </div>
              </Paper>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    area_list: state.list,
    event_values: state.event,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    add_list: () => dispatch(addList()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MidArea);
