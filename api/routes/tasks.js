import express from "express";
import { getTasks, postTask, updateTask, deleteTask } from '../controller/task.js';

const router = express.Router();

// GET: Listar todas as tarefas
router.get('/', getTasks);

// POST: Criar uma nova tarefa
router.post('/', postTask);

// PUT: Atualizar uma tarefa existente por ID
router.put('/:idTarefa', updateTask);

// DELETE: Excluir uma tarefa por ID
router.delete('/:idTarefa', deleteTask);

export default router;