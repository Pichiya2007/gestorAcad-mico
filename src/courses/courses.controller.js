import User from '../users/user.model.js';
import Course from '../courses/courses.model.js'

export const createCourse = async (req, res) => {
    try {
        
        const { name, description } = req.body;

        const course = new Course({
            name,
            description
        });

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Curso creado exitosamente',
            course
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el curso',
            error: error.message
        })
    }
}

export const getCourses = async (req, res) => {
    
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {

        const courses = await Course.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        if (!courses.length) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron cursos'
            })
        }

        const total = await Course.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            courses
        })
        
    } catch (error) {
        res.status(500).json({
            succcess: false,
            message: 'Error al mostrar los cursos',
            error: error.message
        })
    }
}