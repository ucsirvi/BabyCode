import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { fetchStudents, addStudent as mockAddStudent, updateStudent as mockUpdateStudent, deleteStudent as mockDeleteStudent } from '../services/mockApi';

const StudentContext = createContext(null);

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    course: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchStudents(currentPage, itemsPerPage, filters.search, filters);
      setStudents(response.students);
      setTotalPages(response.totalPages);
    } catch (error) {
      if (students.length === 0) {
        toast.error('Failed to load students');
      }
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, students.length, currentPage, itemsPerPage]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: localSearch }));
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    setSearchTimeout(timeoutId);
    return () => {
      clearTimeout(searchTimeout);
    };
  }, [localSearch]);

  const addStudent = async (studentData) => {
    try {
      setLoading(true);
      const newStudent = await mockAddStudent(studentData);
      toast.success('Student added successfully');
      const response = await fetchStudents(currentPage, itemsPerPage, filters.search, filters);
      setStudents(response.students);
      setTotalPages(response.totalPages);
      return newStudent;
    } catch (error) {
      toast.error('Failed to add student');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      setLoading(true);
      const updatedStudent = await mockUpdateStudent(id, studentData);
      toast.success('Student updated successfully');
      const response = await fetchStudents(currentPage, itemsPerPage, filters.search, filters);
      setStudents(response.students);
      setTotalPages(response.totalPages);
      return updatedStudent;
    } catch (error) {
      toast.error('Failed to update student');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      setLoading(true);
      await mockDeleteStudent(id);
      toast.success('Student deleted successfully');
      const response = await fetchStudents(currentPage, itemsPerPage, filters.search, filters);
      setStudents(response.students);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to delete student');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback((searchTerm) => {
    setLocalSearch(searchTerm);
  }, []);

  const value = {
    students,
    loading,
    filters,
    setFilters,
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    debouncedSearch,
    localSearch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

StudentProvider.propTypes = {
  children: PropTypes.node.isRequired
};