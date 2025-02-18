import { response, request } from 'express';
import { hash } from 'argon2';
import User from './user.model.js'
import Course from '../courses/courses.model.js';

export const getUsers = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const getUserById = async (req, res) => {
    try {

        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario not found'
            })
        }

        res.status(200).json({
            success: true,
            user
        })        

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener Usuario'
        })
    }
}

export const updateUser = async (req, res = response) => {
    try {
        
        const { id } = req.params
        const { _id, password, email, ...data } = req.body

        if (password) {
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario actualizado',
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el usuario.',
            error
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });
        const autheticatedUser = req.user;

        res.status(200).json({
            success: true,
            msg: 'Usuario desactivado',
            user,
            autheticatedUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar usuario',
            error
        })
    }
}

export const assignCourse = async (req, res) => {
    try {
        
        const { studentId, courseId } = req.body;
        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                msg: 'Estudiante no encontrado'
            })
        }

        if (!Array.isArray(student.courses)) {
            student.courses = [];
        }

        const coursesmax = 3;
        const totalCourses = student.courses.length + courseId.length;

        if (totalCourses > coursesmax) {
            return res.status(400).json({
                success: false,
                msg: `Máximo de cursos alcanzados: ${coursesmax}`
            })
        }

        const newCourseIds = courseId.filter(id => !student.courses.includes(id));

        if (newCourseIds.length === 0) {
            return res.status(400).json({
                success: false,
                msg: 'Estudiante con cursos seleccionados'
            })
        }

        for (const id of newCourseIds) {
            const course = await Course.findById(id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Curso No Encontrado"
                });
            }

            if (!student.courses.includes(id)) {
                student.courses.push(id);
            }
        }

        await student.save();

        res.status(200).json({
            success: true,
            msg: 'Cursos asignados correctamente',
            student,
            courseId
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al asignar cursos',
            error: error.message
        })
    }
}

export const viewCourses = async (req, res) => {
    try {

        const userId = req.params.id;
        const user = await User.findById(userId).populate('courses');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            })
        }

        res.status(200).json({
            success: true,
            cursos: user.courses
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al mostrar los cursos asignados',
            error
        });
    }
}