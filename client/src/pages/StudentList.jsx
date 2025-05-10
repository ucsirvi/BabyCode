import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TableCellsIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { fetchStudents } from '../services/mockApi';
import { jsPDF } from 'jspdf';

const ITEMS_PER_PAGE = 10;

const StudentList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { 
    students, 
    loading, 
    filters, 
    setFilters,
    loadStudents,
    debouncedSearch,
    localSearch,
    currentPage,
    setCurrentPage,
    totalPages
  } = useStudents();

  const [viewMode, setViewMode] = useState('table'); 
  const [availableCourses, setAvailableCourses] = useState([]);
  const [sortTransition, setSortTransition] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const courses = [...new Set(students.map(student => student.course))];
    setAvailableCourses(courses.sort());
  }, [students]);

  useEffect(() => {
    // Highlight row if newStudentId is present
    if (location.state?.newStudentId) {
      setHighlightedId(location.state.newStudentId);
      setTimeout(() => setHighlightedId(null), 2000);
    }
    // Show toast and refresh only once if message is present
    if (location.state?.message) {
      toast.success(location.state.message);
      loadStudents();
      window.history.replaceState({}, document.title);
    } else if (location.state?.refresh) {
      loadStudents();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, loadStudents]);

  const handleSearch = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
    setCurrentPage(1); 
  };

  const handleCourseFilter = (e) => {
    setFilters({ ...filters, course: e.target.value });
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortTransition(true);
    setFilters({
      ...filters,
      sortBy: field,
      sortOrder: filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc'
    });
    setTimeout(() => setSortTransition(false), 300);
  };

  const handleStudentClick = (student) => {
    if (user) {
      navigate(`/students/${student.id}`);
    } else {
      toast.warning('Please login to view student details');
      navigate('/login');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Course', 'Date Added'],
      ...students.map(student => [
        student.name,
        student.email,
        student.course,
        new Date(student.dateAdded).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Student Report', 20, 20);
    
    let y = 40;
    selectedStudents.forEach((student, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${student.name}`, 20, y);
      doc.setFontSize(10);
      doc.text(`Email: ${student.email}`, 30, y + 7);
      doc.text(`Course: ${student.course}`, 30, y + 14);
      doc.text(`Added: ${new Date(student.dateAdded).toLocaleDateString()}`, 30, y + 21);
      
      y += 35;
    });

    doc.save('student-report.pdf');
    toast.success('PDF report generated successfully');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedStudents = useMemo(() => {
    return students;
  }, [students]);

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === 'asc' ? 
      <ArrowUpIcon className="h-4 w-4" /> : 
      <ArrowDownIcon className="h-4 w-4" />;
  };

  const renderTableRow = (student) => (
    <tr
      className={`transition-all duration-300 ${
        highlightedId === student.id 
          ? 'bg-green-50 dark:bg-green-900'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedStudents.includes(student)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStudents([...selectedStudents, student]);
            } else {
              setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
            }
          }}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          to={`/students/${student.id}`}
          state={!user ? { from: `/students/${student.id}` } : undefined}
          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              toast.warning('Please login to view student details');
              navigate('/login', { state: { from: `/students/${student.id}` } });
            }
          }}
        >
          {student.name}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
      <td className="px-6 py-4 whitespace-nowrap">{student.course}</td>
      <td className="px-6 py-4 whitespace-nowrap">{student.dateAdded}</td>
    </tr>
  );

  const renderCardView = (student) => (
    <div
      className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-all duration-300 ${
        highlightedId === student.id
          ? 'ring-2 ring-green-500 transform scale-102'
          : 'hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start">
        <input
          type="checkbox"
          checked={selectedStudents.includes(student)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStudents([...selectedStudents, student]);
            } else {
              setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
            }
          }}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <Link 
          to={`/students/${student.id}`}
          state={!user ? { from: `/students/${student.id}` } : undefined}
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              toast.warning('Please login to view student details');
              navigate('/login', { state: { from: `/students/${student.id}` } });
            }
          }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {student.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{student.email}</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {student.course}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Added: {student.dateAdded}
          </p>
        </Link>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <button
            onClick={() => setViewMode(prev => prev === 'table' ? 'card' : 'table')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {viewMode === 'table' ? 
              <Squares2X2Icon className="h-5 w-5" /> : 
              <TableCellsIcon className="h-5 w-5" />
            }
          </button>
          {user && (
            <Link
              to="/student/new"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full sm:w-auto justify-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Student
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            className="pl-10 pr-4 py-2 w-full border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            value={localSearch}
            onChange={handleSearch}
          />
        </div>
        <select
          value={filters.course}
          onChange={handleCourseFilter}
          className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white w-full sm:w-auto"
        >
          <option value="" className="dark:bg-gray-800">All Courses</option>
          {availableCourses.map(course => (
            <option key={course} value={course} className="dark:bg-gray-800">{course}</option>
          ))}
        </select>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full sm:w-auto"
        >
          Export CSV
        </button>
        <button
          onClick={handleGeneratePDF}
          disabled={selectedStudents.length === 0}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 w-full sm:w-auto"
        >
          Generate PDF Report
        </button>
      </div>

      {viewMode === 'table' ? (
        <>
          <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <span>Select</span>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <span>Name</span>
                        <SortIcon field="name" />
                      </button>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('email')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <span>Email</span>
                        <SortIcon field="email" />
                      </button>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('course')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <span>Course</span>
                        <SortIcon field="course" />
                      </button>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('dateAdded')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <span>Date Added</span>
                        <SortIcon field="dateAdded" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student]);
                            } else {
                              setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/students/${student.id}`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          {student.name}
                        </Link>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {student.email}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">
                        {student.course}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {student.dateAdded}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="sm:hidden">
            {paginatedStudents.map(student => (
              <div key={student.id} className="bg-white dark:bg-gray-800 shadow rounded-lg mb-4 p-4">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents([...selectedStudents, student]);
                      } else {
                        setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <Link 
                    to={`/students/${student.id}`}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    {student.name}
                  </Link>
                </div>
                <div className="space-y-2 text-sm text-gray-900 dark:text-gray-300">
                  <p><span className="font-medium">Email:</span> {student.email}</p>
                  <p><span className="font-medium">Course:</span> {student.course}</p>
                  <p><span className="font-medium">Added:</span> {student.dateAdded}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedStudents.map(student => (
            <div
              key={student.id}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents([...selectedStudents, student]);
                      } else {
                        setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <Link 
                    to={`/students/${student.id}`}
                    className="flex-1 ml-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-900 dark:text-gray-300 mt-1">{student.email}</p>
                    <p className="text-sm text-gray-900 dark:text-gray-300 mt-2">
                      {student.course}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Added: {student.dateAdded}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-2 mt-4">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
            >
              Next
            </button>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList; 