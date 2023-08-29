import axios from "axios";
import { GET_MESSAGES, POST_MESSAGES } from "../Action-types/action-types";

export const getMessages = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get("http://localhost:4000/messages");
      const data = response.data.messages.slice(-50).reverse(); 
      dispatch({ type: GET_MESSAGES, payload: data });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
};

// actions.js


export const postMessage = (message, nickname) => {
  return async function (dispatch) {
    try {
      await axios.post("http://localhost:4000/save", {
        message,
        from: nickname,
      });

      // Después de enviar el mensaje, puedes emitir una acción para actualizar el estado
      dispatch({ type: POST_MESSAGES });
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };
};
