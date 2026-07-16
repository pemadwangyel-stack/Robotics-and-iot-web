const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { getFallbackStats, getFallbackStudents } = require('../utils/fallbackStore');

// DELETE /api/dashboard/students/:id
router.delete('/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    return res.json({
      success: true,
      message: 'Student deleted successfully',
      student: deletedStudent
    });
  } catch (error) {
    console.error('❌ Error deleting student:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete student' });
  }
});

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const [statsDoc] = await Student.aggregate([
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          feeCollection: { $sum: { $ifNull: ['$feesPaid', 0] } },
          outstandingPayments: {
            $sum: {
              $max: [
                {
                  $subtract: [
                    { $ifNull: ['$totalFees', 7500] },
                    { $ifNull: ['$feesPaid', 0] }
                  ]
                },
                0
              ]
            }
          },
          activeStudents: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    { $toLower: { $ifNull: ['$paymentStatus', 'pending'] } },
                    'paid'
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalStudents: 1,
          feeCollection: 1,
          outstandingPayments: 1,
          activeStudents: 1
        }
      }
    ]);

    const stats = statsDoc || {
      totalStudents: 0,
      feeCollection: 0,
      outstandingPayments: 0,
      activeStudents: 0
    };

    const studentsList = await Student.find()
      .sort({ registrationDate: -1 })
      .lean();

    const chartData = studentsList.map((student) => ({
      name: student.fullName ? student.fullName.split(' ')[0] : 'Student',
      amount: student.feesPaid || 0
    }));

    const fallbackStats = getFallbackStats();
    const combinedStudents = [...studentsList, ...fallbackStats.studentsList.filter((student) => !studentsList.some((item) => item._id === student._id))];

    res.json({
      success: true,
      totalStudents: stats.totalStudents + fallbackStats.totalStudents,
      feeCollection: stats.feeCollection + fallbackStats.feeCollection,
      outstandingPayments: stats.outstandingPayments + fallbackStats.outstandingPayments,
      activeStudents: stats.activeStudents + fallbackStats.activeStudents,
      studentsList: combinedStudents,
      chartData: chartData.length > 0 || fallbackStats.chartData.length > 0 ? [...chartData, ...fallbackStats.chartData] : [{ name: 'Start', amount: 0 }]
    });
  } catch (error) {
    const fallbackStats = getFallbackStats();
    res.status(500).json({
      success: false,
      message: 'Live system aggregation failure',
      error: error.message,
      fallbackStats
    });
  }
});

// GET /api/dashboard/students - Get all students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ registrationDate: -1 }).lean();
    const fallbackStudents = getFallbackStudents();
    const combined = [...students, ...fallbackStudents];
    res.json({ success: true, data: combined });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;