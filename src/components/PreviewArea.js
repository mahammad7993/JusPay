import React, { useState } from "react";
import CatSprite from "./CatSprite";
import { connect } from "react-redux";
import { addCharacter, setActive } from "../redux/character/actions";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function PreviewArea({ character, add_character, set_active }) {
  const [active, setActive] = useState(character.active);

  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  let elmnt = null;

  function dragMouseDown(e, id) {
    elmnt = document.getElementById(id);
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    if (elmnt) {
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  const handleChange = (e) => {
    setActive(e.target.value);
    set_active(e.target.value);
  };

  return (
    <div className="w-full flex-none h-full overflow-y-auto p-3" id="preview_area">
      <div className="flex justify-between mb-10">
        <div className="font-bold mb-5 text-center border border-2 rounded text-white bg-pink-400 p-2 w-auto">
          Preview Area
        </div>

        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel shrink id="active-character-label">
            Active
          </InputLabel>
          <Select
            labelId="active-character-label"
            id="active-character-select"
            value={active}
            onChange={handleChange}
            displayEmpty
            sx={{ mt: 1 }}
          >
            {character.characters.map((x, i) => {
              const first = x.id.charAt(0).toUpperCase();
              const name = first + x.id.substr(1);
              return (
                <MenuItem key={i} value={x.id}>
                  {name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddCircleIcon />}
          onClick={add_character}
        >
          Create
        </Button>
      </div>

      <div className="flex justify-around h-full relative">
        {character.characters.map((x, i) => (
          <div
            id={`${x.id}-${i}`}
            key={i}
            className="absolute"
            onMouseDown={(e) => dragMouseDown(e, `${x.id}-${i}`)}
          >
            <div id={`${x.id}-div`} className="character">
              <div
                className="hidden border-2 p-2 ml-3 mb-2 w-auto whitespace-nowrap"
                id={x.id + "-message-box"}
              ></div>
              <div
                className="hidden rounded-full border-2 w-4 left-1/2 h-4 ml-3 mb-2 whitespace-nowrap"
                id={x.id + "-message-box1"}
              ></div>
              <CatSprite charac_id={x.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  character: state.character,
});

const mapDispatchToProps = (dispatch) => ({
  add_character: () => dispatch(addCharacter()),
  set_active: (ch_id) => dispatch(setActive(ch_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewArea);
