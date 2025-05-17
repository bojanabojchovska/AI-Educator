import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { logout, getCourses, createCourse, updateCourse, deleteCourse, importCourses } from '../../services/api.js';

const Admin = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ title: '', description: '' });
  const [editSubject, setEditSubject] = useState({ title: '', description: '' });
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses();
        setSubjects(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('⚠️ Failed to load subjects.');
      }
    };
    fetchCourses();
  }, []);

  const handleAddSubject = async () => {
    if (newSubject.title && newSubject.description) {
      try {
        const createdCourse = await createCourse({ ...newSubject });
        setSubjects((prevSubjects) => [...prevSubjects, createdCourse]);
        setNewSubject({ title: '', description: '' });
        toast.success('✅ Subject added successfully!');
      } catch (error) {
        console.error('Error creating course:', error);
        toast.error('⚠️ Failed to add subject.');
      }
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await deleteCourse(id);
      setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject.id !== id));
      toast.error('🗑️ Subject deleted.');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('⚠️ Failed to delete subject.');
    }
  };

  const handleEditSubject = (subject) => {
    setEditSubject({ title: subject.title, description: subject.description });
    setEditing(subject.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEdit = async () => {
    if (!editSubject.title || !editSubject.description) {
      toast.warning('⚠️ Please fill in all fields');
      return;
    }

    try {
      const updated = await updateCourse(editing, { ...editSubject });
      setSubjects((prevSubjects) =>
          prevSubjects.map((subject) =>
              subject.id === editing ? updated : subject
          )
      );
      setEditSubject({ title: '', description: '' });
      setEditing(null);
      toast.success('✏️ Changes saved.');
    } catch (error) {
      console.error('Error saving edit:', error);
      toast.error('⚠️ Failed to save changes.');
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.warning('⚠️ Please upload a valid CSV or Excel file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Add a loading toast
      const loadingToast = toast.loading('Importing courses...');

      await importCourses(formData);

      // Update success toast and refresh courses
      toast.dismiss(loadingToast);
      toast.success('✅ Courses imported successfully!');
      setFile(null);

      // Refresh the courses list
      const coursesData = await getCourses();
      setSubjects(coursesData);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`⚠️ Import failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('⚠️ Logout failed');
    }
  };

  return (
      <div className="admin-container">
        <ToastContainer position="top-center" />
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="upload-section">
          <label>Import PDF with subjects:</label>
          <input
              type="file"
              accept=".csv, .xls, .xlsx"
              onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleImport}>Import Courses</button>
        </div>

        <div className="subject-form">
          <label>{editing ? 'Edit Subject' : 'Add Subject'}</label>
          {editing && (
              <p style={{color: 'green', fontWeight: 'bold'}}>✏️ Currently editing...</p>
          )}
          <div className="input-group">
            <label>Title</label>
            <input
                type="text"
                placeholder="Enter subject title"
                value={editing ? editSubject.title : newSubject.title}
                onChange={(e) =>
                    editing
                        ? setEditSubject({...editSubject, title: e.target.value})
                        : setNewSubject({...newSubject, title: e.target.value})
                }
            />
          </div>
          <div className="input-group">
            <label>Description</label>
            <input
                type="text"
                placeholder="Enter subject description"
                value={editing ? editSubject.description : newSubject.description}
                onChange={(e) =>
                    editing
                        ? setEditSubject({...editSubject, description: e.target.value})
                        : setNewSubject({...newSubject, description: e.target.value})
                }
            />
          </div>
          <button onClick={(e) => {
            e.preventDefault();
            editing ? handleSaveEdit() : handleAddSubject();
          }}>
            {editing ? <FaEdit/> : <FaPlus/>}
            <span style={{marginLeft: '8px'}}>
        {editing ? 'Save Changes' : 'Add Subject'}
    </span>
          </button>
        </div>

        <h2>Subjects List</h2>
        <table>
          <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {subjects.length === 0 ? (
              <tr>
                <td colSpan="3">No subjects yet.</td>
              </tr>
          ) : (
              subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.title}</td>
                    <td>{subject.description}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEditSubject(subject)} title="Edit">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteSubject(subject.id)} title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))
          )}
          </tbody>
        </table>
      </div>
  );
};

export default Admin;