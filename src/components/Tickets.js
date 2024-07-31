// src/components/Tickets.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Badge, Accordion } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import classNames from 'classnames';
import { exportToCSV } from '../utils/exportCSV';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './Tickets.css'; // Import your custom CSS for blurring

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [students, setStudents] = useState([]);
  const [newTicket, setNewTicket] = useState({
    studentName: '',
    narrative: '',
    status: 'pending',
    date: new Date().toLocaleDateString(),
    classTitle: '',
    email: '',
    parentEmail: ''
  });
  const [activeIndex, setActiveIndex] = useState(null); // State to track the active ticket index

  useEffect(() => {
    const savedTickets = JSON.parse(localStorage.getItem('tickets')) || [];
    const savedStudents = JSON.parse(localStorage.getItem('students')) || [];
    setTickets(savedTickets);
    setStudents(savedStudents);
  }, []);

  const handleAddTicket = () => {
    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    setNewTicket({
      studentName: '',
      narrative: '',
      status: 'pending',
      date: new Date().toLocaleDateString(),
      classTitle: '',
      email: '',
      parentEmail: ''
    });
  };

  const handleCompleteTicket = (index) => {
    const updatedTickets = tickets.map((ticket, i) =>
      i === index ? { ...ticket, status: 'completed' } : ticket
    );
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
  };

  const handleDeleteTicket = (index) => {
    const updatedTickets = tickets.filter((_, i) => i !== index);
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
  };

  const handleNarrativeChange = (index, value) => {
    const updatedTickets = [...tickets];
    updatedTickets[index].narrative = value;
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
  };

  const handleStudentNameChange = (selected) => {
    if (selected.length > 0) {
      const student = selected[0];
      setNewTicket({
        ...newTicket,
        studentName: student.name,
        classTitle: student.classTitle,
        email: student.email,
        parentEmail: student.parentEmail
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => console.log('Copied to clipboard'),
      (err) => console.error('Could not copy text: ', err)
    );
  };

  const copyTicketToClipboard = (ticket) => {
    const ticketInfo = `Name: ${ticket.studentName}\nEmail: ${ticket.email}\nParent Email: ${ticket.parentEmail}\nClass Title: ${ticket.classTitle}\nDate: ${ticket.date}\nStatus: ${ticket.status}\nNarrative: ${ticket.narrative}`;
    copyToClipboard(ticketInfo);
  };

  const copyCompletedTicketsToClipboard = () => {
    const completedTickets = tickets.filter(ticket => ticket.status === 'completed');
    const tsvData = completedTickets.map(ticket =>
      `${ticket.studentName}\t${ticket.email}\t${ticket.parentEmail}\t${ticket.classTitle}\t${ticket.date}\t${ticket.status}\t${ticket.narrative}`
    ).join('\n');
    copyToClipboard(tsvData);
  };

  const pendingTickets = tickets.filter(ticket => ticket.status === 'pending');
  const completedTickets = tickets.filter(ticket => ticket.status === 'completed');

  return (
    <div>
      <h2>Manage Tickets</h2>
      <div className="mb-3">
        <Typeahead
          id="student-name-typeahead"
          labelKey="name"
          options={students}
          placeholder="Choose a student..."
          onChange={handleStudentNameChange}
          selected={students.filter(student => student.name === newTicket.studentName)}
        />
        <Button variant="primary" onClick={handleAddTicket} className="ml-2">Add Ticket</Button>
        <Button variant="secondary" className="ml-2" onClick={() => exportToCSV(tickets)}>Export to CSV</Button>
      </div>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Student</th>
            <th>Narrative</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingTickets.map((ticket, index) => {
            const originalIndex = tickets.indexOf(ticket);
            return (
              <tr key={index}>
                <td
                  className={classNames({ 'blurred': activeIndex !== originalIndex })}
                  onMouseEnter={() => setActiveIndex(originalIndex)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <Badge variant="secondary">{ticket.studentName}</Badge>
                </td>
                <td
                  className={classNames({ 'blurred': activeIndex !== originalIndex })}
                  onMouseEnter={() => setActiveIndex(originalIndex)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={ticket.narrative}
                    onChange={(e) => handleNarrativeChange(originalIndex, e.target.value)}
                  />
                </td>
                <td>{ticket.status}</td>
                <td>{ticket.date}</td>
                <td>
                  <Button variant="success" onClick={() => handleCompleteTicket(originalIndex)}>Complete</Button>
                  <Button variant="danger" className="ml-2" onClick={() => handleDeleteTicket(originalIndex)}>Delete</Button>
                  <Button variant="info" className="ml-2" onClick={() => copyTicketToClipboard(ticket)}>Copy</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Accordion className="mt-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Completed Tickets</Accordion.Header>
          <Accordion.Body>
            {completedTickets.length === 0 ? (
              <p>No completed tickets</p>
            ) : (
              <>
                <Button variant="info" className="mb-2" onClick={copyCompletedTicketsToClipboard}>Copy All to Clipboard</Button>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Narrative</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedTickets.map((ticket, index) => {
                      const originalIndex = tickets.indexOf(ticket);
                      return (
                        <tr key={index}>
                          <td>
                            <Badge variant="secondary">{ticket.studentName}</Badge>
                          </td>
                          <td>{ticket.narrative}</td>
                          <td>{ticket.status}</td>
                          <td>{ticket.date}</td>
                          <td>
                            <Button variant="danger" className="ml-2" onClick={() => handleDeleteTicket(originalIndex)}>Delete</Button>
                            <Button variant="info" className="ml-2" onClick={() => copyTicketToClipboard(ticket)}>Copy</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Tickets;