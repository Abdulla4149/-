import React from 'react';

const courses = [
  { id: 1, title: 'Course 1', description: 'Description of Course 1' },
  { id: 2, title: 'Course 2', description: 'Description of Course 2' },
  { id: 3, title: 'Course 3', description: 'Description of Course 3' },
  // Add more courses here
];

const CoursesPage = () => {
  return (
    <div>
      <h1>Courses List</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursesPage;