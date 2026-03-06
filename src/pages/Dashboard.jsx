import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getSchools, getCoursesForSchool, getUserEnrollments } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';

const DashboardPage = () => {
  const { data: schools, isLoading: loadingSchools, error: errorSchools } = useQuery(getSchools);
  const { data: enrollments, isLoading: loadingEnrollments, error: errorEnrollments } = useQuery(getUserEnrollments);

  if (loadingSchools || loadingEnrollments) return 'Loading...';
  if (errorSchools) return 'Error loading schools: ' + errorSchools;
  if (errorEnrollments) return 'Error loading enrollments: ' + errorEnrollments;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Schools</h2>
        {schools.map(school => (
          <div key={school.id} className="bg-gray-100 p-4 mb-2 rounded-lg">
            <h3 className="text-lg font-medium">{school.name}</h3>
            <CourseList schoolId={school.id} />
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Enrollments</h2>
        {enrollments.map(enrollment => (
          <div key={enrollment.id} className="bg-gray-100 p-4 mb-2 rounded-lg">
            <p className="text-lg">Course: {enrollment.course.name}</p>
            <p>School: {enrollment.course.school.name}</p>
            <p>Progress: {enrollment.progress}</p>
            <Link to={`/course/${enrollment.course.id}`} className="text-blue-500 hover:underline">View Course</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const CourseList = ({ schoolId }) => {
  const { data: courses, isLoading, error } = useQuery(getCoursesForSchool, { variables: { schoolId } });

  if (isLoading) return 'Loading courses...';
  if (error) return 'Error loading courses: ' + error;

  return (
    <div className="ml-4">
      {courses.map(course => (
        <div key={course.id} className="p-2">
          <p className="text-md">Course: {course.name}</p>
          <p>Syllabus Version: {course.syllabus.version}</p>
          <Link to={`/course/${course.id}`} className="text-blue-500 hover:underline">View Course</Link>
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;
