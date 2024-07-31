// src/components/Students.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [tsvData, setTsvData] = useState('');

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students')) || [];
    setStudents(savedStudents);
  }, []);

  const handleAddStudents = () => {
    const newStudents = tsvData.split('\n').map(line => {
      const [name, email, parentEmail, classTitle] = line.split('\t');
      return { name, email, parentEmail, classTitle };
    });
    const updatedStudents = [...students, ...newStudents];
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const handleDeleteStudent = (index) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updatedStudents = students.filter((_, i) => i !== index);
      setStudents(updatedStudents);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
    }
  };

  return (
    <div>
      <h2>Manage Students</h2>
      <Form>
        <Form.Group controlId="formTsvData">
          <Form.Label>Paste TSV Data</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={tsvData}
            onChange={(e) => setTsvData(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddStudents}>
          Add Students
        </Button>
      </Form>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Parent Email</th>
            <th>Class Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.parentEmail}</td>
              <td>{student.classTitle}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteStudent(index)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Students;