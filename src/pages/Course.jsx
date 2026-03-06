import React from 'react';
import { useParams } from 'react-router';
import { useQuery, useAction, getCoursesForSchool, enrollInCourse } from 'wasp/client/operations';

const CoursePage = () => {
  const { courseId } = useParams();
  const { data: courseDetails, isLoading, error } = useQuery(getCoursesForSchool, { schoolId: parseInt(courseId) });
  const enrollInCourseFn = useAction(enrollInCourse);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  const handleEnrollment = () => {
    enrollInCourseFn({ courseId: parseInt(courseId) });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{courseDetails.name}</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Syllabus</h2>
        <p>{courseDetails.syllabus.content}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Enrolled Students</h2>
        <ul>
          {courseDetails.students.map(student => (
            <li key={student.id} className="py-2">{student.user.username}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleEnrollment}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Enroll in Course
      </button>
    </div>
  );
};

export default CoursePage;
