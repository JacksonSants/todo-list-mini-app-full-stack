import { query } from "express";
import { db } from "../db/server.js";

export const getTasks = (_, res) => {
    const q = "SELECT * FROM tarefa";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        
        // Formatando as datas antes de enviar a resposta
        const tasks = data.map(task => {
            return {
                idtarefa: task.idtarefa,
                titulo: task.titulo,
                descricao: task.descricao,
                status: task.status,
                // Formatando a data para o formato desejado
                dataCriacao: new Date(task.dataCriacao)
            };
        });

        return res.status(200).json(tasks); // Retorna os dados formatados
    });
};

export const postTask = (req, res) => {
    const q = "INSERT INTO tarefa(`titulo`, `descricao`, `status`, `dataCriacao`) VALUES (?, ?, ?, ?)";
    const values = [
        req.body.titulo,
        req.body.descricao,
        req.body.status,
        req.body.dataCriacao
    ];

    db.query(q, values, (err, result) => {
        if (err) return res.status(500).json(err);

        // Retornar a nova tarefa com o id gerado
        const newTask = {
            idtarefa: result.insertId,
            ...req.body
        };
        return res.status(201).json({
            status: "success",
            data: newTask
        });
    });
};

export const updateTask = (req, res) => {
    const checkExistenceQuery = "SELECT * FROM tarefa WHERE idtarefa = ?";
    const updateQuery = "UPDATE tarefa SET `titulo` = ?, `descricao` = ?, `status` = ?, `dataCriacao` = ? WHERE `idtarefa` = ?";
    
    db.query(checkExistenceQuery, [req.params.idTarefa], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ status: "error", message: "Tarefa não encontrada" });

        const values = [
            req.body.titulo,
            req.body.descricao,
            req.body.status,
            req.body.dataCriacao,
            req.params.idTarefa
        ];

        db.query(updateQuery, values, (err) => {
            if (err) return res.status(500).json(err);

            // Retornar a tarefa atualizada
            const updatedTask = {
                idtarefa: req.params.idTarefa,
                ...req.body
            };
            return res.status(200).json({
                status: "success",
                data: updatedTask
            });
        });
    });
};

export const deleteTask = (req, res) => {
    const checkExistenceQuery = "SELECT * FROM tarefa WHERE idtarefa = ?";
    const deleteQuery = "DELETE FROM tarefa WHERE `idtarefa` = ?";
    
    db.query(checkExistenceQuery, [req.params.idTarefa], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ status: "error", message: "Tarefa não encontrada" });

        db.query(deleteQuery, [req.params.idTarefa], (err) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json({
                status: "success",
                message: "Tarefa deletada"
            });
        });
    });
};
