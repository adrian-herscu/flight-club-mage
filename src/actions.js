import { HttpError } from 'wasp/server'

export const registerSchool = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  if (context.user.role !== 'schoolOwner' && context.user.role !== 'superAdmin') { throw new HttpError(403, 'User does not have the necessary role to register a school.') }

  const newSchool = await context.entities.School.create({
    data: {
      name: args.name
    }
  });

  await context.entities.ManagedSchool.create({
    data: {
      userId: context.user.id,
      schoolId: newSchool.id
    }
  });

  return newSchool;
}

export const enrollInCourse = async ({ courseId }, context) => {
  if (!context.user) { throw new HttpError(401) }
  
  // Check if the user is a student
  if (context.user.role !== 'student') { throw new HttpError(403, 'Only students can enroll in courses.') }
  
  // Create a new enrollment
  const enrollment = await context.entities.Enrollment.create({
    data: {
      userId: context.user.id,
      courseId: courseId,
      progress: 'Not started'
    }
  });
  
  return enrollment;
}

export const finalizeSyllabus = async ({ syllabusId }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const syllabus = await context.entities.Syllabus.findUnique({
    where: { id: syllabusId }
  });
  if (!syllabus) { throw new HttpError(404, 'Syllabus not found') };

  const course = await context.entities.Course.findFirst({
    where: { syllabusId: syllabus.id }
  });
  if (!course) { throw new HttpError(404, 'Course not found for this syllabus') };

  const managedSchool = await context.entities.ManagedSchool.findFirst({
    where: { schoolId: course.schoolId, userId: context.user.id }
  });
  if (!managedSchool) { throw new HttpError(403, 'User is not a manager of the school offering this course') };

  const updatedSyllabus = await context.entities.Syllabus.update({
    where: { id: syllabusId },
    data: { isFinalized: true }
  });

  return updatedSyllabus;
}
