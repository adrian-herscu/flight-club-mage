import React from 'react';
import { useParams } from 'react-router';
import { useQuery } from 'wasp/client/operations';
import { getCoursesForSchool } from 'wasp/client/operations';

const SchoolPage = () => {
  const { schoolId } = useParams();
  const { data: courses, isLoading, error } = useQuery(getCoursesForSchool, { schoolId });

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">School Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Courses</h2>
        {courses.map(course => (
          <div key={course.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">{course.name}</h3>
            <p>Syllabus Version: {course.syllabus.version}</p>
            <p>Finalized: {course.syllabus.isFinalized ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchoolPage;
