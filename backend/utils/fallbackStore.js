const fallbackStudents = [];

function normalizeFallbackStudent(student) {
  const createdAt = new Date();
  return {
    ...student,
    _id: student._id || `memory-${createdAt.getTime()}`,
    fullName: student.fullName || student.name || 'Unknown Student',
    courseTrack: student.courseTrack || student.class || 'N/A',
    guardianName: student.guardianName || student.guardian || 'N/A',
    mobileNumber: student.mobileNumber || student.phone || '',
    registrationDate: student.registrationDate || createdAt,
    createdAt,
    __source: 'memory-fallback'
  };
}

function addFallbackStudent(student) {
  const normalized = normalizeFallbackStudent(student);
  fallbackStudents.unshift(normalized);
  return normalized;
}

function getFallbackStudents() {
  return fallbackStudents.slice();
}

function getFallbackStats() {
  const students = getFallbackStudents();
  const totalStudents = students.length;
  const feeCollection = students.reduce((sum, student) => sum + Number(student.feesPaid || 0), 0);
  const outstandingPayments = students.reduce((sum, student) => sum + Math.max(0, Number(student.totalFees || 7500) - Number(student.feesPaid || 0)), 0);
  const activeStudents = students.filter((student) => String(student.paymentStatus || '').toLowerCase() === 'paid').length;
  const chartData = students.map((student) => ({
    name: (student.fullName || 'Student').split(' ')[0],
    amount: student.feesPaid || 0
  }));

  return {
    totalStudents,
    feeCollection,
    outstandingPayments,
    activeStudents,
    studentsList: students,
    chartData: chartData.length > 0 ? chartData : [{ name: 'Start', amount: 0 }]
  };
}

module.exports = {
  addFallbackStudent,
  getFallbackStudents,
  getFallbackStats
};