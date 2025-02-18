import { Router } from 'express';
import { check } from 'express-validator';
import { getUsers, getUserById, updateUser, deleteUser, assignCourse, viewCourses } from './user.controller.js';
import { existeUsuarioById } from '../helpers/db-validator.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { tieneRole } from '../middlewares/validar-roles.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get('/', getUsers);

router.get(
    '/findUser/:id',
    [
        check('id', 'No es un id váldo.').isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un id váldo.').isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos 
    ],
    updateUser
)

router.delete(
    '/:id',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id', 'No es un id váldo.').isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos 
    ],
    deleteUser
)

router.post(
    '/assignedCourse',
    [
        validarJWT,
        validarCampos,
        tieneRole('TEACHER_ROLE'),
    ],
    assignCourse
)

router.get(
    '/findCourse/:id',
    [
        validarJWT,
        validarCampos,
    ],
    viewCourses
)

export default router;