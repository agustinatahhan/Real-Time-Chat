import Message from "../models/message.js";

const controller = {
  save: (req, res) => {
    const params = req.body;
    const message = new Message();
    message.message = params.message;
    message.from = params.from;

    message
      .save()
      .then((messageStored) => {
        return res.status(200).send({
          status: "Success",
          messageStored,
        });
      })
      .catch((error) => {
        return res.status(400).send({
          status: "Error",
          message: "No se ha podido guardar el mensaje",
        });
      });
  },

  getMessage: (req, res) => {
    Message.find({})
      .sort({ createdAt: 1 })
      .limit(50)
      .then((messages) => {
        if (messages.length === 0) {
          return res.status(404).send({
            status: "Error",
            message: "No hay mensajes que mostrar",
          });
        }

        return res.status(200).send({
          status: "Success",
          messages: messages.reverse(),
        });
      })
      .catch((error) => {
        return res.status(500).send({
          status: "Error",
          message: "Error al extraer los datos",
        });
      });
  },

  deleteAllMessages: (req, res) => {
    Message.deleteMany({})
      .then(() => {
        return res.status(200).send({
          status: "Success",
          message: "Todos los mensajes han sido eliminados",
        });
      })
      .catch((error) => {
        return res.status(500).send({
          status: "Error",
          message: "Error al eliminar los mensajes",
        });
      });
  },
};

export default controller;
