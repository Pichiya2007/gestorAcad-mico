import { Router } from 'express';
import { createCourse, getCourses, updateCourse, deleteCourse } from './courses.controller.js';
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

router.put(
    '/:id',
    [
        validarJWT,
        validarCampos,
        tieneRole('TEACHER_ROLE')
    ],
    updateCourse
)

router.delete(
    '/:id',
    [
        validarJWT,
        validarCampos,
        tieneRole('TEACHER_ROLE')
    ],
    deleteCourse
)

export default router;
