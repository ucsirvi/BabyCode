const mockStudents = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    course: 'React Development',
    dateAdded: '2024-01-01',
    grade: 'A',
    age: 22,
    status: 'Active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    course: 'Node.js Basics',
    dateAdded: '2024-01-02',
    grade: 'B+',
    age: 20,
    status: 'Active'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    course: 'Python Programming',
    dateAdded: '2024-01-03',
    grade: 'A-',
    age: 21,
    status: 'Active'
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'emily@example.com',
    course: 'Web Design',
    dateAdded: '2024-01-04',
    grade: 'A+',
    age: 19,
    status: 'Active'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@example.com',
    course: 'Data Science',
    dateAdded: '2024-01-05',
    grade: 'B',
    age: 23,
    status: 'Active'
  },
  {
    id: '6',
    name: 'Sarah Davis',
    email: 'sarah@example.com',
    course: 'Mobile Development',
    dateAdded: '2024-01-06',
    grade: 'A',
    age: 22,
    status: 'Active'
  },
  {
    id: '7',
    name: 'James Anderson',
    email: 'james@example.com',
    course: 'Cloud Computing',
    dateAdded: '2024-01-07',
    grade: 'B+',
    age: 24,
    status: 'Active'
  },
  {
    id: '8',
    name: 'Lisa Martinez',
    email: 'lisa@example.com',
    course: 'UI/UX Design',
    dateAdded: '2024-01-08',
    grade: 'A-',
    age: 21,
    status: 'Active'
  },
  // Additional mock students for pagination
  {
    id: '9', name: 'Student 9', email: 'student9@example.com', course: 'React Development', dateAdded: '2024-01-09', grade: 'B', age: 20, status: 'Active'
  },
  {
    id: '10', name: 'Student 10', email: 'student10@example.com', course: 'Node.js Basics', dateAdded: '2024-01-10', grade: 'A', age: 22, status: 'Active'
  },
  {
    id: '11', name: 'Student 11', email: 'student11@example.com', course: 'Python Programming', dateAdded: '2024-01-11', grade: 'A-', age: 23, status: 'Active'
  },
  {
    id: '12', name: 'Student 12', email: 'student12@example.com', course: 'Web Design', dateAdded: '2024-01-12', grade: 'B+', age: 21, status: 'Active'
  },
  {
    id: '13', name: 'Student 13', email: 'student13@example.com', course: 'Data Science', dateAdded: '2024-01-13', grade: 'A', age: 24, status: 'Active'
  },
  {
    id: '14', name: 'Student 14', email: 'student14@example.com', course: 'Mobile Development', dateAdded: '2024-01-14', grade: 'B', age: 19, status: 'Active'
  },
  {
    id: '15', name: 'Student 15', email: 'student15@example.com', course: 'Cloud Computing', dateAdded: '2024-01-15', grade: 'A+', age: 22, status: 'Active'
  },
  {
    id: '16', name: 'Student 16', email: 'student16@example.com', course: 'UI/UX Design', dateAdded: '2024-01-16', grade: 'A-', age: 20, status: 'Active'
  },
  {
    id: '17', name: 'Student 17', email: 'student17@example.com', course: 'React Development', dateAdded: '2024-01-17', grade: 'B+', age: 21, status: 'Active'
  },
  {
    id: '18', name: 'Student 18', email: 'student18@example.com', course: 'Node.js Basics', dateAdded: '2024-01-18', grade: 'A', age: 23, status: 'Active'
  },
  {
    id: '19', name: 'Student 19', email: 'student19@example.com', course: 'Python Programming', dateAdded: '2024-01-19', grade: 'B', age: 24, status: 'Active'
  },
  {
    id: '20', name: 'Student 20', email: 'student20@example.com', course: 'Web Design', dateAdded: '2024-01-20', grade: 'A-', age: 22, status: 'Active'
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchStudents = async (page = 1, limit = 10, search = '', filters = {}) => {
  console.log('📡 Fetching students...', { page, limit, search, filters });
  await delay(100);

  let filteredStudents = [...mockStudents];

  // Apply search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredStudents = filteredStudents.filter(student => {
      const searchString = `${student.name} ${student.email}`.toLowerCase();
      return searchString.includes(searchLower);
    });
  }

  // Apply course filter
  if (filters.course) {
    filteredStudents = filteredStudents.filter(student => student.course === filters.course);
  }

  // Apply sorting
  if (filters.sortBy) {
    const sortField = filters.sortBy;
    const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
    filteredStudents.sort((a, b) => {
      return sortOrder * String(a[sortField]).localeCompare(String(b[sortField]));
    });
  }

  // Apply pagination
  const start = (page - 1) * limit;
  const paginatedStudents = filteredStudents.slice(start, start + limit);

  console.log('✅ Students fetched successfully:', {
    students: paginatedStudents,
    total: filteredStudents.length,
    totalPages: Math.ceil(filteredStudents.length / limit)
  });

  return {
    students: paginatedStudents,
    total: filteredStudents.length,
    totalPages: Math.ceil(filteredStudents.length / limit)
  };
};

export const getStudentById = async (id) => {
  console.log('📡 Fetching student by ID:', id);
  await delay(100);
  const student = mockStudents.find(s => s.id === String(id));
  if (!student) throw new Error('Student not found');
  console.log('✅ Student fetched successfully:', student);
  return student;
};

export const addStudent = async (studentData) => {
  console.log('📡 Adding new student:', studentData);
  await delay(100);
  const newStudent = {
    id: Date.now().toString(),
    ...studentData,
    dateAdded: new Date().toISOString().split('T')[0]
  };
  mockStudents.push(newStudent);
  console.log('✅ Student added successfully:', newStudent);
  return newStudent;
};

export const updateStudent = async (id, studentData) => {
  console.log('📡 Updating student:', id, studentData);
  await delay(100);
  const index = mockStudents.findIndex(student => student.id === String(id));
  if (index === -1) throw new Error('Student not found');
  
  mockStudents[index] = {
    ...mockStudents[index],
    ...studentData
  };
  console.log('✅ Student updated successfully:', mockStudents[index]);
  return mockStudents[index];
};

export const deleteStudent = async (id) => {
  console.log('📡 Deleting student:', id);
  await delay(100);
  const index = mockStudents.findIndex(student => student.id === String(id));
  if (index === -1) throw new Error('Student not found');
  
  mockStudents.splice(index, 1);
  console.log('✅ Student deleted successfully');
};