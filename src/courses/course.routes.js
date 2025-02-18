import { Router } from 'express';
import { createCourse, getCourses } from './courses.controller.js';
import { validarCampos }from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/validar-roles.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        validarCampos,
        tieneRole('TEACHER_ROLE'),
    ],
    createCourse
)

router.get(
    '/',
    [
        validarJWT,
        validarCampos,
        tieneRole('TEACHER_ROLE')
    ],
    getCourses
)

export default router;
