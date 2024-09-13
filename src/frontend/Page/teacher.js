import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TeacherDashboard = () => {
  const { teacherID } = useParams();
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [attendance, setAttendance] = useState([]);
  
  useEffect(() => {
    // Fetch checklist of students
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`/api/teacher-dashboard/${teacherID}/checklist`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    // Fetch attendance data if needed
    const fetchAttendance = async () => {
      try {
        // Replace with actual API call if needed
        // const response = await axios.get('/api/attendance');
        // setAttendance(response.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchStudents();
    fetchAttendance();
  }, [teacherID]);

  const handleMarkAttendance = async (childID, arrivalTime, departureTime) => {
    try {
      await axios.post('/api/mark-attendance', {
        childID,
        date: new Date().toISOString().split('T')[0], // Current date
        arrivalTime,
        departureTime,
      });
      alert('Attendance marked!');
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      
      {/* Student Checklist */}
      <h2>Student Checklist</h2>
      <ul>
        {students.map((student) => (
          <li key={student.ChildID}>
            <img src={student.Photo} alt={student.childName} style={{ width: '100px', height: '100px' }} />
            <p>{student.childName} - {student.GroupName}</p>
            <button onClick={() => handleMarkAttendance(student.ChildID, '08:00:00', '17:00:00')}>Mark Attendance</button>
          </li>
        ))}
      </ul>
      
      {/* Add more components for logs and other functionalities here */}
    </div>
  );
};

export default TeacherDashboard;
