import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import StudentForm from '../components/StudentForm';

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const { addStudent } = useStudents();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await addStudent(data);
      navigate('/');
    } catch (error) {
      console.error('Failed to add student:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Student
          </h2>
        </div>
        <div className="px-6 py-4">
          <StudentForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AddStudent;