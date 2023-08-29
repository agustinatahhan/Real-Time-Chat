// reducer.js

import { GET_MESSAGES, POST_MESSAGES } from "../Action-types/action-types";

let initialState = {
  messages: [],
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_MESSAGES:
      return {
        ...state,
        messages: payload,
      };

    case POST_MESSAGES:
      return {
        ...state,
        // Aquí puedes realizar alguna actualización del estado después de enviar un mensaje
      };

    default:
      return state;
  }
};

export default reducer;
