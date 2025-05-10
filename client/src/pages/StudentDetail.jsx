import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useForm } from 'react-hook-form';
import { jsPDF } from 'jspdf';
import { getStudentById, updateStudent as mockUpdateStudent, deleteStudent as mockDeleteStudent } from '../services/mockApi';
import { toast } from 'react-toastify';
import {
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateStudent, deleteStudent } = useStudents();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      course: ''
    }
  });

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        const data = await getStudentById(id);
        setStudent(data);
        reset(data);
      } catch (error) {
        console.error('Failed to load student:', error);
        setStudent(null);
        setTimeout(() => navigate('/'), 1500);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id, reset, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!student && !loading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student not found. Redirecting to list...
        </h2>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const updatedStudent = await mockUpdateStudent(id, data);
      setStudent(updatedStudent);
      setIsEditing(false);
      toast.success('Student updated successfully');
      navigate('/', { state: { refresh: true, message: 'Student updated successfully' } });
    } catch (error) {
      console.error('Failed to update student:', error);
      toast.error('Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await mockDeleteStudent(id);
      toast.success('Student deleted successfully');
      navigate('/', { state: { refresh: true, message: 'Student deleted successfully' } });
    } catch (error) {
      console.error('Failed to delete student:', error);
      toast.error('Failed to delete student');
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Student Details', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Name: ${student.name}`, 20, 40);
    doc.text(`Email: ${student.email}`, 20, 50);
    doc.text(`Course: ${student.course}`, 20, 60);
    doc.text(`Date Added: ${student.dateAdded}`, 20, 70);
    
    doc.save(`student-${student.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Student Details
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={generatePDF}
              className="group relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              aria-label="Download PDF"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Download PDF
              </span>
            </button>
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="group relative p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  aria-label="Edit student"
                >
                  <PencilIcon className="h-5 w-5" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Edit student
                  </span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="group relative p-2 text-red-600 hover:text-red-800 dark:text-red-400"
                  aria-label="Delete student"
                >
                  <TrashIcon className="h-5 w-5" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Delete student
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                {...register('name', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-12 sm:h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                {...register('email', { required: true, type: 'email' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-12 sm:h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Course
              </label>
              <input
                {...register('course', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-12 sm:h-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  reset(student);
                }}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-white break-words">{student.name}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-white break-words">{student.email}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Course</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-white break-words">{student.course}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Added</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-white break-words">{student.dateAdded}</p>
            </div>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Delete Student
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetail; 