import {
    SET_ACTIVE_CHARACTER,
    ADD_CHARACTER,
    SET_ANGLE,
  } from "./actionTypes";
  
  const initialState = {
    characters: [{ id: "sprite0", angle: 0 }],
    active: "sprite0",
  };
  
  export const characterReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_ACTIVE_CHARACTER:
        return {
          ...state,
          active: action.id,
        };
  
      case ADD_CHARACTER: {
        const newCharacter = {
          id: `sprite${state.characters.length}`,
          angle: 0,
        };
        return {
          ...state,
          characters: [...state.characters, newCharacter],
        };
      }
  
      case SET_ANGLE: {
        const updatedCharacters = state.characters.map((character) =>
          character.id === state.active
            ? { ...character, angle: action.angle }
            : character
        );
        return {
          ...state,
          characters: updatedCharacters,
        };
      }
  
      default:
        return state;
    }
  };
  