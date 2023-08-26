import Message from "../models/message.js";

const controller = {
    save: (req, res) => {
        const params = req.body;
        const message = new Message();
        message.message = params.message;
        message.from = params.from;
    
        message.save()
            .then(messageStored => {
                return res.status(200).send({
                    status: "Success",
                    messageStored
                });
            })
            .catch(error => {
                return res.status(400).send({
                    status: "Error",
                    message: "No se ha podido guardar el mensaje"
                });
            });
    },
    
    // save: (req, res) => {
    //     const params = req.body;
    //     const message = new Message();
    //     message.message = params.message;
    //     message.from = params.from;

    //     message.save()
    //         .then(messageStored => {
    //             return res.status(200).send({
    //                 status: "Success",
    //                 messageStored
    //             });
    //         })
    //         .catch(error => {
    //             return res.status(400).send({
    //                 status: "Error",
    //                 message: "No se ha podido guardar el mensaje"
    //             });
    //         });
    // },

    // getMessage: (req, res) => {
    //     Message.find({})
    //         .sort("-_id")
    //         .then(messages => {
    //             if (messages.length === 0) {
    //                 return res.status(404).send({
    //                     status: "Error",
    //                     message: "No hay mensajes que mostrar"
    //                 });
    //             }

    //             return res.status(200).send({
    //                 status: "Success",
    //                 messages
    //             });
    //         })
    //         .catch(error => {
    //             return res.status(500).send({
    //                 status: "Error",
    //                 message: "Error al extraer los datos"
    //             });
    //         });
    // },
    getMessage: (req, res) => {
        Message.find({})
            .sort({ _id: -1 })
            .limit(50)
            .then(messages => {
                if (messages.length === 0) {
                    return res.status(404).send({
                        status: "Error",
                        message: "No hay mensajes que mostrar"
                    });
                }
    
                return res.status(200).send({
                    status: "Success",
                    messages: messages.reverse() // Revertir el orden para que los más antiguos estén al principio
                });
            })
            .catch(error => {
                return res.status(500).send({
                    status: "Error",
                    message: "Error al extraer los datos"
                });
            });
    },
    

};

export default controller;