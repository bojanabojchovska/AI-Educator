import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FaEdit, FaPlus, FaHome, FaFileUpload, FaTrash } from 'react-icons/fa';
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

  // Helper to reload subjects from backend
  const reloadSubjects = async () => {
    try {
      const coursesData = await getCourses();
      setSubjects(coursesData);
    } catch (error) {
      toast.error('⚠️ Failed to load subjects.');
    }
  };

  useEffect(() => {
    reloadSubjects();
  }, []);

  const handleAddSubject = async () => {
    if (newSubject.title && newSubject.description) {
      try {
        await createCourse({ ...newSubject });
        setNewSubject({ title: '', description: '' });
        toast.success('✅ Subject added successfully!');
        await reloadSubjects();
      } catch (error) {
        toast.error('⚠️ Failed to add subject.');
      }
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await deleteCourse(id);
      toast.error('🗑️ Subject deleted.');
      await reloadSubjects();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        '';
      if (
        msg.toLowerCase().includes('attachment') ||
        msg.toLowerCase().includes('dependent') ||
        msg.toLowerCase().includes('foreign key') ||
        msg.toLowerCase().includes('constraint')
      ) {
        toast.error('❌ Cannot delete subject: It has attachments or dependencies.');
      } else {
        toast.error('⚠️ Failed to delete subject.');
      }
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
      await updateCourse(editing, { ...editSubject });
      setEditSubject({ title: '', description: '' });
      setEditing(null);
      toast.success('✏️ Changes saved.');
      await reloadSubjects();
    } catch (error) {
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
      const loadingToast = toast.loading('Importing courses...');
      await importCourses(formData);
      toast.dismiss(loadingToast);
      toast.success('✅ Courses imported successfully!');
      setFile(null);
      await reloadSubjects();
    } catch (error) {
      toast.error(`⚠️ Import failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error('⚠️ Logout failed');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
      <div className="admin-container">
        <ToastContainer position="top-center" />
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <div className="admin-header-buttons">
            <button className="home-btn" onClick={handleGoHome}>
              <FaHome style={{ marginRight: 8 }} />
              Homepage
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="upload-section">
          <h2 className="upload-title">Import Subjects</h2>
          <p className="upload-subtitle">
            Upload a file (PDF, CSV, Excel) containing subject information.
          </p>
          <div className="upload-box">
            <label htmlFor="admin-file-upload" className="custom-upload-label">
              <FaFileUpload size={20} />
              {file ? file.name : "Choose File"}
            </label>
            <input
                id="admin-file-upload"
                type="file"
                accept=".csv, .xls, .xlsx, .pdf"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
            />
          </div>
          <div className="upload-actions">
            <button className="import-btn" onClick={handleImport} disabled={!file}>
              <FaFileUpload style={{ marginRight: 8 }} />
              Import Subjects
            </button>
          </div>
        </div>

        <div className="subject-form">
          <label className="form-title">{editing ? 'Edit Subject' : 'Add Subject'}</label>
          {editing && (
              <p className="editing-indicator">✏️ Currently editing...</p>
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
          <button className="form-btn" onClick={(e) => {
            e.preventDefault();
            editing ? handleSaveEdit() : handleAddSubject();
          }}>
            {editing ? <FaEdit/> : <FaPlus/>}
            <span style={{marginLeft: '8px'}}>
              {editing ? 'Save Changes' : 'Add Subject'}
            </span>
          </button>
        </div>

        <h2 className="subjects-list-title">Subjects List</h2>
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
                        <button className="edit-btn" onClick={() => handleEditSubject(subject)} title="Edit">
                          <FaEdit />
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteSubject(subject.id)} title="Delete">
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

