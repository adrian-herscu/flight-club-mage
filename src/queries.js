import { HttpError } from 'wasp/server'

export const getSchools = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  return context.entities.School.findMany();
}

export const getCoursesForSchool = async ({ schoolId }, context) => {
  if (!context.user) { throw new HttpError(401) };

  return context.entities.Course.findMany({
    where: {
      schoolId: schoolId
    },
    include: {
      syllabus: true
    }
  });
}

export const getUserEnrollments = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  return context.entities.Enrollment.findMany({
    where: { userId: context.user.id },
    include: {
      course: {
        select: {
          name: true,
          school: {
            select: { name: true }
          }
        }
      }
    }
  });
}
