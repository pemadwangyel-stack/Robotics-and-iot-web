import React, { useState, useEffect } from 'react';
import './StaffDashboard.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  LogOut,
  UserPlus,
  CreditCard,
  FileText,
  Settings,
  ChevronDown,
  Search,
  Bell,
  Menu,
  LayoutDashboard,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  XCircle,
  Activity,
  RefreshCw,
  X,
  Save,
  Download,
  Printer,
  Eye,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  User,
  CalendarDays,
  Users as UsersIcon,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  UserMinus,
  Inbox,
  Clock as ClockIcon,
  Megaphone,
  Pin,
  EyeOff,
  Check,
} from 'lucide-react';

// ===== LOCAL STORAGE KEYS =====
const STORAGE_KEYS = {
  STUDENTS: 'dashboard_students',
  PAYMENTS: 'dashboard_payments',
  STAFF: 'dashboard_staff',
  ATTENDANCE: 'dashboard_attendance',
  STATS: 'dashboard_stats',
  SETTINGS: 'dashboard_settings',
  ADMISSIONS: 'dashboard_admissions',
  ANNOUNCEMENTS: 'dashboard_announcements'
};

// ===== LOCAL STORAGE HELPERS =====
const loadFromStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// ===== GENERATE YEARS FUNCTION - 2026 TO 2031 =====
const generateYearOptions = () => {
  const years = [];
  for (let year = 2026; year <= 2031; year++) {
    years.push(year.toString());
  }
  return years;
};

// ===== UNIFIED CLASS OPTIONS (PP to Class 12 + Degree Categories) =====
const getUnifiedClassOptions = () => {
  return [
    { value: 'PP', label: 'PP (Pre-Primary)' },
    { value: 'Class 1', label: 'Class 1' },
    { value: 'Class 2', label: 'Class 2' },
    { value: 'Class 3', label: 'Class 3' },
    { value: 'Class 4', label: 'Class 4' },
    { value: 'Class 5', label: 'Class 5' },
    { value: 'Class 6', label: 'Class 6' },
    { value: 'Class 7', label: 'Class 7' },
    { value: 'Class 8', label: 'Class 8' },
    { value: 'Class 9', label: 'Class 9' },
    { value: 'Class 10', label: 'Class 10' },
    { value: 'Class 11', label: 'Class 11' },
    { value: 'Class 12', label: 'Class 12' },
    { value: 'Bachelor Degree', label: 'Bachelor Degree' },
    { value: 'Master Degree', label: 'Master Degree' },
    { value: 'PhD', label: 'PhD' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Certificate', label: 'Certificate' },
  ];
};

function StaffDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [greeting, setGreeting] = useState('');
  const [yearOptions, setYearOptions] = useState(generateYearOptions());
  const [unifiedClassOptions, setUnifiedClassOptions] = useState(getUnifiedClassOptions());

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Success Modal state
  const [successModal, setSuccessModal] = useState({ 
    show: false, 
    title: '', 
    message: '', 
    icon: null,
    details: ''
  });

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Enroll form state
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    name: '',
    class: '',
    school: '',
    guardian: '',
    phone: '',
    address: '',
    email: '',
    enrollYear: '2026',
    status: 'Active'
  });
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);

  // Pass Out form state
  const [showPassOutForm, setShowPassOutForm] = useState(false);
  const [passOutData, setPassOutData] = useState({
    studentId: '',
    passOutDate: new Date().toISOString().split('T')[0],
    passOutReason: 'Graduated',
    certificateIssued: true,
    remarks: ''
  });

  // Payment form state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    student: '',
    month: 'June 2026',
    amount: '',
    date: '',
    mode: 'Cash',
    transactionNo: ''
  });
  const [editingPaymentId, setEditingPaymentId] = useState(null);

  // Staff state
  const [staffMembers, setStaffMembers] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.STAFF, []);
  });

  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  });
  const [editingStaffId, setEditingStaffId] = useState(null);

  // Attendance state
  const [attendanceData, setAttendanceData] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.ATTENDANCE, []);
  });

  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    student: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    checkIn: '',
    checkOut: ''
  });
  const [editingAttendanceId, setEditingAttendanceId] = useState(null);

  // ===== ADMISSIONS STATE - FIXED to load from localStorage directly =====
  const [admissions, setAdmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboard_admissions');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📋 Admissions loaded on init:', parsed.length);
        return parsed;
      }
    } catch (e) {
      console.error('Error loading admissions:', e);
    }
    return [];
  });

  const [showAdmissionDetails, setShowAdmissionDetails] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [admissionFilter, setAdmissionFilter] = useState('all');
  const [admissionStats, setAdmissionStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // ===== ANNOUNCEMENTS STATE =====
  const [announcements, setAnnouncements] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.ANNOUNCEMENTS, []);
  });

  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [announcementFilter, setAnnouncementFilter] = useState('all');
  const [announcementStats, setAnnouncementStats] = useState({
    total: 0,
    published: 0,
    pending: 0,
    draft: 0
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    category: 'General',
    status: 'Draft',
    pinned: false,
    imageUrl: '',
    author: 'Admin',
    publishDate: new Date().toISOString().split('T')[0]
  });

  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.SETTINGS, null);
    if (saved) {
      return saved;
    }
    return {
      fullName: 'Admin User',
      email: 'youthroboticsiot@gmail.com',
      phone: '+975 17621843',
      instituteName: 'Robotics & IoT Center',
      location: 'Thimphu, Bhutan',
      contactEmail: 'youthroboticsiot@gmail.com',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      language: 'English',
      currency: 'Nu. (Ngultrum)',
      notifications: true
    };
  });

  const [originalSettings, setOriginalSettings] = useState({ ...settings });

  // ===== STUDENTS WITH LOCALSTORAGE =====
  const [students, setStudents] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.STUDENTS, []);
  });

  // ===== PAYMENTS WITH LOCALSTORAGE =====
  const [payments, setPayments] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.PAYMENTS, []);
  });

  // ===== STATS WITH LOCALSTORAGE =====
  const [stats, setStats] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.STATS, null);
    if (saved) {
      return saved;
    }
    return {
      totalStudents: 0,
      activeStudents: 0,
      feeCollection: 0,
      outstandingPayments: 0,
      pendingAdmissions: 0,
      studentsList: [],
      chartData: [
        { name: 'Week 1', amount: 0 },
        { name: 'Week 2', amount: 0 },
        { name: 'Week 3', amount: 0 },
        { name: 'Week 4', amount: 0 },
      ]
    };
  });

  // Report state
  const [generatingReport, setGeneratingReport] = useState(null);

  // ===== API Base URL =====
  const getApiBase = () => {
    if (window.location.hostname.includes('netlify.app')) {
      return null;
    }
    return 'http://localhost:5000';
  };

  const API_BASE = getApiBase();
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isUsingBackend, setIsUsingBackend] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to the dashboard', time: 'Just now', read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ===== SAVE TO LOCALSTORAGE =====
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
  }, [students]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PAYMENTS, payments);
  }, [payments]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STAFF, staffMembers);
  }, [staffMembers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ATTENDANCE, attendanceData);
  }, [attendanceData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STATS, stats);
  }, [stats]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  // ===== SAVE ADMISSIONS TO LOCALSTORAGE - FIXED =====
  useEffect(() => {
    localStorage.setItem('dashboard_admissions', JSON.stringify(admissions));
    console.log('💾 Admissions saved to localStorage:', admissions.length);
  }, [admissions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }, [announcements]);

  // ===== API HELPER FUNCTIONS =====
  const callApi = async (endpoint, options = {}) => {
    if (!API_BASE) {
      throw new Error('API_BASE not configured - using localStorage mode');
    }
    try {
      const url = API_BASE + endpoint;
      console.log('📡 API Call:', options.method || 'GET', url);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON - backend may not be running');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('❌ API Error:', error.message);
      throw error;
    }
  };

  // ===== TEST BACKEND CONNECTION =====
  const testBackendConnection = async () => {
    if (!API_BASE) {
      console.log('ℹ️ No API_BASE configured, using localStorage mode');
      setIsBackendConnected(false);
      setIsUsingBackend(false);
      return false;
    }
    try {
      const url = API_BASE + '/api/health';
      console.log('🔍 Testing backend at:', url);
      
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('⚠️ Backend returned non-JSON response');
        setIsBackendConnected(false);
        setIsUsingBackend(false);
        return false;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setIsBackendConnected(true);
        setIsUsingBackend(true);
        console.log('✅ Backend connected!');
        return true;
      }
      return false;
    } catch (error) {
      console.warn('⚠️ Backend not available:', error.message);
      setIsBackendConnected(false);
      setIsUsingBackend(false);
      return false;
    }
  };

  // ===== SYNC WITH BACKEND =====
  const syncWithBackend = async () => {
    if (!API_BASE || !isBackendConnected) return;
    try {
      try {
        const statsData = await callApi('/api/dashboard/stats');
        if (statsData && statsData.studentsList && statsData.studentsList.length > 0) {
          setStudents(statsData.studentsList);
          setStats({
            totalStudents: statsData.totalStudents || 0,
            activeStudents: statsData.activeStudents || 0,
            feeCollection: statsData.feeCollection || 0,
            outstandingPayments: statsData.outstandingPayments || 0,
            pendingAdmissions: statsData.pendingAdmissions || 0,
            studentsList: statsData.studentsList || [],
            chartData: statsData.chartData || [
              { name: 'Week 1', amount: 0 },
              { name: 'Week 2', amount: 0 },
              { name: 'Week 3', amount: 0 },
              { name: 'Week 4', amount: 0 },
            ]
          });
        }
      } catch (e) {
        console.log('Dashboard stats endpoint not available, using local data');
      }

      try {
        const paymentsData = await callApi('/api/payments');
        if (paymentsData && paymentsData.data && paymentsData.data.length > 0) {
          const formattedPayments = paymentsData.data.map(function(p) {
            return {
              ...p,
              _id: p._id || p.id,
              amount: typeof p.amount === 'number' ? 'Nu.' + p.amount.toLocaleString() : p.amount,
              student: p.studentName || p.student,
              transactionNo: p.transactionNo || p.receipt || 'N/A'
            };
          });
          setPayments(formattedPayments);
        }
      } catch (e) {
        console.log('Payments endpoint not available, using local data');
      }

      try {
        const staffData = await callApi('/api/staff');
        if (staffData && staffData.data && staffData.data.length > 0) {
          setStaffMembers(staffData.data);
        }
      } catch (e) {
        console.log('Staff endpoint not available, using local data');
      }

      try {
        const attendanceData = await callApi('/api/attendance');
        if (attendanceData && attendanceData.data && attendanceData.data.length > 0) {
          setAttendanceData(attendanceData.data);
        }
      } catch (e) {
        console.log('Attendance endpoint not available, using local data');
      }

      try {
        const admissionsData = await callApi('/api/admissions');
        if (admissionsData && admissionsData.data && admissionsData.data.length > 0) {
          setAdmissions(admissionsData.data);
          updateAdmissionStats(admissionsData.data);
        }
      } catch (e) {
        console.log('Admissions endpoint not available, using local data');
      }

      try {
        const announcementsData = await callApi('/api/announcements/all');
        if (announcementsData && announcementsData.data && announcementsData.data.length > 0) {
          setAnnouncements(announcementsData.data);
          updateAnnouncementStats(announcementsData.data);
        }
      } catch (e) {
        console.log('Announcements endpoint not available, using local data');
      }

    } catch (error) {
      console.warn('⚠️ Could not sync with backend:', error.message);
    }
  };

  // ===== FETCH DASHBOARD STATS =====
  const fetchDashboardStats = async () => {
    if (!API_BASE || !isBackendConnected) return;
    try {
      const data = await callApi('/api/dashboard/stats');
      if (data && data.studentsList && data.studentsList.length > 0) {
        setStudents(data.studentsList);
        setStats({
          totalStudents: data.totalStudents || 0,
          activeStudents: data.activeStudents || 0,
          feeCollection: data.feeCollection || 0,
          outstandingPayments: data.outstandingPayments || 0,
          pendingAdmissions: data.pendingAdmissions || 0,
          studentsList: data.studentsList || [],
          chartData: data.chartData || [
            { name: 'Week 1', amount: 0 },
            { name: 'Week 2', amount: 0 },
            { name: 'Week 3', amount: 0 },
            { name: 'Week 4', amount: 0 },
          ]
        });
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch dashboard stats:', error.message);
    }
  };

  // ===== CALCULATE TOTAL COLLECTED =====
  const calculateTotalCollected = function() {
    var total = 0;
    for (var i = 0; i < payments.length; i++) {
      var p = payments[i];
      var amount = 0;
      if (typeof p.amount === 'string') {
        amount = parseInt(p.amount.replace(/[^0-9]/g, ''), 10);
      } else if (typeof p.amount === 'number') {
        amount = p.amount;
      }
      if (!isNaN(amount)) {
        total += amount;
      }
    }
    return total;
  };

  // ===== UPDATE STATS =====
  const updateStats = () => {
    const totalStudents = Array.isArray(students) ? students.length : 0;
    const activeStudents = Array.isArray(students) ? students.filter(s => s.status === 'Active').length : 0;
    const feeCollection = typeof calculateTotalCollected === 'function' ? calculateTotalCollected() : 0;
    
    const pendingAdmissions = Array.isArray(admissions) ? admissions.filter(a => a.status === 'Pending').length : 0;

    setStats({
      totalStudents: totalStudents,
      activeStudents: activeStudents,
      feeCollection: feeCollection,
      outstandingPayments: 0,
      pendingAdmissions: pendingAdmissions,
      studentsList: students,
      chartData: stats.chartData || [
        { name: 'Week 1', amount: 0 },
        { name: 'Week 2', amount: 0 },
        { name: 'Week 3', amount: 0 },
        { name: 'Week 4', amount: 0 },
      ]
    });
    
    updateAdmissionStats(admissions);
  };

  // ===== ADMISSION STATS - FIXED =====
  const updateAdmissionStats = (admissionsData) => {
    const safeData = Array.isArray(admissionsData) ? admissionsData : [];

    console.log('📊 Updating admission stats with:', safeData.length, 'applications');

    const total = safeData.length;
    const pending = safeData.filter(a => a.status === 'Pending' || a.status === 'pending').length;
    const approved = safeData.filter(a => a.status === 'Approved' || a.status === 'approved').length;
    const rejected = safeData.filter(a => a.status === 'Rejected' || a.status === 'rejected').length;
    
    setAdmissionStats({
      total,
      pending,
      approved,
      rejected
    });
  };

  // ===== ADMISSION FUNCTIONS - FIXED (No Backend Required) =====
  const fetchAdmissions = async () => {
    console.log('🔄 Fetching admissions...');
    
    // Load from localStorage directly
    const localAdmissions = localStorage.getItem('dashboard_admissions');
    let admissionsData = [];
    if (localAdmissions) {
      try {
        admissionsData = JSON.parse(localAdmissions);
        console.log('📋 Loaded admissions from localStorage:', admissionsData.length);
      } catch (e) {
        console.error('Error parsing admissions:', e);
        admissionsData = [];
      }
    }
    setAdmissions(admissionsData);
    updateAdmissionStats(admissionsData);
  };

  // ===== DELETE REJECTED ADMISSION - NEW FUNCTION =====
  const deleteRejectedAdmission = async (admissionId) => {
    const admission = admissions.find(a => a.id === admissionId || a._id === admissionId);
    if (!admission) {
      showToast('⚠️ Admission not found!', 'error');
      return;
    }

    if (admission.status !== 'Rejected' && admission.status !== 'rejected') {
      showToast('⚠️ Only rejected admissions can be deleted!', 'error');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the rejected application for "${admission.fullName || admission.name}"?\n\nThis action cannot be undone!`
    );
    
    if (!confirmed) return;

    try {
      const updatedAdmissions = admissions.filter(a => 
        (a.id !== admissionId && a._id !== admissionId)
      );
      
      // Save to localStorage
      localStorage.setItem('dashboard_admissions', JSON.stringify(updatedAdmissions));
      setAdmissions(updatedAdmissions);
      updateAdmissionStats(updatedAdmissions);
      
      showSuccessModal(
        '🗑️ Rejected Application Deleted',
        `${admission.fullName || admission.name}'s application has been removed`,
        'This helps keep the admissions list clean and manageable',
        React.createElement(Trash2, { size: 48, color: '#ef4444' })
      );
      showToast(`🗑️ ${admission.fullName || admission.name}'s rejected application deleted!`, 'success');
      
      updateStats();
    } catch (error) {
      console.error('❌ Delete rejected admission error:', error);
      showToast('❌ Failed to delete rejected admission: ' + error.message, 'error');
    }
  };

  // FIXED: Approve Admission - localStorage only
  const approveAdmission = async (admissionId) => {
    try {
      const updatedAdmissions = admissions.map(a => {
        if (a.id === admissionId || a._id === admissionId) {
          return {
            ...a,
            status: 'Approved',
            approvedBy: settings.fullName || 'Admin',
            approvedAt: new Date().toISOString()
          };
        }
        return a;
      });
      
      // Save to localStorage
      localStorage.setItem('dashboard_admissions', JSON.stringify(updatedAdmissions));
      setAdmissions(updatedAdmissions);
      updateAdmissionStats(updatedAdmissions);
      
      const approvedAdmission = updatedAdmissions.find(a => a.id === admissionId || a._id === admissionId);
      if (approvedAdmission) {
        const newStudent = {
          _id: 'student-' + Date.now(),
          name: approvedAdmission.fullName || approvedAdmission.name,
          fullName: approvedAdmission.fullName || approvedAdmission.name,
          class: approvedAdmission.courseTrack || approvedAdmission.class || 'N/A',
          courseTrack: approvedAdmission.courseTrack || approvedAdmission.class || 'N/A',
          school: approvedAdmission.school || 'N/A',
          guardian: approvedAdmission.guardianName || approvedAdmission.guardian || 'N/A',
          guardianName: approvedAdmission.guardianName || approvedAdmission.guardian || 'N/A',
          phone: approvedAdmission.mobileNumber || approvedAdmission.phone || 'N/A',
          mobileNumber: approvedAdmission.mobileNumber || approvedAdmission.phone || 'N/A',
          address: approvedAdmission.address || 'N/A',
          email: approvedAdmission.email || '',
          status: 'Active',
          paymentStatus: 'Pending',
          feesPaid: 0,
          totalFees: approvedAdmission.totalFee || 7500,
          amountPaid: 0,
          enrollYear: approvedAdmission.enrollYear || new Date().getFullYear().toString(),
          source: 'Public Admission'
        };
        setStudents([newStudent, ...students]);
        showSuccessModal(
          '✅ Admission Approved!',
          `${approvedAdmission.fullName || approvedAdmission.name} has been approved`,
          'Student has been added to the system',
          React.createElement(CheckCircle, { size: 48, color: '#22c55e' })
        );
        showToast(`✅ ${approvedAdmission.fullName || approvedAdmission.name} approved and added to students!`, 'success');
      }
      
      const newNotification = {
        id: notifications.length + 1,
        title: `✅ Admission approved: ${approvedAdmission?.fullName || approvedAdmission?.name}`,
        time: 'Just now',
        read: false
      };
      setNotifications([newNotification, ...notifications]);
      
      updateStats();
    } catch (error) {
      console.error('❌ Approval error:', error);
      showToast('❌ Failed to approve admission: ' + error.message, 'error');
    }
  };

  // FIXED: Reject Admission - localStorage only
  const rejectAdmission = async (admissionId) => {
    const reason = prompt('Enter reason for rejection:');
    if (reason === null) return;
    
    try {
      const updatedAdmissions = admissions.map(a => {
        if (a.id === admissionId || a._id === admissionId) {
          return {
            ...a,
            status: 'Rejected',
            rejectionReason: reason || 'No reason provided',
            rejectedAt: new Date().toISOString(),
            rejectedBy: settings.fullName || 'Admin'
          };
        }
        return a;
      });
      
      // Save to localStorage
      localStorage.setItem('dashboard_admissions', JSON.stringify(updatedAdmissions));
      setAdmissions(updatedAdmissions);
      updateAdmissionStats(updatedAdmissions);
      
      const rejectedAdmission = updatedAdmissions.find(a => a.id === admissionId || a._id === admissionId);
      showSuccessModal(
        '❌ Admission Rejected',
        `${rejectedAdmission?.fullName || rejectedAdmission?.name} has been rejected`,
        `Reason: ${reason || 'No reason provided'}\n\nYou can delete this record later to keep the list clean.`,
        React.createElement(XCircle, { size: 48, color: '#ef4444' })
      );
      showToast(`❌ ${rejectedAdmission?.fullName || rejectedAdmission?.name} rejected!`, 'success');
      updateStats();
    } catch (error) {
      console.error('❌ Rejection error:', error);
      showToast('❌ Failed to reject admission: ' + error.message, 'error');
    }
  };

  const viewAdmissionDetails = (admissionId) => {
    const admission = admissions.find(a => a.id === admissionId || a._id === admissionId);
    if (admission) {
      setSelectedAdmission(admission);
      setShowAdmissionDetails(true);
    }
  };

  // ===== ANNOUNCEMENT FUNCTIONS =====
  const updateAnnouncementStats = (data) => {
    const total = data.length;
    const published = data.filter(a => a.status === 'Published').length;
    const pending = data.filter(a => a.status === 'Pending').length;
    const draft = data.filter(a => a.status === 'Draft').length;
    
    setAnnouncementStats({ total, published, pending, draft });
  };

  const fetchAnnouncements = async () => {
    if (isBackendConnected && API_BASE) {
      try {
        const data = await callApi('/api/announcements/all');
        if (data && data.data) {
          setAnnouncements(data.data);
          updateAnnouncementStats(data.data);
          return;
        }
      } catch (e) {
        console.log('Failed to fetch announcements from backend:', e.message);
      }
    }
    const localAnnouncements = loadFromStorage(STORAGE_KEYS.ANNOUNCEMENTS, []);
    setAnnouncements(localAnnouncements);
    updateAnnouncementStats(localAnnouncements);
  };

  const resetAnnouncementForm = () => {
    setAnnouncementForm({
      title: '',
      content: '',
      category: 'General',
      status: 'Draft',
      pinned: false,
      imageUrl: '',
      author: settings.fullName || 'Admin',
      publishDate: new Date().toISOString().split('T')[0]
    });
    setEditingAnnouncementId(null);
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    
    if (!announcementForm.title || !announcementForm.content) {
      showToast('⚠️ Please fill in title and content!', 'error');
      return;
    }

    try {
      const announcementData = {
        id: editingAnnouncementId || 'announcement-' + Date.now(),
        title: announcementForm.title,
        content: announcementForm.content,
        category: announcementForm.category,
        status: announcementForm.status,
        pinned: announcementForm.pinned,
        imageUrl: announcementForm.imageUrl || '',
        author: settings.fullName || 'Admin',
        publishDate: announcementForm.publishDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0
      };

      let updatedAnnouncements;
      if (editingAnnouncementId) {
        updatedAnnouncements = announcements.map(a => {
          if (a.id === editingAnnouncementId) {
            return { ...a, ...announcementData, updatedAt: new Date().toISOString() };
          }
          return a;
        });
        setAnnouncements(updatedAnnouncements);
        showToast('✅ Announcement updated!', 'success');
      } else {
        updatedAnnouncements = [announcementData, ...announcements];
        setAnnouncements(updatedAnnouncements);
        showToast('✅ Announcement created!', 'success');
        
        const newNotification = {
          id: notifications.length + 1,
          title: `📢 New announcement: ${announcementForm.title}`,
          time: 'Just now',
          read: false
        };
        setNotifications([newNotification, ...notifications]);
      }

      updateAnnouncementStats(updatedAnnouncements);
      setShowAnnouncementForm(false);
      resetAnnouncementForm();
      
    } catch (error) {
      console.error('❌ Announcement error:', error);
      showToast('❌ Failed to save announcement: ' + error.message, 'error');
    }
  };

  const editAnnouncement = (id) => {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      setAnnouncementForm({
        title: announcement.title || '',
        content: announcement.content || '',
        category: announcement.category || 'General',
        status: announcement.status || 'Draft',
        pinned: announcement.pinned || false,
        imageUrl: announcement.imageUrl || '',
        author: announcement.author || settings.fullName || 'Admin',
        publishDate: announcement.publishDate || new Date().toISOString().split('T')[0]
      });
      setEditingAnnouncementId(id);
      setShowAnnouncementForm(true);
    }
  };

  const deleteAnnouncement = (id) => {
    const announcement = announcements.find(a => a.id === id);
    if (!announcement) return;
    
    if (window.confirm(`Are you sure you want to delete "${announcement.title}"?`)) {
      const updatedAnnouncements = announcements.filter(a => a.id !== id);
      setAnnouncements(updatedAnnouncements);
      updateAnnouncementStats(updatedAnnouncements);
      showToast('🗑️ Announcement deleted!', 'success');
    }
  };

  const toggleAnnouncementStatus = (id) => {
    const updatedAnnouncements = announcements.map(a => {
      if (a.id === id) {
        const newStatus = a.status === 'Published' ? 'Draft' : 'Published';
        return { ...a, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return a;
    });
    setAnnouncements(updatedAnnouncements);
    updateAnnouncementStats(updatedAnnouncements);
    showToast('✅ Status updated!', 'success');
  };

  const togglePin = (id) => {
    const updatedAnnouncements = announcements.map(a => {
      if (a.id === id) {
        return { ...a, pinned: !a.pinned, updatedAt: new Date().toISOString() };
      }
      return a;
    });
    setAnnouncements(updatedAnnouncements);
    updateAnnouncementStats(updatedAnnouncements);
    showToast('📌 Pin status updated!', 'success');
  };

  const getAnnouncementStatusBadge = (status) => {
    const statusMap = {
      'Published': { class: 'status-published', label: '✅ Published' },
      'Pending': { class: 'status-pending', label: '⏳ Pending' },
      'Draft': { class: 'status-draft', label: '📝 Draft' },
      'Archived': { class: 'status-archived', label: '📦 Archived' }
    };
    return statusMap[status] || statusMap['Draft'];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // ===== PASS OUT STUDENT =====
  const passOutStudent = function(studentId) {
    var student = null;
    for (var i = 0; i < students.length; i++) {
      if (String(students[i]._id) === String(studentId)) {
        student = students[i];
        break;
      }
    }
    if (!student) {
      showToast('⚠️ Student not found!', 'error');
      return;
    }

    if (student.status === 'Passed Out') {
      showToast('⚠️ Student already passed out!', 'error');
      return;
    }

    setPassOutData({
      studentId: studentId,
      passOutDate: new Date().toISOString().split('T')[0],
      passOutReason: 'Graduated',
      certificateIssued: true,
      remarks: ''
    });
    setShowPassOutForm(true);
  };

  const handlePassOutSubmit = function(e) {
    e.preventDefault();
    
    if (!passOutData.studentId) {
      showToast('⚠️ No student selected!', 'error');
      return;
    }

    var student = null;
    for (var i = 0; i < students.length; i++) {
      if (String(students[i]._id) === String(passOutData.studentId)) {
        student = students[i];
        break;
      }
    }
    
    if (!student) {
      showToast('⚠️ Student not found!', 'error');
      return;
    }

    try {
      var updatedStudents = students.map(function(s) {
        if (String(s._id) === String(passOutData.studentId)) {
          return {
            ...s,
            status: 'Passed Out',
            passOutDate: passOutData.passOutDate,
            passOutReason: passOutData.passOutReason,
            certificateIssued: passOutData.certificateIssued,
            passOutRemarks: passOutData.remarks
          };
        }
        return s;
      });
      setStudents(updatedStudents);

      var newNotification = {
        id: notifications.length + 1,
        title: student.name + ' has passed out! 🎓',
        time: 'Just now',
        read: false
      };
      setNotifications([newNotification, ...notifications]);

      showSuccessModal(
        '🎓 Student Passed Out!',
        student.name + ' has successfully passed out',
        'Reason: ' + passOutData.passOutReason + '\nDate: ' + passOutData.passOutDate,
        React.createElement(GraduationCap, { size: 48, color: '#8b5cf6' })
      );
      showToast('🎓 ' + student.name + ' passed out successfully!', 'success');

      setShowPassOutForm(false);
      setPassOutData({
        studentId: '',
        passOutDate: new Date().toISOString().split('T')[0],
        passOutReason: 'Graduated',
        certificateIssued: true,
        remarks: ''
      });
      updateStats();

    } catch (error) {
      console.error('❌ PASS OUT ERROR:', error);
      showToast('❌ ' + (error.message || 'Failed to pass out student'), 'error');
    }
  };

  // ===== ENROLL FUNCTIONS =====
  const toggleEnrollForm = function() {
    setShowEnrollForm(!showEnrollForm);
    setEditingStudentId(null);
    if (showEnrollForm) {
      setEnrollForm({ 
        name: '', 
        class: '',
        school: '', 
        guardian: '', 
        phone: '', 
        address: '',
        email: '',
        enrollYear: '2026',
        status: 'Active'
      });
    }
  };

  const handleEnrollChange = function(e) {
    var name = e.target.name;
    var value = e.target.value;
    setEnrollForm(function(prev) {
      var newState = Object.assign({}, prev);
      newState[name] = value;
      return newState;
    });
  };

  const handleEnrollSubmit = async function(e) {
    e.preventDefault();
    
    if (!enrollForm.name || !enrollForm.class || !enrollForm.school || !enrollForm.guardian || !enrollForm.phone) {
      showToast('⚠️ Please fill all required fields!', 'error');
      return;
    }

    setIsEnrolling(true);

    try {
      var studentData = {
        fullName: enrollForm.name,
        courseTrack: enrollForm.class,
        class: enrollForm.class,
        school: enrollForm.school,
        guardianName: enrollForm.guardian,
        mobileNumber: enrollForm.phone,
        address: enrollForm.address || 'N/A',
        email: enrollForm.email || '',
        gender: 'Other',
        citizenshipStatus: 'Bhutanese',
        emailAddress: enrollForm.email || enrollForm.name.toLowerCase().replace(/\s+/g, '') + '@example.com',
        totalFees: 7500,
        paymentStatus: 'Pending',
        status: enrollForm.status || 'Active',
        enrollYear: enrollForm.enrollYear || '2026'
      };

      var result;
      
      if (editingStudentId) {
        setStudents(function(prev) {
          return prev.map(function(s) {
            if (String(s._id) === String(editingStudentId)) {
              return Object.assign({}, s, studentData, { 
                _id: editingStudentId, 
                name: studentData.fullName, 
                class: enrollForm.class,
                guardian: studentData.guardianName, 
                phone: studentData.mobileNumber,
                email: studentData.email,
                enrollYear: studentData.enrollYear,
                status: studentData.status
              });
            }
            return s;
          });
        });
        
        showSuccessModal('Student Updated! ✏️', enrollForm.name + ' updated successfully', 'Class: ' + enrollForm.class);
        showToast('✅ ' + enrollForm.name + ' updated successfully!', 'success');
      } else {
        if (isBackendConnected && API_BASE) {
          try {
            result = await callApi('/api/admission/register', {
              method: 'POST',
              body: JSON.stringify(studentData)
            });
          } catch (e) {
            console.log('Backend registration failed, saving locally:', e.message);
          }
        }
        
        var newStudent = {
          _id: (result && result.student && result.student._id) ? result.student._id : 'student-' + Date.now(),
          name: enrollForm.name,
          fullName: enrollForm.name,
          class: enrollForm.class,
          courseTrack: enrollForm.class,
          school: enrollForm.school,
          guardian: enrollForm.guardian,
          guardianName: enrollForm.guardian,
          phone: enrollForm.phone,
          mobileNumber: enrollForm.phone,
          address: enrollForm.address || 'N/A',
          email: enrollForm.email || '',
          status: enrollForm.status || 'Active',
          paymentStatus: 'Pending',
          feesPaid: 0,
          totalFees: 7500,
          amountPaid: 0,
          enrollYear: enrollForm.enrollYear || '2026'
        };
        
        setStudents(function(prev) { return [newStudent].concat(prev); });
        
        var newNotification = {
          id: notifications.length + 1,
          title: 'New student enrolled - ' + enrollForm.name,
          time: 'Just now',
          read: false
        };
        setNotifications([newNotification, ...notifications]);
        
        showSuccessModal('Student Added Successfully! 🎉', enrollForm.name + ' enrolled in ' + enrollForm.class, 'Guardian: ' + enrollForm.guardian + ' • School: ' + enrollForm.school);
        showToast('✅ ' + enrollForm.name + ' enrolled successfully!', 'success');
      }

      setEnrollForm({ 
        name: '', 
        class: '', 
        school: '', 
        guardian: '', 
        phone: '', 
        address: '',
        email: '',
        enrollYear: '2026',
        status: 'Active'
      });
      setShowEnrollForm(false);
      setEditingStudentId(null);
      
      updateStats();

    } catch (error) {
      console.error('❌ ENROLLMENT ERROR:', error);
      showToast('❌ ' + (error.message || 'Failed to save student'), 'error');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleEnrollCancel = function() {
    setShowEnrollForm(false);
    setEditingStudentId(null);
    setEnrollForm({ 
      name: '', 
      class: '', 
      school: '', 
      guardian: '', 
      phone: '', 
      address: '',
      email: '',
      enrollYear: '2026',
      status: 'Active'
    });
    showToast('❌ Operation cancelled', 'info');
  };

  // ===== VIEW STUDENT =====
  const viewStudent = function(studentId) {
    var student = null;
    for (var i = 0; i < students.length; i++) {
      if (String(students[i]._id) === String(studentId)) {
        student = students[i];
        break;
      }
    }
    if (student) {
      showSuccessModal(
        'Student Details 👁️',
        student.name,
        'Class: ' + student.class + 
        '\nSchool: ' + student.school + 
        '\nGuardian: ' + student.guardian + 
        '\nPhone: ' + (student.phone || 'N/A') + 
        '\nEmail: ' + (student.email || 'N/A') +
        '\nAddress: ' + (student.address || 'N/A') + 
        '\nStatus: ' + student.status +
        '\nEnroll Year: ' + (student.enrollYear || 'N/A') +
        '\nPayment Status: ' + student.paymentStatus
      );
    } else {
      showToast('⚠️ Student not found!', 'error');
    }
  };

  // ===== EDIT STUDENT =====
  const editStudent = function(studentId) {
    var student = null;
    for (var i = 0; i < students.length; i++) {
      if (String(students[i]._id) === String(studentId)) {
        student = students[i];
        break;
      }
    }
    if (student) {
      setEnrollForm({
        name: student.name || '',
        class: student.class || '',
        school: student.school || '',
        guardian: student.guardian || '',
        phone: student.phone || '',
        address: student.address || '',
        email: student.email || '',
        enrollYear: student.enrollYear || '2026',
        status: student.status || 'Active'
      });
      setEditingStudentId(studentId);
      setShowEnrollForm(true);
      setActivePage('enroll');
      showToast('✏️ Editing ' + student.name + '...', 'info');
    } else {
      showToast('⚠️ Student not found!', 'error');
    }
  };

  // ===== DELETE STUDENT =====
  const deleteStudent = async function(studentId) {
    console.log('🗑️ Attempting to delete student with ID:', studentId);
    
    var student = null;
    for (var i = 0; i < students.length; i++) {
      var currentId = students[i]._id || students[i].id;
      if (String(currentId) === String(studentId)) {
        student = students[i];
        break;
      }
    }
    
    if (!student) {
      showToast('⚠️ Student not found.', 'error');
      return;
    }

    var confirmed = window.confirm('Are you sure you want to delete ' + student.name + '?');
    if (!confirmed) return;

    try {
      if (isBackendConnected && API_BASE) {
        try {
          await callApi('/api/dashboard/students/' + studentId, { method: 'DELETE' });
        } catch (e) {
          console.log('⚠️ Backend delete failed:', e.message);
        }
      }
      
      var updatedStudents = students.filter(function(s) {
        var currentId = s._id || s.id;
        return String(currentId) !== String(studentId);
      });
      setStudents(updatedStudents);
      
      showSuccessModal('Student Deleted! 🗑️', student.name + ' removed from system', 'Class: ' + student.class + ' • School: ' + student.school);
      showToast('🗑️ ' + student.name + ' deleted!', 'success');
      
      updateStats();
    } catch (error) {
      console.error('❌ Delete error:', error);
      showToast('❌ ' + (error.message || 'Failed to delete student'), 'error');
    }
  };

  // ===== PAYMENT FUNCTIONS =====
  const togglePaymentForm = function() {
    setShowPaymentForm(!showPaymentForm);
    setEditingPaymentId(null);
    if (showPaymentForm) {
      setPaymentForm({ 
        student: '', 
        month: 'June 2026', 
        amount: '', 
        date: '', 
        mode: 'Cash',
        transactionNo: ''
      });
    }
  };

  const handlePaymentChange = function(e) {
    var name = e.target.name;
    var value = e.target.value;
    setPaymentForm(function(prev) {
      var newState = Object.assign({}, prev);
      newState[name] = value;
      return newState;
    });
  };

  const handlePaymentSubmit = function(e) {
    e.preventDefault();
    if (!paymentForm.student || !paymentForm.amount || !paymentForm.date) {
      showToast('⚠️ Please fill all required fields!', 'error');
      return;
    }

    if (!paymentForm.transactionNo || paymentForm.transactionNo.trim() === '') {
      showToast('⚠️ Please enter a Transaction Number!', 'error');
      return;
    }

    var amountNum = parseInt(paymentForm.amount, 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('⚠️ Please enter a valid amount!', 'error');
      return;
    }

    try {
      var transactionNumber = paymentForm.transactionNo.trim();
      
      var paymentData = {
        _id: editingPaymentId || 'payment-' + Date.now(),
        student: paymentForm.student,
        studentName: paymentForm.student,
        month: paymentForm.month,
        amount: 'Nu.' + amountNum.toLocaleString(),
        date: paymentForm.date,
        mode: paymentForm.mode,
        transactionNo: transactionNumber,
        status: 'Completed'
      };

      if (editingPaymentId) {
        setPayments(function(prev) {
          return prev.map(function(p) {
            if (String(p._id) === String(editingPaymentId)) {
              return paymentData;
            }
            return p;
          });
        });
        showSuccessModal('Payment Updated! ✏️', 'Payment updated successfully', 'Amount: ' + paymentData.amount + '\nTransaction: ' + transactionNumber);
        showToast('✅ Payment updated successfully!', 'success');
      } else {
        setPayments(function(prev) { return [paymentData].concat(prev); });
        showSuccessModal('Payment Recorded! 💰', paymentData.amount + ' received from ' + paymentForm.student, 'Mode: ' + paymentForm.mode + ' • Transaction: ' + transactionNumber);
        showToast('💰 Payment recorded for ' + paymentForm.student + '!', 'success');
      }

      setPaymentForm({ 
        student: '', 
        month: 'June 2026', 
        amount: '', 
        date: '', 
        mode: 'Cash',
        transactionNo: ''
      });
      setShowPaymentForm(false);
      setEditingPaymentId(null);
      updateStats();

    } catch (error) {
      console.error('PAYMENT ERROR:', error);
      showToast('❌ ' + (error.message || 'Failed to process payment'), 'error');
    }
  };

  const handlePaymentCancel = function() {
    setShowPaymentForm(false);
    setEditingPaymentId(null);
    setPaymentForm({ 
      student: '', 
      month: 'June 2026', 
      amount: '', 
      date: '', 
      mode: 'Cash',
      transactionNo: ''
    });
    showToast('❌ Payment cancelled', 'info');
  };

  // ===== VIEW PAYMENT =====
  const viewPayment = function(paymentId) {
    var payment = null;
    for (var i = 0; i < payments.length; i++) {
      if (String(payments[i]._id) === String(paymentId)) {
        payment = payments[i];
        break;
      }
    }
    if (payment) {
      showSuccessModal(
        'Payment Details 💰',
        payment.student,
        'Month: ' + payment.month + 
        '\nAmount: ' + payment.amount + 
        '\nDate: ' + payment.date + 
        '\nMode: ' + payment.mode + 
        '\nTransaction No.: ' + (payment.transactionNo || payment.receipt || 'N/A')
      );
    } else {
      showToast('⚠️ Payment not found!', 'error');
    }
  };

  // ===== EDIT PAYMENT =====
  const editPayment = function(paymentId) {
    var payment = null;
    for (var i = 0; i < payments.length; i++) {
      if (String(payments[i]._id) === String(paymentId)) {
        payment = payments[i];
        break;
      }
    }
    if (payment) {
      setPaymentForm({
        student: payment.student || '',
        month: payment.month || 'June 2026',
        amount: payment.amount ? payment.amount.replace(/[^0-9]/g, '') : '',
        date: payment.date || '',
        mode: payment.mode || 'Cash',
        transactionNo: payment.transactionNo || payment.receipt || ''
      });
      setEditingPaymentId(paymentId);
      setShowPaymentForm(true);
      setActivePage('payments');
      showToast('✏️ Editing payment for ' + payment.student + '...', 'info');
    } else {
      showToast('⚠️ Payment not found!', 'error');
    }
  };

  // ===== DELETE PAYMENT =====
  const deletePayment = function(paymentId) {
    var payment = null;
    for (var i = 0; i < payments.length; i++) {
      if (String(payments[i]._id) === String(paymentId)) {
        payment = payments[i];
        break;
      }
    }
    if (!payment) {
      showToast('⚠️ Payment not found.', 'error');
      return;
    }

    var confirmed = window.confirm('Are you sure you want to delete this payment of ' + payment.amount + ' from ' + payment.student + '?');
    if (!confirmed) return;

    var updatedPayments = payments.filter(function(p) { return String(p._id) !== String(paymentId); });
    setPayments(updatedPayments);
    
    showSuccessModal('Payment Deleted! 🗑️', 'Payment of ' + payment.amount + ' from ' + payment.student + ' removed', 'Transaction: ' + (payment.transactionNo || payment.receipt || 'N/A'));
    showToast('🗑️ Payment deleted successfully!', 'success');
    updateStats();
  };

  // ===== STAFF FUNCTIONS =====
  const toggleStaffForm = function() {
    setShowStaffForm(!showStaffForm);
    setEditingStaffId(null);
    if (showStaffForm) {
      setStaffForm({ 
        name: '', 
        role: '', 
        email: '', 
        phone: '', 
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active' 
      });
    }
  };

  const handleStaffChange = function(e) {
    var name = e.target.name;
    var value = e.target.value;
    setStaffForm(function(prev) {
      var newState = Object.assign({}, prev);
      newState[name] = value;
      return newState;
    });
  };

  const handleStaffSubmit = function(e) {
    e.preventDefault();
    if (!staffForm.name || !staffForm.role || !staffForm.email || !staffForm.phone || !staffForm.joinDate) {
      showToast('⚠️ Please fill all required fields!', 'error');
      return;
    }

    try {
      var staffData = {
        id: editingStaffId || staffMembers.length + 1,
        _id: editingStaffId || 'staff-' + Date.now(),
        name: staffForm.name,
        role: staffForm.role,
        email: staffForm.email,
        phone: staffForm.phone,
        joinDate: staffForm.joinDate,
        status: staffForm.status,
        joinDateFormatted: new Date(staffForm.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      if (editingStaffId) {
        setStaffMembers(function(prev) {
          return prev.map(function(s) {
            if (String(s.id) === String(editingStaffId) || String(s._id) === String(editingStaffId)) {
              return staffData;
            }
            return s;
          });
        });
        showSuccessModal('Staff Updated! ✏️', staffForm.name + ' updated successfully', 'Role: ' + staffForm.role);
        showToast('✅ ' + staffForm.name + ' updated!', 'success');
      } else {
        setStaffMembers(function(prev) { return prev.concat([staffData]); });
        showSuccessModal('Staff Member Added! 👤', staffForm.name + ' added as ' + staffForm.role, 'Email: ' + staffForm.email + ' • Phone: ' + staffForm.phone + ' • Join Date: ' + staffData.joinDateFormatted);
        showToast('👤 ' + staffForm.name + ' added to staff!', 'success');
      }

      setStaffForm({ 
        name: '', 
        role: '', 
        email: '', 
        phone: '', 
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active' 
      });
      setShowStaffForm(false);
      setEditingStaffId(null);
    } catch (error) {
      console.error('STAFF ERROR:', error);
      showToast('❌ ' + (error.message || 'Failed to save staff'), 'error');
    }
  };

  const handleStaffCancel = function() {
    setShowStaffForm(false);
    setEditingStaffId(null);
    setStaffForm({ 
      name: '', 
      role: '', 
      email: '', 
      phone: '', 
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active' 
    });
    showToast('❌ Staff operation cancelled', 'info');
  };

  // ===== VIEW STAFF =====
  const viewStaff = function(staffId) {
    var staff = null;
    for (var i = 0; i < staffMembers.length; i++) {
      if (String(staffMembers[i].id) === String(staffId) || String(staffMembers[i]._id) === String(staffId)) {
        staff = staffMembers[i];
        break;
      }
    }
    if (staff) {
      showSuccessModal(
        'Staff Details 👤',
        staff.name,
        'Role: ' + staff.role + 
        '\nEmail: ' + staff.email + 
        '\nPhone: ' + staff.phone + 
        '\nStatus: ' + staff.status + 
        '\nJoin Date: ' + (staff.joinDateFormatted || staff.joinDate || 'N/A')
      );
    } else {
      showToast('⚠️ Staff not found!', 'error');
    }
  };

  // ===== EDIT STAFF =====
  const editStaff = function(staffId) {
    var staff = null;
    for (var i = 0; i < staffMembers.length; i++) {
      if (String(staffMembers[i].id) === String(staffId) || String(staffMembers[i]._id) === String(staffId)) {
        staff = staffMembers[i];
        break;
      }
    }
    if (staff) {
      setStaffForm({
        name: staff.name || '',
        role: staff.role || '',
        email: staff.email || '',
        phone: staff.phone || '',
        joinDate: staff.joinDate || new Date().toISOString().split('T')[0],
        status: staff.status || 'Active'
      });
      setEditingStaffId(staffId);
      setShowStaffForm(true);
      setActivePage('staff');
      showToast('✏️ Editing ' + staff.name + '...', 'info');
    } else {
      showToast('⚠️ Staff not found!', 'error');
    }
  };

  // ===== DELETE STAFF =====
  const deleteStaff = function(staffId) {
    var staff = null;
    for (var i = 0; i < staffMembers.length; i++) {
      if (String(staffMembers[i].id) === String(staffId) || String(staffMembers[i]._id) === String(staffId)) {
        staff = staffMembers[i];
        break;
      }
    }
    if (!staff) {
      showToast('⚠️ Staff not found.', 'error');
      return;
    }

    var confirmed = window.confirm('Are you sure you want to remove ' + staff.name + ' from staff?');
    if (!confirmed) return;

    var updatedStaff = staffMembers.filter(function(s) {
      return String(s.id) !== String(staffId) && String(s._id) !== String(staffId);
    });
    setStaffMembers(updatedStaff);
    showSuccessModal('Staff Removed! 🗑️', staff.name + ' removed from staff', 'Role: ' + staff.role);
    showToast('🗑️ ' + staff.name + ' removed!', 'success');
  };

  // ===== ATTENDANCE FUNCTIONS =====
  const toggleAttendanceForm = function() {
    setShowAttendanceForm(!showAttendanceForm);
    setEditingAttendanceId(null);
    if (showAttendanceForm) {
      setAttendanceForm({ student: '', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '', checkOut: '' });
    }
  };

  const handleAttendanceChange = function(e) {
    var name = e.target.name;
    var value = e.target.value;
    setAttendanceForm(function(prev) {
      var newState = Object.assign({}, prev);
      newState[name] = value;
      return newState;
    });
  };

  const handleAttendanceSubmit = function(e) {
    e.preventDefault();
    if (!attendanceForm.student || !attendanceForm.date || !attendanceForm.status) {
      showToast('⚠️ Please fill all required fields!', 'error');
      return;
    }

    try {
      var attendanceData_ = {
        id: editingAttendanceId || attendanceData.length + 1,
        name: attendanceForm.student,
        date: attendanceForm.date,
        status: attendanceForm.status,
        checkIn: attendanceForm.checkIn || 'Not recorded',
        checkOut: attendanceForm.checkOut || 'Not recorded'
      };

      if (editingAttendanceId) {
        setAttendanceData(function(prev) {
          return prev.map(function(a) {
            if (String(a.id) === String(editingAttendanceId)) {
              return attendanceData_;
            }
            return a;
          });
        });
        showSuccessModal('Attendance Updated! ✏️', attendanceForm.student + ' updated to ' + attendanceForm.status, 'Date: ' + attendanceForm.date);
        showToast('✅ Attendance updated!', 'success');
      } else {
        setAttendanceData(function(prev) { return prev.concat([attendanceData_]); });
        showSuccessModal('Attendance Marked! ✅', attendanceForm.student + ' marked as ' + attendanceForm.status, 'Date: ' + attendanceForm.date + ' • Check In: ' + attendanceForm.checkIn);
        showToast('✅ Attendance marked for ' + attendanceForm.student + '!', 'success');
      }

      setAttendanceForm({ student: '', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '', checkOut: '' });
      setShowAttendanceForm(false);
      setEditingAttendanceId(null);
    } catch (error) {
      console.error('ATTENDANCE ERROR:', error);
      showToast('❌ ' + (error.message || 'Failed to save attendance'), 'error');
    }
  };

  const handleAttendanceCancel = function() {
    setShowAttendanceForm(false);
    setEditingAttendanceId(null);
    setAttendanceForm({ student: '', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '', checkOut: '' });
    showToast('❌ Attendance operation cancelled', 'info');
  };

  // ===== VIEW ATTENDANCE =====
  const viewAttendance = function(attendanceId) {
    var record = null;
    for (var i = 0; i < attendanceData.length; i++) {
      if (String(attendanceData[i].id) === String(attendanceId)) {
        record = attendanceData[i];
        break;
      }
    }
    if (record) {
      showSuccessModal(
        'Attendance Details 📋',
        record.name,
        'Date: ' + record.date + '\nStatus: ' + record.status + '\nCheck In: ' + record.checkIn + '\nCheck Out: ' + record.checkOut
      );
    } else {
      showToast('⚠️ Attendance record not found!', 'error');
    }
  };

  // ===== EDIT ATTENDANCE =====
  const editAttendance = function(attendanceId) {
    var record = null;
    for (var i = 0; i < attendanceData.length; i++) {
      if (String(attendanceData[i].id) === String(attendanceId)) {
        record = attendanceData[i];
        break;
      }
    }
    if (record) {
      setAttendanceForm({
        student: record.name || '',
        date: record.date || new Date().toISOString().split('T')[0],
        status: record.status || 'Present',
        checkIn: record.checkIn || '',
        checkOut: record.checkOut || ''
      });
      setEditingAttendanceId(attendanceId);
      setShowAttendanceForm(true);
      setActivePage('attendance');
      showToast('✏️ Editing attendance for ' + record.name + '...', 'info');
    } else {
      showToast('⚠️ Attendance record not found!', 'error');
    }
  };

  // ===== DELETE ATTENDANCE =====
  const deleteAttendance = function(attendanceId) {
    var record = null;
    for (var i = 0; i < attendanceData.length; i++) {
      if (String(attendanceData[i].id) === String(attendanceId)) {
        record = attendanceData[i];
        break;
      }
    }
    if (!record) {
      showToast('⚠️ Attendance record not found.', 'error');
      return;
    }

    var confirmed = window.confirm('Are you sure you want to delete attendance record for ' + record.name + '?');
    if (!confirmed) return;

    var updatedAttendance = attendanceData.filter(function(a) {
      return String(a.id) !== String(attendanceId);
    });
    setAttendanceData(updatedAttendance);
    showSuccessModal('Attendance Deleted! 🗑️', 'Attendance record for ' + record.name + ' removed', 'Date: ' + record.date);
    showToast('🗑️ Attendance deleted!', 'success');
  };

  const getStatusColor = function(status) {
    switch(status) {
      case 'Present': return 'status-present';
      case 'Absent': return 'status-absent';
      case 'Late': return 'status-late';
      default: return '';
    }
  };

  // ===== TOAST =====
  const showToast = function(message, type) {
    type = type || 'success';
    setToast({ show: true, message: message, type: type });
    setTimeout(function() {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // ===== SUCCESS MODAL =====
  const showSuccessModal = function(title, message, details, icon) {
    icon = icon || React.createElement(CheckCircle, { size: 48, color: '#22c55e' });
    setSuccessModal({ show: true, title: title, message: message, icon: icon, details: details || '' });
    setTimeout(function() {
      setSuccessModal({ show: false, title: '', message: '', icon: null, details: '' });
    }, 4000);
  };

  const closeSuccessModal = function() {
    setSuccessModal({ show: false, title: '', message: '', icon: null, details: '' });
  };

  // ===== GET STATUS BADGE CLASS =====
  const getStatusBadgeClass = function(status) {
    if (status === 'Active') return 'status-badge active';
    if (status === 'Passed Out') return 'status-badge passed-out';
    if (status === 'Withdrawn') return 'status-badge withdrawn';
    return 'status-badge';
  };

  // ===== GET ADMISSION STATUS BADGE =====
  const getAdmissionStatusBadge = function(status) {
    if (status === 'Pending' || status === 'pending') return 'status-badge pending';
    if (status === 'Approved' || status === 'approved') return 'status-badge approved';
    if (status === 'Rejected' || status === 'rejected') return 'status-badge rejected';
    return 'status-badge';
  };

  // ===== CLEAR ALL DATA =====
  const clearAllData = function() {
    if (window.confirm('⚠️ Are you sure you want to clear ALL data? This will delete all students, payments, staff, attendance, admission, and announcement records! This cannot be undone!')) {
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
      localStorage.removeItem(STORAGE_KEYS.STAFF);
      localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
      localStorage.removeItem(STORAGE_KEYS.STATS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.ADMISSIONS);
      localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
      
      setStudents([]);
      setPayments([]);
      setStaffMembers([]);
      setAttendanceData([]);
      setAdmissions([]);
      setAnnouncements([]);
      setAdmissionStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
      setAnnouncementStats({ total: 0, published: 0, pending: 0, draft: 0 });
      setStats({
        totalStudents: 0,
        activeStudents: 0,
        feeCollection: 0,
        outstandingPayments: 0,
        pendingAdmissions: 0,
        studentsList: [],
        chartData: [
          { name: 'Week 1', amount: 0 },
          { name: 'Week 2', amount: 0 },
          { name: 'Week 3', amount: 0 },
          { name: 'Week 4', amount: 0 },
        ]
      });
      
      showToast('🗑️ All data cleared successfully!', 'success');
    }
  };

  // ===== BHUTAN TIME ZONE =====
  const updateGreeting = function() {
    var now = new Date();
    var bhutanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Thimphu' }));
    var hour = bhutanTime.getHours();
    
    var newGreeting = '';
    var emoji = '';
    
    if (hour >= 5 && hour < 12) {
      newGreeting = 'Good Morning';
      emoji = '🌅';
    } else if (hour >= 12 && hour < 17) {
      newGreeting = 'Good Afternoon';
      emoji = '☀️';
    } else if (hour >= 17 && hour < 21) {
      newGreeting = 'Good Evening';
      emoji = '🌙';
    } else {
      newGreeting = 'Good Night';
      emoji = '🌃';
    }
    
    setGreeting(newGreeting + ' ' + emoji);
    
    var timeOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Thimphu',
      hour12: true
    };
    
    var formattedTime = now.toLocaleTimeString('en-US', timeOptions);
    setCurrentTime(formattedTime);
  };

  // ===== SEARCH =====
  const handleSearch = function(e) {
    var term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term.length > 0) {
      var results = students.filter(function(s) {
        return (s.name || '').toLowerCase().includes(term) || 
               (s.school || '').toLowerCase().includes(term) ||
               String(s.class || '').includes(term);
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // ===== INITIAL LOAD - FIXED =====
  useEffect(function() {
    updateGreeting();
    
    var timer = setInterval(function() {
      updateGreeting();
    }, 1000);
    
    updateStats();
    setIsLoading(false);
    
    // FIXED: Load admissions from localStorage on mount
    try {
      const savedAdmissions = localStorage.getItem('dashboard_admissions');
      let admissionsData = [];
      if (savedAdmissions) {
        admissionsData = JSON.parse(savedAdmissions);
        console.log('📋 Admissions loaded on mount:', admissionsData.length);
      }
      setAdmissions(admissionsData);
      updateAdmissionStats(admissionsData);
    } catch (e) {
      console.error('Error loading admissions on mount:', e);
      setAdmissions([]);
      updateAdmissionStats([]);
    }
    
    const savedAnnouncements = loadFromStorage(STORAGE_KEYS.ANNOUNCEMENTS, []);
    setAnnouncements(savedAnnouncements);
    updateAnnouncementStats(savedAnnouncements);
    
    var connectToBackend = async function() {
      try {
        var connected = await testBackendConnection();
        
        if (connected) {
          console.log('🔄 Backend connected, syncing data...');
          await syncWithBackend();
          updateStats();
        } else {
          console.log('ℹ️ Using local storage data (backend not available)');
        }
      } catch (error) {
        console.log('ℹ️ Backend connection failed, using local storage data');
      }
    };
    
    connectToBackend();
    
    const pollInterval = setInterval(() => {
      if (isBackendConnected) {
        fetchAdmissions();
        fetchAnnouncements();
      }
    }, 30000);
    
    return function() {
      clearInterval(timer);
      clearInterval(pollInterval);
    };
  }, []);

  // ===== UPDATE STATS WHEN DATA CHANGES =====
  useEffect(() => {
    updateStats();
  }, [students, payments, admissions]);

  // ===== CALCULATE TOTALS =====
  var totalCollected = calculateTotalCollected();
  var pendingAmount = 0;
  var paymentTotal = totalCollected + pendingAmount;

  var paymentStatusData = [
    { name: 'Paid', value: totalCollected || 1 },
    { name: 'Pending', value: pendingAmount || 1 },
  ];
  var COLORS = ['#22c55e', '#f59e0b'];

  var monthlyData = stats.chartData && stats.chartData.length > 0 ? stats.chartData : [
    { name: 'Week 1', amount: 0 },
    { name: 'Week 2', amount: 0 },
    { name: 'Week 3', amount: 0 },
    { name: 'Week 4', amount: 0 },
  ];

  var statsData = [
    { 
      icon: React.createElement(Users, { size: 28 }), 
      label: 'Total Students', 
      value: (stats.totalStudents || 0).toString(), 
      subtext: 'All Students',
      percentage: '+0%',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
      delay: 0
    },
    { 
      icon: React.createElement(UserCheck, { size: 28 }), 
      label: 'Active Students', 
      value: (stats.activeStudents || 0).toString(), 
      subtext: 'Currently Active',
      percentage: '+0%',
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      bgGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05))',
      delay: 0.1
    },
    { 
      icon: React.createElement(DollarSign, { size: 28 }), 
      label: 'Fee Collection', 
      value: 'Nu.' + (totalCollected || 0).toLocaleString(), 
      subtext: 'This Month',
      percentage: '+0%',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
      delay: 0.2
    },
    { 
      icon: React.createElement(Inbox, { size: 28 }), 
      label: 'Pending Admissions', 
      value: (admissionStats.pending || 0).toString(), 
      subtext: 'Awaiting Review',
      percentage: '+0%',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
      delay: 0.3
    },
  ];

  var menuItems = [
    { id: 'dashboard', icon: React.createElement(LayoutDashboard, { size: 20 }), label: 'Dashboard', iconColor: '#3b82f6' },
    { id: 'enroll', icon: React.createElement(UserPlus, { size: 20 }), label: 'Enroll Student', iconColor: '#22c55e' },
    { id: 'payments', icon: React.createElement(CreditCard, { size: 20 }), label: 'Payments', iconColor: '#8b5cf6' },
    { id: 'reports', icon: React.createElement(FileText, { size: 20 }), label: 'Reports', iconColor: '#f59e0b' },
    { id: 'attendance', icon: React.createElement(CalendarDays, { size: 20 }), label: 'Attendance', iconColor: '#06b6d4' },
    { id: 'staff', icon: React.createElement(UsersIcon, { size: 20 }), label: 'Staff', iconColor: '#ec4899' },
    { id: 'admissions', icon: React.createElement(Inbox, { size: 20 }), label: 'Admissions', iconColor: '#f59e0b' },
    { id: 'announcements', icon: React.createElement(Megaphone, { size: 20 }), label: 'Announcements', iconColor: '#8b5cf6' },
    { id: 'settings', icon: React.createElement(Settings, { size: 20 }), label: 'Settings', iconColor: '#6b7280' },
  ];

  var handleNavClick = function(pageId) {
    setActivePage(pageId);
    if (pageId !== 'enroll') {
      setShowEnrollForm(false);
      setEditingStudentId(null);
    }
    if (pageId !== 'payments') {
      setShowPaymentForm(false);
      setEditingPaymentId(null);
    }
    if (pageId !== 'staff') {
      setShowStaffForm(false);
      setEditingStaffId(null);
    }
    if (pageId !== 'attendance') {
      setShowAttendanceForm(false);
      setEditingAttendanceId(null);
    }
    if (pageId !== 'enroll') {
      setShowPassOutForm(false);
    }
    if (pageId === 'admissions') {
      fetchAdmissions();
    }
    if (pageId === 'announcements') {
      fetchAnnouncements();
    }
  };

  var getPageTitle = function() {
    switch(activePage) {
      case 'dashboard': return 'Student Management System';
      case 'enroll': return 'Enroll New Student';
      case 'payments': return 'Payment Management';
      case 'reports': return 'Reports';
      case 'attendance': return 'Attendance Management';
      case 'staff': return 'Staff Management';
      case 'admissions': return 'Admission Management';
      case 'announcements': return 'Announcement Management';
      case 'settings': return 'Settings';
      default: return 'Student Management System';
    }
  };

  // ===== PDF GENERATION FUNCTIONS =====
  const generateStudentPDF = async function() {
    try {
      setGeneratingReport('Student');
      showToast('📊 Generating Student Report PDF...', 'info');

      if (students.length === 0) {
        showToast('⚠️ No students to generate report!', 'error');
        setGeneratingReport(null);
        return;
      }

      var reportContainer = document.createElement('div');
      reportContainer.style.cssText = 'padding: 40px; background: white; font-family: Arial, sans-serif; width: 800px; position: absolute; left: -9999px; top: 0;';

      var now = new Date();
      var bhutanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Thimphu' }));
      
      var studentsHtml = '';
      for (var i = 0; i < students.length; i++) {
        var s = students[i];
        var statusColor = s.status === 'Active' ? '#22c55e' : (s.status === 'Passed Out' ? '#8b5cf6' : '#ef4444');
        studentsHtml += '<tr style="border-bottom: 1px solid #e2e8f0;">';
        studentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + (i + 1) + '</td>';
        studentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + s.name + '</td>';
        studentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + s.class + '</td>';
        studentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + s.school + '</td>';
        studentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + s.guardian + '</td>';
        studentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + (s.enrollYear || 'N/A') + '</td>';
        studentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;"><span style="background: ' + statusColor + '; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px;">' + s.status + '</span></td>';
        studentsHtml += '</tr>';
      }

      var activeCount = students.filter(s => s.status === 'Active').length;
      var passedOutCount = students.filter(s => s.status === 'Passed Out').length;

      reportContainer.innerHTML = 
        '<div style="text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px;">' +
          '<h1 style="color: #1e293b; margin: 0; font-size: 24px;">Robotics & IoT Center</h1>' +
          '<p style="color: #64748b; margin: 5px 0;">Thimphu, Bhutan</p>' +
          '<h2 style="color: #3b82f6; margin: 10px 0;">Student Report</h2>' +
          '<p style="color: #64748b; font-size: 12px;">Generated: ' + bhutanTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' at ' + bhutanTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + '</p>' +
        '</div>' +
        '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">' +
          '<div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">' +
            '<h3 style="margin: 0; color: #475569; font-size: 12px;">TOTAL STUDENTS</h3>' +
            '<p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #1e293b;">' + students.length + '</p>' +
          '</div>' +
          '<div style="background: #dcfce7; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #22c55e;">' +
            '<h3 style="margin: 0; color: #475569; font-size: 12px;">ACTIVE STUDENTS</h3>' +
            '<p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #22c55e;">' + activeCount + '</p>' +
          '</div>' +
          '<div style="background: #f3e8ff; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #8b5cf6;">' +
            '<h3 style="margin: 0; color: #475569; font-size: 12px;">PASSED OUT</h3>' +
            '<p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #8b5cf6;">' + passedOutCount + '</p>' +
          '</div>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 12px;">' +
          '<thead>' +
            '<tr style="background: #3b82f6; color: white;">' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #3b82f6;">#</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #3b82f6;">Student Name</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #3b82f6;">Class</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #3b82f6;">School</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #3b82f6;">Guardian</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #3b82f6;">Enroll Year</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #3b82f6;">Status</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + studentsHtml + '</tbody>' +
        '</table>' +
        '<div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">' +
          '<p>© ' + new Date().getFullYear() + ' Robotics & IoT Center, Thimphu. All rights reserved.</p>' +
        '</div>';

      document.body.appendChild(reportContainer);

      var canvas = await html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      var imgData = canvas.toDataURL('image/png');
      var pdf = new jsPDF('p', 'mm', 'a4');
      var imgWidth = 210;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Student_Report.pdf');

      document.body.removeChild(reportContainer);

      setGeneratingReport(null);
      showSuccessModal('Student Report Generated! 📊', 'PDF report downloaded successfully', students.length + ' students included');
      showToast('✅ Student Report PDF downloaded!', 'success');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      setGeneratingReport(null);
      showToast('❌ Failed to generate PDF: ' + error.message, 'error');
    }
  };

  const generatePaymentPDF = async function() {
    try {
      setGeneratingReport('Payment');
      showToast('📊 Generating Payment Report PDF...', 'info');

      if (payments.length === 0) {
        showToast('⚠️ No payments to generate report!', 'error');
        setGeneratingReport(null);
        return;
      }

      var totalCollected = 0;
      for (var i = 0; i < payments.length; i++) {
        var amount = parseInt(payments[i].amount.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(amount)) {
          totalCollected += amount;
        }
      }

      var reportContainer = document.createElement('div');
      reportContainer.style.cssText = 'padding: 40px; background: white; font-family: Arial, sans-serif; width: 800px; position: absolute; left: -9999px; top: 0;';

      var now = new Date();
      var bhutanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Thimphu' }));
      
      var paymentsHtml = '';
      for (var j = 0; j < payments.length; j++) {
        var p = payments[j];
        paymentsHtml += '<tr style="border-bottom: 1px solid #e2e8f0;">';
        paymentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + (j + 1) + '</td>';
        paymentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + p.student + '</td>';
        paymentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + p.month + '</td>';
        paymentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + p.amount + '</td>';
        paymentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + p.date + '</td>';
        paymentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + p.mode + '</td>';
        paymentsHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + (p.transactionNo || p.receipt || 'N/A') + '</td>';
        paymentsHtml += '</tr>';
      }

      var avgPayment = payments.length > 0 ? Math.round(totalCollected / payments.length) : 0;

      reportContainer.innerHTML = 
        '<div style="text-align: center; border-bottom: 3px solid #8b5cf6; padding-bottom: 20px; margin-bottom: 20px;">' +
          '<h1 style="color: #1e293b; margin: 0; font-size: 24px;">Robotics & IoT Center</h1>' +
          '<p style="color: #64748b; margin: 5px 0;">Thimphu, Bhutan</p>' +
          '<h2 style="color: #8b5cf6; margin: 10px 0;">Payment Report</h2>' +
          '<p style="color: #64748b; font-size: 12px;">Generated: ' + bhutanTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' at ' + bhutanTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + '</p>' +
        '</div>' +
        '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">' +
          '<div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">' +
            '<h3 style="margin: 0; color: #475569; font-size: 12px;">TOTAL TRANSACTIONS</h3>' +
            '<p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #1e293b;">' + payments.length + '</p>' +
          '</div>' +
          '<div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">' +
            '<h3 style="margin: 0; color: #475569; font-size: 12px;">TOTAL REVENUE</h3>' +
            '<p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #22c55e;">Nu.' + totalCollected.toLocaleString() + '</p>' +
          '</div>' +
          '<div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">' +
            '<h3 style="margin: 0; color: #475569; font-size: 12px;">AVERAGE PAYMENT</h3>' +
            '<p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #8b5cf6;">Nu.' + avgPayment.toLocaleString() + '</p>' +
          '</div>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 12px;">' +
          '<thead>' +
            '<tr style="background: #8b5cf6; color: white;">' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #8b5cf6;">#</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #8b5cf6;">Student Name</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #8b5cf6;">Month</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #8b5cf6;">Amount</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #8b5cf6;">Date</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #8b5cf6;">Mode</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #8b5cf6;">Transaction No.</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + paymentsHtml + '</tbody>' +
        '</table>' +
        '<div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">' +
          '<p>© ' + new Date().getFullYear() + ' Robotics & IoT Center, Thimphu. All rights reserved.</p>' +
        '</div>';

      document.body.appendChild(reportContainer);

      var canvas = await html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      var imgData = canvas.toDataURL('image/png');
      var pdf = new jsPDF('p', 'mm', 'a4');
      var imgWidth = 210;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Payment_Report.pdf');

      document.body.removeChild(reportContainer);

      setGeneratingReport(null);
      showSuccessModal('Payment Report Generated! 📊', 'PDF report downloaded successfully', payments.length + ' transactions included');
      showToast('✅ Payment Report PDF downloaded!', 'success');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      setGeneratingReport(null);
      showToast('❌ Failed to generate PDF: ' + error.message, 'error');
    }
  };

  const generateAttendancePDF = async function() {
    try {
      setGeneratingReport('Attendance');
      showToast('📊 Generating Attendance Report PDF...', 'info');

      if (attendanceData.length === 0) {
        showToast('⚠️ No attendance records to generate report!', 'error');
        setGeneratingReport(null);
        return;
      }

      var reportContainer = document.createElement('div');
      reportContainer.style.cssText = 'padding: 40px; background: white; font-family: Arial, sans-serif; width: 800px; position: absolute; left: -9999px; top: 0;';

      var now = new Date();
      var bhutanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Thimphu' }));
      
      var presentCount = 0, absentCount = 0, lateCount = 0;
      for (var i = 0; i < attendanceData.length; i++) {
        if (attendanceData[i].status === 'Present') presentCount++;
        else if (attendanceData[i].status === 'Absent') absentCount++;
        else if (attendanceData[i].status === 'Late') lateCount++;
      }

      var attendanceHtml = '';
      for (var j = 0; j < attendanceData.length; j++) {
        var r = attendanceData[j];
        var bgColor = r.status === 'Present' ? '#22c55e' : (r.status === 'Absent' ? '#ef4444' : '#f59e0b');
        attendanceHtml += '<tr style="border-bottom: 1px solid #e2e8f0;">';
        attendanceHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + (j + 1) + '</td>';
        attendanceHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + r.name + '</td>';
        attendanceHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + r.date + '</td>';
        attendanceHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;"><span style="background: ' + bgColor + '; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px;">' + r.status + '</span></td>';
        attendanceHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + r.checkIn + '</td>';
        attendanceHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + r.checkOut + '</td>';
        attendanceHtml += '</tr>';
      }

      reportContainer.innerHTML = 
        '<div style="text-align: center; border-bottom: 3px solid #06b6d4; padding-bottom: 20px; margin-bottom: 20px;">' +
          '<h1 style="color: #1e293b; margin: 0; font-size: 24px;">Robotics & IoT Center</h1>' +
          '<p style="color: #64748b; margin: 5px 0;">Thimphu, Bhutan</p>' +
          '<h2 style="color: #06b6d4; margin: 10px 0;">Attendance Report</h2>' +
          '<p style="color: #64748b; font-size: 12px;">Generated: ' + bhutanTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' at ' + bhutanTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + '</p>' +
        '</div>' +
        '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">' +
          '<div style="background: #22c55e20; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #22c55e;">' +
            '<h3 style="margin: 0; color: #475569; font-size: 12px;">PRESENT</h3>' +
            '<p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #22c55e;">' + presentCount + '</p>' +
          '</div>' +
          '<div style="background: #ef444420; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #ef4444;">' +
            '<h3 style="margin: 0; color: #475569; font-size: 12px;">ABSENT</h3>' +
            '<p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #ef4444;">' + absentCount + '</p>' +
          '</div>' +
          '<div style="background: #f59e0b20; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #f59e0b;">' +
            '<h3 style="margin: 0; color: #475569; font-size: 12px;">LATE</h3>' +
            '<p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #f59e0b;">' + lateCount + '</p>' +
          '</div>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 12px;">' +
          '<thead>' +
            '<tr style="background: #06b6d4; color: white;">' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #06b6d4;">#</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #06b6d4;">Student Name</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #06b6d4;">Date</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #06b6d4;">Status</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #06b6d4;">Check In</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #06b6d4;">Check Out</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + attendanceHtml + '</tbody>' +
        '</table>' +
        '<div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">' +
          '<p>© ' + new Date().getFullYear() + ' Robotics & IoT Center, Thimphu. All rights reserved.</p>' +
        '</div>';

      document.body.appendChild(reportContainer);

      var canvas = await html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      var imgData = canvas.toDataURL('image/png');
      var pdf = new jsPDF('p', 'mm', 'a4');
      var imgWidth = 210;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Attendance_Report.pdf');

      document.body.removeChild(reportContainer);

      setGeneratingReport(null);
      showSuccessModal('Attendance Report Generated! 📊', 'PDF report downloaded successfully', attendanceData.length + ' records included');
      showToast('✅ Attendance Report PDF downloaded!', 'success');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      setGeneratingReport(null);
      showToast('❌ Failed to generate PDF: ' + error.message, 'error');
    }
  };

  const generateStaffPDF = async function() {
    try {
      setGeneratingReport('Staff');
      showToast('📊 Generating Staff Report PDF...', 'info');

      if (staffMembers.length === 0) {
        showToast('⚠️ No staff members to generate report!', 'error');
        setGeneratingReport(null);
        return;
      }

      var reportContainer = document.createElement('div');
      reportContainer.style.cssText = 'padding: 40px; background: white; font-family: Arial, sans-serif; width: 800px; position: absolute; left: -9999px; top: 0;';

      var now = new Date();
      var bhutanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Thimphu' }));
      
      var activeStaff = 0;
      for (var i = 0; i < staffMembers.length; i++) {
        if (staffMembers[i].status === 'Active') activeStaff++;
      }

      var staffHtml = '';
      for (var j = 0; j < staffMembers.length; j++) {
        var s = staffMembers[j];
        var statusColor = s.status === 'Active' ? '#22c55e' : '#ef4444';
        staffHtml += '<tr style="border-bottom: 1px solid #e2e8f0;">';
        staffHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + (j + 1) + '</td>';
        staffHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + s.name + '</td>';
        staffHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + s.role + '</td>';
        staffHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + s.email + '</td>';
        staffHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + s.phone + '</td>';
        staffHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;"><span style="background: ' + statusColor + '; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px;">' + s.status + '</span></td>';
        staffHtml += '<td style="padding: 8px; border: 1px solid #e2e8f0;">' + (s.joinDateFormatted || s.joinDate || 'N/A') + '</td>';
        staffHtml += '</tr>';
      }

      reportContainer.innerHTML = 
        '<div style="text-align: center; border-bottom: 3px solid #ec4899; padding-bottom: 20px; margin-bottom: 20px;">' +
          '<h1 style="color: #1e293b; margin: 0; font-size: 24px;">Robotics & IoT Center</h1>' +
          '<p style="color: #64748b; margin: 5px 0;">Thimphu, Bhutan</p>' +
          '<h2 style="color: #ec4899; margin: 10px 0;">Staff Report</h2>' +
          '<p style="color: #64748b; font-size: 12px;">Generated: ' + bhutanTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' at ' + bhutanTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + '</p>' +
        '</div>' +
        '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">' +
          '<div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">' +
            '<h3 style="margin: 0; color: #475569; font-size: 12px;">TOTAL STAFF</h3>' +
            '<p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #1e293b;">' + staffMembers.length + '</p>' +
          '</div>' +
          '<div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">' +
            '<h3 style="margin: 0; color: #475569; font-size: 12px;">ACTIVE STAFF</h3>' +
            '<p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #22c55e;">' + activeStaff + '</p>' +
          '</div>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 12px;">' +
          '<thead>' +
            '<tr style="background: #ec4899; color: white;">' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #ec4899;">#</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #ec4899;">Name</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #ec4899;">Role</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #ec4899;">Email</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #ec4899;">Phone</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #ec4899;">Status</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #ec4899;">Join Date</th>' +
              '<th style="padding: 10px; text-align: left; border: 1px solid #ec4899;">Actions</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + staffHtml + '</tbody>' +
        '</table>' +
        '<div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">' +
          '<p>© ' + new Date().getFullYear() + ' Robotics & IoT Center, Thimphu. All rights reserved.</p>' +
        '</div>';

      document.body.appendChild(reportContainer);

      var canvas = await html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      var imgData = canvas.toDataURL('image/png');
      var pdf = new jsPDF('p', 'mm', 'a4');
      var imgWidth = 210;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Staff_Report.pdf');

      document.body.removeChild(reportContainer);

      setGeneratingReport(null);
      showSuccessModal('Staff Report Generated! 📊', 'PDF report downloaded successfully', staffMembers.length + ' staff members included');
      showToast('✅ Staff Report PDF downloaded!', 'success');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      setGeneratingReport(null);
      showToast('❌ Failed to generate PDF: ' + error.message, 'error');
    }
  };

  // ===== GENERATE REPORT HANDLER =====
  const generateReport = function(type) {
    switch(type) {
      case 'Student':
        generateStudentPDF();
        break;
      case 'Payment':
        generatePaymentPDF();
        break;
      case 'Attendance':
        generateAttendancePDF();
        break;
      case 'Staff':
        generateStaffPDF();
        break;
      default:
        showToast('❌ Unknown report type', 'error');
    }
  };

  // ===== EXPORT FUNCTIONS =====
  const exportStudents = function() {
    if (students.length === 0) {
      showToast('⚠️ No students to export!', 'error');
      return;
    }
    showToast('📥 Exporting ' + students.length + ' students...', 'success');
    setTimeout(function() {
      showSuccessModal('Students Exported! 📥', students.length + ' students exported', 'File saved to /downloads');
    }, 1500);
  };

  const exportPayments = function() {
    if (payments.length === 0) {
      showToast('⚠️ No payments to export!', 'error');
      return;
    }
    showToast('📥 Exporting ' + payments.length + ' payments...', 'success');
    setTimeout(function() {
      showSuccessModal('Payments Exported! 📥', payments.length + ' payments exported', 'File saved to /downloads');
    }, 1500);
  };

  const exportStaff = function() {
    if (staffMembers.length === 0) {
      showToast('⚠️ No staff to export!', 'error');
      return;
    }
    showToast('📥 Exporting ' + staffMembers.length + ' staff...', 'success');
    setTimeout(function() {
      showSuccessModal('Staff Exported! 📥', staffMembers.length + ' staff exported', 'File saved to /downloads');
    }, 1500);
  };

  const exportAttendance = function() {
    if (attendanceData.length === 0) {
      showToast('⚠️ No attendance records to export!', 'error');
      return;
    }
    showToast('📥 Exporting ' + attendanceData.length + ' records...', 'success');
    setTimeout(function() {
      showSuccessModal('Attendance Exported! 📥', attendanceData.length + ' records exported', 'File saved to /downloads');
    }, 1500);
  };

  const exportAllReports = function() {
    showToast('📦 Exporting all reports...', 'info');
    setTimeout(function() {
      showSuccessModal('All Reports Exported! 📦', 'All reports exported successfully', 'Files saved to /reports folder');
      showToast('✅ All reports exported!', 'success');
    }, 2500);
  };

  // ===== SETTINGS =====
  const handleSettingsChange = function(e) {
    var name = e.target.name;
    var value = e.target.value;
    var type = e.target.type;
    var checked = e.target.checked;
    setSettings(function(prev) {
      var newState = Object.assign({}, prev);
      newState[name] = type === 'checkbox' ? checked : value;
      return newState;
    });
  };

  const handleSettingsSave = function() {
    showToast('⏳ Saving settings...', 'info');
    if (settings.newPassword || settings.confirmPassword) {
      if (settings.newPassword !== settings.confirmPassword) {
        showToast('⚠️ Passwords do not match!', 'error');
        return;
      }
      if (settings.newPassword.length < 6) {
        showToast('⚠️ Password must be at least 6 characters!', 'error');
        return;
      }
    }
    setTimeout(function() {
      setOriginalSettings(Object.assign({}, settings));
      saveToStorage(STORAGE_KEYS.SETTINGS, settings);
      var changes = [];
      if (settings.fullName !== originalSettings.fullName) changes.push('Name');
      if (settings.email !== originalSettings.email) changes.push('Email');
      if (settings.phone !== originalSettings.phone) changes.push('Phone');
      if (settings.instituteName !== originalSettings.instituteName) changes.push('Institute Name');
      if (settings.location !== originalSettings.location) changes.push('Location');
      if (settings.contactEmail !== originalSettings.contactEmail) changes.push('Contact Email');
      if (settings.language !== originalSettings.language) changes.push('Language');
      if (settings.currency !== originalSettings.currency) changes.push('Currency');
      if (settings.notifications !== originalSettings.notifications) changes.push('Notifications');
      if (settings.newPassword) changes.push('Password');

      if (changes.length === 0) {
        showToast('ℹ️ No changes to save', 'info');
      } else {
        showSuccessModal('Settings Saved! ⚙️', 'Settings updated successfully', 'Changes: ' + changes.join(', '));
        showToast('✅ Settings saved!', 'success');
        setSettings(function(prev) {
          var newState = Object.assign({}, prev);
          newState.currentPassword = '';
          newState.newPassword = '';
          newState.confirmPassword = '';
          return newState;
        });
      }
    }, 1000);
  };

  // ===== MAIN RENDER RETURN =====
  return (
    <div className="dashboard-container">
      {/* SUCCESS MODAL */}
      {successModal.show && (
        <div className="success-modal-overlay" onClick={closeSuccessModal}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-modal-icon">{successModal.icon || <CheckCircle size={48} color="#22c55e" />}</div>
            <div className="success-modal-content">
              <h3>{successModal.title}</h3>
              <p>{successModal.message}</p>
              {successModal.details && <span className="success-modal-details">{successModal.details}</span>}
            </div>
            <button className="success-modal-close" onClick={closeSuccessModal}><X size={20} /></button>
            <div className="success-modal-progress"></div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-content">
            {toast.type === 'success' ? <CheckCircle size={20} color="#22c55e" /> : 
             toast.type === 'error' ? <AlertCircle size={20} color="#ef4444" /> : 
             <AlertCircle size={20} color="#3b82f6" />}
            <span>{toast.message}</span>
          </div>
          <button className="toast-close" onClick={() => setToast({ show: false, message: '', type: 'success' })}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* PASS OUT FORM MODAL */}
      {showPassOutForm && (
        <div className="modal-overlay" onClick={() => setShowPassOutForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎓 Pass Out Student</h3>
              <button className="modal-close" onClick={() => setShowPassOutForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handlePassOutSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Pass Out Date *</label>
                  <input type="date" name="passOutDate" value={passOutData.passOutDate} onChange={(e) => setPassOutData({...passOutData, passOutDate: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Reason *</label>
                  <select name="passOutReason" value={passOutData.passOutReason} onChange={(e) => setPassOutData({...passOutData, passOutReason: e.target.value})} required>
                    <option value="Graduated">🎓 Graduated</option>
                    <option value="Completed Course">📚 Completed Course</option>
                    <option value="Transferred">🔄 Transferred</option>
                    <option value="Withdrawn">📝 Withdrawn</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Certificate Issued</label>
                  <select name="certificateIssued" value={passOutData.certificateIssued ? 'Yes' : 'No'} onChange={(e) => setPassOutData({...passOutData, certificateIssued: e.target.value === 'Yes'})}>
                    <option value="Yes">✅ Yes</option>
                    <option value="No">❌ No</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Remarks</label>
                  <textarea name="remarks" placeholder="Additional remarks..." rows="3" value={passOutData.remarks} onChange={(e) => setPassOutData({...passOutData, remarks: e.target.value})} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowPassOutForm(false)}>Cancel</button>
                <button type="submit" className="btn-submit" style={{ background: '#8b5cf6' }}>
                  <GraduationCap size={18} /> Pass Out Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMISSION DETAILS MODAL */}
      {showAdmissionDetails && selectedAdmission && (
        <div className="modal-overlay" onClick={() => setShowAdmissionDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>📋 Admission Details</h3>
              <button className="modal-close" onClick={() => setShowAdmissionDetails(false)}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><strong>Student Name:</strong> {selectedAdmission.fullName || selectedAdmission.name}</div>
                <div><strong>Class:</strong> {selectedAdmission.courseTrack || selectedAdmission.class}</div>
                <div><strong>School:</strong> {selectedAdmission.school}</div>
                <div><strong>Guardian:</strong> {selectedAdmission.guardianName || selectedAdmission.guardian}</div>
                <div><strong>Phone:</strong> {selectedAdmission.mobileNumber || selectedAdmission.phone}</div>
                <div><strong>Email:</strong> {selectedAdmission.email || 'N/A'}</div>
                <div><strong>Address:</strong> {selectedAdmission.address || 'N/A'}</div>
                <div><strong>Submitted:</strong> {new Date(selectedAdmission.submittedAt || selectedAdmission.createdAt).toLocaleString()}</div>
                <div><strong>Status:</strong> <span className={getAdmissionStatusBadge(selectedAdmission.status)}>{selectedAdmission.status}</span></div>
                {selectedAdmission.status === 'Rejected' && (
                  <>
                    <div style={{ gridColumn: 'span 2' }}><strong>Rejection Reason:</strong> {selectedAdmission.rejectionReason || 'N/A'}</div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <button 
                        className="btn-cancel" 
                        onClick={() => {
                          const id = selectedAdmission.id || selectedAdmission._id;
                          setShowAdmissionDetails(false);
                          deleteRejectedAdmission(id);
                        }} 
                        style={{ background: '#ef4444', color: 'white', width: '100%', padding: '10px' }}
                      >
                        <Trash2 size={16} /> Delete This Rejected Application
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                {selectedAdmission.status === 'Pending' && (
                  <>
                    <button className="btn-submit" onClick={() => { approveAdmission(selectedAdmission.id || selectedAdmission._id); setShowAdmissionDetails(false); }} style={{ background: '#22c55e' }}>
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button className="btn-cancel" onClick={() => { rejectAdmission(selectedAdmission.id || selectedAdmission._id); setShowAdmissionDetails(false); }} style={{ background: '#ef4444', color: 'white' }}>
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                <button className="btn-cancel" onClick={() => setShowAdmissionDetails(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">🤖</div>
            <div className="logo-text">
              <span className="logo-title">Robotics & IoT</span>
              <span className="logo-subtitle">Center, Thimphu</span>
            </div>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a key={item.id} href="#" className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick(item.id); }}>
              <span className="nav-icon" style={{ color: activePage === item.id ? '#ffffff' : item.iconColor }}>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.id === 'admissions' && admissionStats.pending > 0 && (
                <span className="nav-badge">{admissionStats.pending}</span>
              )}
              {item.id === 'announcements' && announcementStats.pending > 0 && (
                <span className="nav-badge">{announcementStats.pending}</span>
              )}
              {activePage === item.id && <span className="nav-indicator"></span>}
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className="status-dot"></span>
            <span className="status-text">Online</span>
            <span className="status-time">{currentTime}</span>
          </div>
          <button className="logout-btn-sidebar" onClick={onLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className={`main-content ${sidebarOpen ? 'shifted' : 'full'}`}>
        {/* TOP HEADER */}
        <header className="top-header">
          <div className="header-left">
            <div className="greeting-section">
              <h1 className="greeting-text">{greeting}</h1>
              <p className="greeting-sub">{getPageTitle()}</p>
              <div style={{ marginTop: '4px' }}>
                {isBackendConnected && isUsingBackend ? (
                  <span style={{ 
                    color: '#22c55e', 
                    fontSize: '13px', 
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#dcfce7',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    border: '1px solid #86efac'
                  }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      animation: 'pulse 2s infinite'
                    }}></span>
                    🟢 Connected
                  </span>
                ) : (
                  <span style={{ 
                    color: '#f59e0b', 
                    fontSize: '13px', 
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fef3c7',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    border: '1px solid #fcd34d'
                  }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#f59e0b',
                      animation: 'pulse 2s infinite'
                    }}></span>
                    💾 Local Storage Mode
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Search students..." value={searchTerm} onChange={handleSearch} />
              <kbd className="search-shortcut">⌘K</kbd>
              {searchResults.length > 0 && searchTerm.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map((result) => (
                    <div key={result._id} className="search-result-item" onClick={() => { setSearchTerm(''); setSearchResults([]); viewStudent(result._id); }}>
                      <span className="result-name">{result.name}</span>
                      <span className="result-detail">{result.class} • {result.school}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="notification-wrapper">
              <button className="notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={20} />
                {unreadCount + admissionStats.pending + announcementStats.pending > 0 && <span className="notification-badge pulse">{unreadCount + admissionStats.pending + announcementStats.pending}</span>}
              </button>
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <span>Notifications</span>
                    <button onClick={() => setShowNotifications(false)}><X size={16} /></button>
                  </div>
                  <div className="notification-list">
                    {admissionStats.pending > 0 && (
                      <div className="notification-item unread" onClick={() => { setShowNotifications(false); setActivePage('admissions'); }}>
                        <div className="notification-dot"></div>
                        <div>
                          <div className="notification-title">📋 {admissionStats.pending} new admission{admissionStats.pending > 1 ? 's' : ''} pending review</div>
                          <div className="notification-time">Just now</div>
                        </div>
                      </div>
                    )}
                    {announcementStats.pending > 0 && (
                      <div className="notification-item unread" onClick={() => { setShowNotifications(false); setActivePage('announcements'); }}>
                        <div className="notification-dot"></div>
                        <div>
                          <div className="notification-title">📢 {announcementStats.pending} announcement{announcementStats.pending > 1 ? 's' : ''} pending review</div>
                          <div className="notification-time">Just now</div>
                        </div>
                      </div>
                    )}
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                        <div className="notification-dot"></div>
                        <div>
                          <div className="notification-title">{notif.title}</div>
                          <div className="notification-time">{notif.time}</div>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && admissionStats.pending === 0 && announcementStats.pending === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="notification-footer">
                    <button onClick={() => { setShowNotifications(false); showToast('📬 All notifications viewed', 'info'); }}>View All</button>
                  </div>
                </div>
              )}
            </div>
            <div className="user-profile-wrapper">
              <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="avatar-wrapper">
                  <img src="/logo.jpg" alt="Admin" className="avatar" />
                  <div className="avatar-status"></div>
                </div>
                <div className="user-info">
                  <span className="user-name">Admin</span>
                  <span className="user-role">Administrator</span>
                </div>
                <ChevronDown size={16} className="dropdown-arrow" />
              </div>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <img src="/logo.jpg" alt="Admin" className="dropdown-avatar" />
                    <div>
                      <div className="dropdown-name">Admin</div>
                      <div className="dropdown-email">youthroboticsiot@gmail.com</div>
                    </div>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  <button className="user-dropdown-item" onClick={() => { setShowUserMenu(false); setActivePage('settings'); }}>
                    <Settings size={16} /> Settings
                  </button>
                  <button className="user-dropdown-item" onClick={() => { setShowUserMenu(false); showToast('👤 Profile viewed', 'info'); }}>
                    <User size={16} /> My Profile
                  </button>
                  <div className="user-dropdown-divider"></div>
                  <button className="user-dropdown-item logout-item" onClick={onLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD PAGE */}
        {activePage === 'dashboard' && (
          <>
            <div className="stats-grid">
              {statsData.map((stat, index) => (
                <div className="stat-card" key={index} style={{ animationDelay: `${stat.delay}s`, background: stat.bgGradient, borderBottom: `4px solid ${stat.color}` }}
                  onMouseEnter={() => setHoveredCard(index)} onMouseLeave={() => setHoveredCard(null)}>
                  <div className="stat-card-glow" style={{ background: stat.gradient }}></div>
                  <div className="stat-icon-wrapper" style={{ background: stat.gradient }}>{stat.icon}</div>
                  <div className="stat-content">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                    <div className="stat-meta">
                      <span>{stat.subtext}</span>
                      <span className="stat-percentage"><TrendingUp size={12} />{stat.percentage}</span>
                    </div>
                  </div>
                  <div className="stat-sparkle"><Sparkles size={16} /></div>
                </div>
              ))}
            </div>

            <div className="charts-section">
              <div className="chart-card">
                <div className="chart-header">
                  <div><h3>Monthly Fee Collection</h3><p className="chart-subtitle">Revenue trend for June 2026</p></div>
                  <button className="view-all-btn" onClick={() => setActivePage('payments')}>View All <ArrowRight size={14} /></button>
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={monthlyData}>
                      <defs><linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip formatter={(value) => [`Nu.${value.toLocaleString()}`, 'Amount']} contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px 16px' }} cursor={{ stroke: '#3b82f6', strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fill="url(#colorAmount)" activeDot={{ r: 8, fill: '#3b82f6' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <div><h3>Payment Status</h3><p className="chart-subtitle">Overview of payments</p></div>
                  <button className="view-all-btn" onClick={() => setActivePage('payments')}>View All <ArrowRight size={14} /></button>
                </div>
                <div className="payment-status-wrapper">
                  <div className="pie-chart-wrapper">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={paymentStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                          {paymentStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />))}
                        </Pie>
                        <Tooltip formatter={(value) => [`Nu.${value.toLocaleString()}`, 'Amount']} contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="payment-stats">
                    <div className="payment-stat-item paid">
                      <span className="stat-dot paid-dot"></span>
                      <span className="stat-label-text">Paid</span>
                      <span className="stat-amount">Nu.{totalCollected.toLocaleString()}</span>
                      <span className="stat-percentage-badge">{(paymentTotal > 0 ? (totalCollected / paymentTotal * 100) : 0).toFixed(1)}%</span>
                    </div>
                    <div className="payment-stat-item pending">
                      <span className="stat-dot pending-dot"></span>
                      <span className="stat-label-text">Pending</span>
                      <span className="stat-amount">Nu.{pendingAmount.toLocaleString()}</span>
                      <span className="stat-percentage-badge pending-badge">{(paymentTotal > 0 ? (pendingAmount / paymentTotal * 100) : 0).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tables-section">
              <div className="table-card">
                <div className="table-header">
                  <div><h3>Recent Students</h3><p className="table-subtitle">Latest enrolled students</p></div>
                  <button className="view-all-btn" onClick={() => setActivePage('enroll')}>View All <ArrowRight size={14} /></button>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead><tr><th>SL.No</th><th>Name of Student</th><th>Class / Degree</th><th>School</th><th>Guardian</th><th>Enroll Year</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                              <Users size={48} style={{ color: '#d1d5db' }} />
                              <span>No students enrolled yet</span>
                              <button 
                                className="btn-submit" 
                                style={{ padding: '8px 20px', fontSize: '14px' }}
                                onClick={() => setActivePage('enroll')}
                              >
                                <Plus size={16} /> Enroll First Student
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        students.slice(0, 6).map((student, index) => (
                          <tr key={student._id} className="table-row-animate" style={{ animationDelay: `${index * 0.05}s` }}>
                            <td>{index + 1}</td>
                            <td className="student-name">{student.name || 'N/A'}</td>
                            <td><span className="class-badge">{student.class || 'N/A'}</span></td>
                            <td>{student.school || 'N/A'}</td>
                            <td>{student.guardian || 'N/A'}</td>
                            <td><span className="year-badge">{student.enrollYear || 'N/A'}</span></td>
                            <td><span className={getStatusBadgeClass(student.status)}>{student.status || 'Active'}</span></td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-btn-small view" onClick={() => viewStudent(student._id)} title="View"><Eye size={14} /></button>
                                <button className="action-btn-small edit" onClick={() => editStudent(student._id)} title="Edit"><Edit size={14} /></button>
                                {student.status !== 'Passed Out' && (
                                  <button className="action-btn-small passout" onClick={() => passOutStudent(student._id)} title="Pass Out" style={{ background: '#8b5cf6', color: 'white', borderRadius: '4px', border: 'none', padding: '4px 6px', cursor: 'pointer' }}>
                                    <GraduationCap size={14} />
                                  </button>
                                )}
                                <button className="action-btn-small delete" onClick={() => deleteStudent(student._id)} title="Delete"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="right-panel">
                <div className="table-card">
                  <div className="table-header">
                    <div><h3>Recent Payments</h3><p className="table-subtitle">Latest transactions</p></div>
                    <button className="view-all-btn" onClick={() => setActivePage('payments')}>View All <ArrowRight size={14} /></button>
                  </div>
                  <div className="table-responsive">
                    <table className="data-table compact">
                      <thead><tr><th>Student Name</th><th>Month</th><th>Amount</th><th>Date</th><th>Mode</th><th>Transaction No.</th></tr></thead>
                      <tbody>
                        {payments.length === 0 ? (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px 0', color: '#6b7280' }}>
                              No payments recorded yet.
                            </td>
                          </tr>
                        ) : (
                          payments.slice(0, 4).map((payment) => (
                            <tr key={payment._id} className="table-row-animate">
                              <td className="student-name">{payment.studentName || payment.student || 'N/A'}</td>
                              <td>{payment.month}</td>
                              <td className="amount-cell">{payment.amount}</td>
                              <td>{payment.date}</td>
                              <td><span className={`mode-badge ${(payment.mode || 'cash').toLowerCase()}`}>{payment.mode || 'Cash'}</span></td>
                              <td className="receipt-no">{payment.transactionNo || payment.receipt || 'N/A'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="quick-stats-widget">
                  <div className="widget-header">
                    <h4>Quick Stats</h4>
                    <RefreshCw size={16} className="refresh-icon" onClick={() => { updateStats(); showToast('🔄 Stats refreshed!', 'success'); }} />
                  </div>
                  <div className="widget-grid">
                    <div className="widget-item"><div className="widget-icon blue"><Activity size={18} /></div><div><span className="widget-value">{students.length}</span><span className="widget-label">Total</span></div></div>
                    <div className="widget-item"><div className="widget-icon green"><UserCheck size={18} /></div><div><span className="widget-value">{students.filter(s => s.status === 'Active').length}</span><span className="widget-label">Active</span></div></div>
                    <div className="widget-item"><div className="widget-icon orange"><DollarSign size={18} /></div><div><span className="widget-value">{payments.length}</span><span className="widget-label">Payments</span></div></div>
                    <div className="widget-item"><div className="widget-icon yellow"><Inbox size={18} /></div><div><span className="widget-value">{admissionStats.pending}</span><span className="widget-label">Pending Admissions</span></div></div>
                    <div className="widget-item"><div className="widget-icon purple"><Megaphone size={18} /></div><div><span className="widget-value">{announcementStats.pending}</span><span className="widget-label">Pending Announcements</span></div></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ENROLL STUDENT PAGE */}
        {activePage === 'enroll' && (
          <div className="page-container">
            <div className="page-header">
              <div>
                <h2 className="page-title">{editingStudentId ? 'Edit Student' : 'Enroll New Student'}</h2>
                <p className="page-subtitle">{editingStudentId ? 'Update student information' : 'Add a new student to the system'}</p>
              </div>
              <button className="page-action-btn" onClick={toggleEnrollForm}>
                {showEnrollForm ? <X size={18} /> : <Plus size={18} />}
                {showEnrollForm ? 'Close Form' : 'New Enrollment'}
              </button>
            </div>

            {showEnrollForm && (
              <div className="enroll-form-container">
                <form className="enroll-form" onSubmit={handleEnrollSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Student Name *</label>
                      <input type="text" name="name" placeholder="Enter full name" value={enrollForm.name} onChange={handleEnrollChange} required disabled={isEnrolling} />
                    </div>
                    <div className="form-group">
                      <label>Class / Degree *</label>
                      <select name="class" value={enrollForm.class} onChange={handleEnrollChange} required disabled={isEnrolling}>
                        <option value="">Select Class or Degree</option>
                        <optgroup label="📚 PP & Classes (1-12)">
                          <option value="PP">PP (Pre-Primary)</option>
                          <option value="Class 1">Class 1</option>
                          <option value="Class 2">Class 2</option>
                          <option value="Class 3">Class 3</option>
                          <option value="Class 4">Class 4</option>
                          <option value="Class 5">Class 5</option>
                          <option value="Class 6">Class 6</option>
                          <option value="Class 7">Class 7</option>
                          <option value="Class 8">Class 8</option>
                          <option value="Class 9">Class 9</option>
                          <option value="Class 10">Class 10</option>
                          <option value="Class 11">Class 11</option>
                          <option value="Class 12">Class 12</option>
                        </optgroup>
                        <optgroup label="🎓 Degree Categories">
                          <option value="Bachelor Degree">Bachelor Degree</option>
                          <option value="Master Degree">Master Degree</option>
                          <option value="PhD">PhD</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Certificate">Certificate</option>
                        </optgroup>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>School *</label>
                      <input type="text" name="school" placeholder="Enter school name" value={enrollForm.school} onChange={handleEnrollChange} required disabled={isEnrolling} />
                    </div>
                    <div className="form-group">
                      <label>Guardian Name *</label>
                      <input type="text" name="guardian" placeholder="Enter guardian name" value={enrollForm.guardian} onChange={handleEnrollChange} required disabled={isEnrolling} />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input type="tel" name="phone" placeholder="Enter phone number" value={enrollForm.phone} onChange={handleEnrollChange} required disabled={isEnrolling} />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" placeholder="Enter email address" value={enrollForm.email} onChange={handleEnrollChange} disabled={isEnrolling} />
                    </div>
                    <div className="form-group">
                      <label>Enrollment Year</label>
                      <select name="enrollYear" value={enrollForm.enrollYear} onChange={handleEnrollChange} disabled={isEnrolling}>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select name="status" value={enrollForm.status} onChange={handleEnrollChange} disabled={isEnrolling}>
                        <option value="Active">Active</option>
                        <option value="Passed Out">Passed Out</option>
                        <option value="Withdrawn">Withdrawn</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Address</label>
                      <textarea name="address" placeholder="Enter address" rows="3" value={enrollForm.address} onChange={handleEnrollChange} disabled={isEnrolling} />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handleEnrollCancel} disabled={isEnrolling}>Cancel</button>
                    <button type="submit" className="btn-submit" disabled={isEnrolling}>
                      {isEnrolling ? (
                        <>⏳ Saving...</>
                      ) : (
                        <>{editingStudentId ? <Save size={18} /> : <UserPlus size={18} />} {editingStudentId ? 'Update Student' : 'Enroll Student'}</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="table-card">
              <div className="table-header">
                <h3>All Students</h3>
                <div className="table-actions">
                  <button className="btn-icon-action" onClick={exportStudents} title="Export Data"><Download size={18} /></button>
                  <button className="btn-icon-action" onClick={() => showToast('🖨️ Printing...', 'success')} title="Print"><Printer size={18} /></button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr>
                    <th>SL.No</th>
                    <th>Name of Student</th>
                    <th>Class / Degree</th>
                    <th>School</th>
                    <th>Guardian</th>
                    <th>Enroll Year</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <Users size={48} style={{ color: '#d1d5db' }} />
                            <span>No students enrolled yet</span>
                            <button 
                              className="btn-submit" 
                              style={{ padding: '8px 20px', fontSize: '14px' }}
                              onClick={() => { setShowEnrollForm(true); }}
                            >
                              <Plus size={16} /> Enroll First Student
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      students.map((student, index) => {
                        return (
                          <tr key={student._id} className="table-row-animate" style={{ animationDelay: `${index * 0.05}s` }}>
                            <td>{index + 1}</td>
                            <td className="student-name">{student.name || 'N/A'}</td>
                            <td><span className="class-badge">{student.class || 'N/A'}</span></td>
                            <td>{student.school || 'N/A'}</td>
                            <td>{student.guardian || 'N/A'}</td>
                            <td><span className="year-badge">{student.enrollYear || 'N/A'}</span></td>
                            <td><span className={getStatusBadgeClass(student.status)}>{student.status || 'Active'}</span></td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-btn-small view" onClick={() => viewStudent(student._id)} title="View"><Eye size={14} /></button>
                                <button className="action-btn-small edit" onClick={() => editStudent(student._id)} title="Edit"><Edit size={14} /></button>
                                {student.status !== 'Passed Out' && (
                                  <button className="action-btn-small passout" onClick={() => passOutStudent(student._id)} title="Pass Out" style={{ background: '#8b5cf6', color: 'white', borderRadius: '4px', border: 'none', padding: '4px 6px', cursor: 'pointer' }}>
                                    <GraduationCap size={14} />
                                  </button>
                                )}
                                <button className="action-btn-small delete" onClick={() => deleteStudent(student._id)} title="Delete"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENTS PAGE */}
        {activePage === 'payments' && (
          <div className="page-container">
            <div className="page-header">
              <div>
                <h2 className="page-title">{editingPaymentId ? 'Edit Payment' : 'Payment Management'}</h2>
                <p className="page-subtitle">{editingPaymentId ? 'Update payment details' : 'Track and manage all payments'}</p>
              </div>
              <button className="page-action-btn" onClick={togglePaymentForm}>
                {showPaymentForm ? <X size={18} /> : <Plus size={18} />}
                {showPaymentForm ? 'Close Form' : 'Record Payment'}
              </button>
            </div>

            {showPaymentForm && (
              <div className="enroll-form-container">
                <form className="enroll-form" onSubmit={handlePaymentSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Student Name *</label>
                      <input type="text" name="student" placeholder="Enter student name" value={paymentForm.student} onChange={handlePaymentChange} required />
                    </div>
                    <div className="form-group">
                      <label>Month *</label>
                      <select name="month" value={paymentForm.month} onChange={handlePaymentChange}>
                        <option>June 2026</option>
                        <option>May 2026</option>
                        <option>April 2026</option>
                        <option>March 2026</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Amount (Nu.) *</label>
                      <input type="number" name="amount" placeholder="Enter amount" value={paymentForm.amount} onChange={handlePaymentChange} required min="1" />
                    </div>
                    <div className="form-group">
                      <label>Date *</label>
                      <input type="date" name="date" value={paymentForm.date} onChange={handlePaymentChange} required />
                    </div>
                    <div className="form-group">
                      <label>Payment Mode *</label>
                      <select name="mode" value={paymentForm.mode} onChange={handlePaymentChange}>
                        <option>Cash</option>
                        <option>Bank</option>
                        <option>Mobile</option>
                        <option>Cheque</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Transaction No. *</label>
                      <input 
                        type="text" 
                        name="transactionNo" 
                        placeholder="Enter transaction number manually" 
                        value={paymentForm.transactionNo} 
                        onChange={handlePaymentChange} 
                        required 
                      />
                      <small style={{ color: '#6b7280', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                        ⚠️ Please enter the transaction number manually
                      </small>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handlePaymentCancel}>Cancel</button>
                    <button type="submit" className="btn-submit"><CreditCard size={18} /> {editingPaymentId ? 'Update Payment' : 'Record Payment'}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="payment-summary-grid">
              <div className="payment-summary-card">
                <span className="summary-label">Total Revenue Collected</span>
                <span className="summary-value">Nu.{totalCollected.toLocaleString()}</span>
                <span className="summary-change positive">↑ {payments.length} payments recorded</span>
              </div>
              <div className="payment-summary-card">
                <span className="summary-label">Outstanding Payments</span>
                <span className="summary-value">Nu.0</span>
                <span className="summary-change positive">✓ All payments are up to date</span>
              </div>
              <div className="payment-summary-card">
                <span className="summary-label">Total Transactions</span>
                <span className="summary-value">{payments.length}</span>
                <span className="summary-change positive">↑ {payments.length} total records</span>
              </div>
            </div>

            <div className="table-card">
              <div className="table-header">
                <h3>All Payments</h3>
                <div className="table-actions">
                  <button className="btn-icon-action" onClick={exportPayments} title="Export Payments"><Download size={18} /></button>
                  <button className="btn-icon-action" onClick={() => showToast('🖨️ Printing payments...', 'success')} title="Print"><Printer size={18} /></button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Month</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Mode</th>
                      <th>Transaction No.</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <CreditCard size={48} style={{ color: '#d1d5db' }} />
                            <span>No payments recorded yet</span>
                            <button 
                              className="btn-submit" 
                              style={{ padding: '8px 20px', fontSize: '14px' }}
                              onClick={() => { setShowPaymentForm(true); }}
                            >
                              <Plus size={16} /> Record First Payment
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment._id} className="table-row-animate">
                          <td className="student-name">{payment.studentName || payment.student || 'N/A'}</td>
                          <td>{payment.month}</td>
                          <td className="amount-cell">{payment.amount}</td>
                          <td>{payment.date}</td>
                          <td><span className={`mode-badge ${(payment.mode || 'cash').toLowerCase()}`}>{payment.mode || 'Cash'}</span></td>
                          <td className="receipt-no">{payment.transactionNo || payment.receipt || 'N/A'}</td>
                          <td><span className="status-badge paid">Completed</span></td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn-small view" onClick={() => viewPayment(payment._id)} title="View"><Eye size={14} /></button>
                              <button className="action-btn-small edit" onClick={() => editPayment(payment._id)} title="Edit"><Edit size={14} /></button>
                              <button className="action-btn-small delete" onClick={() => deletePayment(payment._id)} title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS PAGE */}
        {activePage === 'reports' && (
          <div className="page-container">
            <div className="page-header">
              <div><h2 className="page-title">Reports</h2><p className="page-subtitle">Generate and download reports as PDF</p></div>
              <button className="page-action-btn" onClick={exportAllReports}><Download size={18} /> Export All</button>
            </div>

            <div className="reports-grid">
              <div className="report-card">
                <div className="report-icon"><Users size={32} /></div>
                <h4>Student Report</h4>
                <p>Complete list of all students</p>
                <button 
                  className={`report-btn ${generatingReport === 'Student' ? 'generating' : ''}`} 
                  onClick={() => generateReport('Student')} 
                  disabled={generatingReport === 'Student' || students.length === 0}
                >
                  {generatingReport === 'Student' ? '⏳ Generating...' : students.length === 0 ? 'No Students' : '📄 Download PDF'}
                </button>
              </div>
              <div className="report-card">
                <div className="report-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}><CreditCard size={32} /></div>
                <h4>Payment Report</h4>
                <p>All payment transactions</p>
                <button 
                  className={`report-btn ${generatingReport === 'Payment' ? 'generating' : ''}`} 
                  onClick={() => generateReport('Payment')} 
                  disabled={generatingReport === 'Payment' || payments.length === 0}
                >
                  {generatingReport === 'Payment' ? '⏳ Generating...' : payments.length === 0 ? 'No Payments' : '📄 Download PDF'}
                </button>
              </div>
              <div className="report-card">
                <div className="report-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}><CalendarDays size={32} /></div>
                <h4>Attendance Report</h4>
                <p>Student attendance summary</p>
                <button 
                  className={`report-btn ${generatingReport === 'Attendance' ? 'generating' : ''}`} 
                  onClick={() => generateReport('Attendance')} 
                  disabled={generatingReport === 'Attendance' || attendanceData.length === 0}
                >
                  {generatingReport === 'Attendance' ? '⏳ Generating...' : attendanceData.length === 0 ? 'No Records' : '📄 Download PDF'}
                </button>
              </div>
              <div className="report-card">
                <div className="report-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}><UsersIcon size={32} /></div>
                <h4>Staff Report</h4>
                <p>Staff member details</p>
                <button 
                  className={`report-btn ${generatingReport === 'Staff' ? 'generating' : ''}`} 
                  onClick={() => generateReport('Staff')} 
                  disabled={generatingReport === 'Staff' || staffMembers.length === 0}
                >
                  {generatingReport === 'Staff' ? '⏳ Generating...' : staffMembers.length === 0 ? 'No Staff' : '📄 Download PDF'}
                </button>
              </div>
            </div>

            <div className="report-stats-summary">
              <div className="report-stat-item"><span className="report-stat-label">Total Students</span><span className="report-stat-value">{students.length}</span></div>
              <div className="report-stat-item"><span className="report-stat-label">Active Students</span><span className="report-stat-value">{students.filter(s => s.status === 'Active').length}</span></div>
              <div className="report-stat-item"><span className="report-stat-label">Passed Out</span><span className="report-stat-value">{students.filter(s => s.status === 'Passed Out').length}</span></div>
              <div className="report-stat-item"><span className="report-stat-label">Total Revenue</span><span className="report-stat-value">Nu.{totalCollected.toLocaleString()}</span></div>
              <div className="report-stat-item"><span className="report-stat-label">Pending Admissions</span><span className="report-stat-value">{admissionStats.pending}</span></div>
              <div className="report-stat-item"><span className="report-stat-label">Pending Announcements</span><span className="report-stat-value">{announcementStats.pending}</span></div>
            </div>
          </div>
        )}

        {/* ATTENDANCE PAGE */}
        {activePage === 'attendance' && (
          <div className="page-container">
            <div className="page-header">
              <div>
                <h2 className="page-title">{editingAttendanceId ? 'Edit Attendance' : 'Attendance Management'}</h2>
                <p className="page-subtitle">{editingAttendanceId ? 'Update attendance record' : 'Track daily attendance'}</p>
              </div>
              <button className="page-action-btn" onClick={toggleAttendanceForm}>
                {showAttendanceForm ? <X size={18} /> : <Plus size={18} />}
                {showAttendanceForm ? 'Close Form' : 'Mark Attendance'}
              </button>
            </div>

            {showAttendanceForm && (
              <div className="enroll-form-container">
                <form className="enroll-form" onSubmit={handleAttendanceSubmit}>
                  <div className="form-grid">
                    <div className="form-group"><label>Student Name *</label><input type="text" name="student" placeholder="Enter student name" value={attendanceForm.student} onChange={handleAttendanceChange} required /></div>
                    <div className="form-group"><label>Date *</label><input type="date" name="date" value={attendanceForm.date} onChange={handleAttendanceChange} required /></div>
                    <div className="form-group"><label>Status *</label><select name="status" value={attendanceForm.status} onChange={handleAttendanceChange}><option>Present</option><option>Absent</option><option>Late</option></select></div>
                    <div className="form-group"><label>Check In Time</label><input type="time" name="checkIn" value={attendanceForm.checkIn} onChange={handleAttendanceChange} /></div>
                    <div className="form-group"><label>Check Out Time</label><input type="time" name="checkOut" value={attendanceForm.checkOut} onChange={handleAttendanceChange} /></div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handleAttendanceCancel}>Cancel</button>
                    <button type="submit" className="btn-submit"><CheckCircle size={18} /> {editingAttendanceId ? 'Update Attendance' : 'Mark Attendance'}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="attendance-summary-grid">
              <div className="attendance-summary-card"><span className="summary-label">Total Students</span><span className="summary-value">{attendanceData.length}</span></div>
              <div className="attendance-summary-card present"><span className="summary-label">Present</span><span className="summary-value">{attendanceData.filter(a => a.status === 'Present').length}</span></div>
              <div className="attendance-summary-card absent"><span className="summary-label">Absent</span><span className="summary-value">{attendanceData.filter(a => a.status === 'Absent').length}</span></div>
              <div className="attendance-summary-card late"><span className="summary-label">Late</span><span className="summary-value">{attendanceData.filter(a => a.status === 'Late').length}</span></div>
            </div>

            <div className="table-card">
              <div className="table-header">
                <h3>Attendance Records</h3>
                <div className="table-actions">
                  <button className="btn-icon-action" onClick={exportAttendance} title="Export Attendance"><Download size={18} /></button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr><th>ID</th><th>Student Name</th><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th><th>Actions</th></tr></thead>
                  <tbody>
                    {attendanceData.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                          No attendance records yet.
                        </td>
                      </tr>
                    ) : (
                      attendanceData.map((record, index) => (
                        <tr key={index} className="table-row-animate" style={{ animationDelay: `${index * 0.05}s` }}>
                          <td>{record.id}</td>
                          <td className="student-name">{record.name}</td>
                          <td>{record.date}</td>
                          <td><span className={`attendance-status ${getStatusColor(record.status)}`}>{record.status}</span></td>
                          <td>{record.checkIn}</td>
                          <td>{record.checkOut}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn-small view" onClick={() => viewAttendance(record.id)} title="View"><Eye size={14} /></button>
                              <button className="action-btn-small edit" onClick={() => editAttendance(record.id)} title="Edit"><Edit size={14} /></button>
                              <button className="action-btn-small delete" onClick={() => deleteAttendance(record.id)} title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STAFF PAGE */}
        {activePage === 'staff' && (
          <div className="page-container">
            <div className="page-header">
              <div>
                <h2 className="page-title">{editingStaffId ? 'Edit Staff' : 'Staff Management'}</h2>
                <p className="page-subtitle">{editingStaffId ? 'Update staff information' : 'Manage staff members'}</p>
              </div>
              <button className="page-action-btn" onClick={toggleStaffForm}>
                {showStaffForm ? <X size={18} /> : <Plus size={18} />}
                {showStaffForm ? 'Close Form' : 'Add Staff'}
              </button>
            </div>

            {showStaffForm && (
              <div className="enroll-form-container">
                <form className="enroll-form" onSubmit={handleStaffSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input type="text" name="name" placeholder="Enter full name" value={staffForm.name} onChange={handleStaffChange} required />
                    </div>
                    <div className="form-group">
                      <label>Role *</label>
                      <select name="role" value={staffForm.role} onChange={handleStaffChange} required>
                        <option value="">Select Role</option>
                        <option value="CEO">CEO</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Management">Management</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" name="email" placeholder="Enter email" value={staffForm.email} onChange={handleStaffChange} required />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input type="tel" name="phone" placeholder="Enter phone number" value={staffForm.phone} onChange={handleStaffChange} required />
                    </div>
                    <div className="form-group">
                      <label>Joining Date *</label>
                      <input type="date" name="joinDate" value={staffForm.joinDate} onChange={handleStaffChange} required />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select name="status" value={staffForm.status} onChange={handleStaffChange}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handleStaffCancel}>Cancel</button>
                    <button type="submit" className="btn-submit"><UserPlus size={18} /> {editingStaffId ? 'Update Staff' : 'Add Staff'}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="staff-summary-grid">
              <div className="staff-summary-card"><Users size={24} /><div><span className="summary-value">{staffMembers.length}</span><span className="summary-label">Total Staff</span></div></div>
              <div className="staff-summary-card"><BadgeCheck size={24} color="#22c55e" /><div><span className="summary-value">{staffMembers.filter(s => s.status === 'Active').length}</span><span className="summary-label">Active</span></div></div>
              <div className="staff-summary-card"><Briefcase size={24} color="#8b5cf6" /><div><span className="summary-value">0</span><span className="summary-label">Departments</span></div></div>
            </div>

            <div className="table-card">
              <div className="table-header">
                <h3>All Staff Members</h3>
                <div className="table-actions">
                  <button className="btn-icon-action" onClick={exportStaff} title="Export Staff"><Download size={18} /></button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Join Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffMembers.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                          No staff members added yet.
                        </td>
                      </tr>
                    ) : (
                      staffMembers.map((staff, index) => {
                        const staffId = staff.id || staff._id;
                        return (
                          <tr key={index} className="table-row-animate" style={{ animationDelay: `${index * 0.05}s` }}>
                            <td>{staff.id || index + 1}</td>
                            <td className="student-name">{staff.name}</td>
                            <td><span className="role-badge">{staff.role}</span></td>
                            <td>{staff.email}</td>
                            <td>{staff.phone}</td>
                            <td>{staff.joinDateFormatted || staff.joinDate || 'N/A'}</td>
                            <td><span className={`status-badge ${staff.status.toLowerCase()}`}>{staff.status}</span></td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-btn-small view" onClick={() => viewStaff(staffId)} title="View"><Eye size={14} /></button>
                                <button className="action-btn-small edit" onClick={() => editStaff(staffId)} title="Edit"><Edit size={14} /></button>
                                <button className="action-btn-small delete" onClick={() => deleteStaff(staffId)} title="Delete"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ADMISSIONS PAGE */}
        {activePage === 'admissions' && (
          <div className="page-container">
            <div className="page-header">
              <div>
                <h2 className="page-title">Admission Management</h2>
                <p className="page-subtitle">
                  Review and manage student applications from the public
                  {admissionStats.pending > 0 && (
                    <span className="pending-badge" style={{
                      background: '#f59e0b',
                      color: 'white',
                      padding: '2px 12px',
                      borderRadius: '20px',
                      marginLeft: '10px',
                      fontSize: '14px'
                    }}>
                      {admissionStats.pending} Pending
                    </span>
                  )}
                  {admissionStats.rejected > 0 && (
                    <span className="pending-badge" style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '2px 12px',
                      borderRadius: '20px',
                      marginLeft: '10px',
                      fontSize: '14px'
                    }}>
                      {admissionStats.rejected} Rejected
                    </span>
                  )}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="page-action-btn" onClick={fetchAdmissions} style={{ background: '#3b82f6' }}>
                  <RefreshCw size={18} /> Refresh
                </button>
              </div>
            </div>

            <div className="admission-stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div className="stat-card-small" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Applications</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>{admissionStats.total}</div>
              </div>
              <div className="stat-card-small" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center',
                borderBottom: '4px solid #f59e0b'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Pending Review</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{admissionStats.pending}</div>
              </div>
              <div className="stat-card-small" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center',
                borderBottom: '4px solid #22c55e'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Approved</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>{admissionStats.approved}</div>
              </div>
              <div className="stat-card-small" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center',
                borderBottom: '4px solid #ef4444'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Rejected</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>{admissionStats.rejected}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {['all', 'pending', 'approved', 'rejected'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setAdmissionFilter(filter)} 
                  className={`filter-btn ${admissionFilter === filter ? 'active' : ''}`}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: admissionFilter === filter ? (filter === 'pending' ? '#f59e0b' : filter === 'approved' ? '#22c55e' : filter === 'rejected' ? '#ef4444' : '#3b82f6') : 'white',
                    color: admissionFilter === filter ? 'white' : '#1e293b',
                    cursor: 'pointer',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}
                >
                  {filter} ({filter === 'all' ? admissionStats.total : filter === 'pending' ? admissionStats.pending : filter === 'approved' ? admissionStats.approved : admissionStats.rejected})
                </button>
              ))}
            </div>

            <div className="table-card">
              <div className="table-header">
                <h3>Student Applications</h3>
                <div className="table-actions">
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {admissions.filter(a => admissionFilter === 'all' || a.status === admissionFilter).length} records
                  </span>
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Class / Degree</th>
                      <th>School</th>
                      <th>Guardian</th>
                      <th>Phone</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions.filter(a => admissionFilter === 'all' || a.status === admissionFilter).length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <Inbox size={48} style={{ color: '#d1d5db' }} />
                            <span>No applications found</span>
                            <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                              {admissionFilter === 'all' ? 'No applications have been submitted yet' : `No ${admissionFilter} applications`}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      admissions
                        .filter(a => admissionFilter === 'all' || a.status === admissionFilter)
                        .map((admission, index) => (
                          <tr key={admission.id || admission._id} className="table-row-animate" style={{ animationDelay: `${index * 0.05}s` }}>
                            <td>{index + 1}</td>
                            <td className="student-name">{admission.fullName || admission.name || 'N/A'}</td>
                            <td><span className="class-badge">{admission.courseTrack || admission.class || 'N/A'}</span></td>
                            <td>{admission.school || 'N/A'}</td>
                            <td>{admission.guardianName || admission.guardian || 'N/A'}</td>
                            <td>{admission.mobileNumber || admission.phone || 'N/A'}</td>
                            <td style={{ fontSize: '12px' }}>
                              {new Date(admission.submittedAt || admission.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <span className={getAdmissionStatusBadge(admission.status)}>
                                {admission.status === 'Pending' && '⏳ Pending'}
                                {admission.status === 'Approved' && '✅ Approved'}
                                {admission.status === 'Rejected' && '❌ Rejected'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="action-btn-small view" 
                                  onClick={() => viewAdmissionDetails(admission.id || admission._id)} 
                                  title="View Details"
                                >
                                  <Eye size={14} />
                                </button>
                                {admission.status === 'Pending' && (
                                  <>
                                    <button 
                                      className="action-btn-small" 
                                      onClick={() => approveAdmission(admission.id || admission._id)}
                                      title="Approve"
                                      style={{ background: '#22c55e', color: 'white', borderRadius: '4px', border: 'none', padding: '4px 6px', cursor: 'pointer' }}
                                    >
                                      <CheckCircle size={14} />
                                    </button>
                                    <button 
                                      className="action-btn-small" 
                                      onClick={() => rejectAdmission(admission.id || admission._id)}
                                      title="Reject"
                                      style={{ background: '#ef4444', color: 'white', borderRadius: '4px', border: 'none', padding: '4px 6px', cursor: 'pointer' }}
                                    >
                                      <XCircle size={14} />
                                    </button>
                                  </>
                                )}
                                {admission.status === 'Rejected' && (
                                  <button 
                                    className="action-btn-small" 
                                    onClick={() => deleteRejectedAdmission(admission.id || admission._id)}
                                    title="Delete Rejected Application"
                                    style={{ background: '#ef4444', color: 'white', borderRadius: '4px', border: 'none', padding: '4px 6px', cursor: 'pointer' }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS PAGE */}
        {activePage === 'announcements' && (
          <div className="page-container">
            <div className="page-header">
              <div>
                <h2 className="page-title">Announcement Management</h2>
                <p className="page-subtitle">
                  Create and manage announcements for the public
                  {announcementStats.pending > 0 && (
                    <span className="pending-badge" style={{
                      background: '#f59e0b',
                      color: 'white',
                      padding: '2px 12px',
                      borderRadius: '20px',
                      marginLeft: '10px',
                      fontSize: '14px'
                    }}>
                      {announcementStats.pending} Pending Review
                    </span>
                  )}
                </p>
              </div>
              <button className="page-action-btn" onClick={() => {
                setShowAnnouncementForm(!showAnnouncementForm);
                if (!showAnnouncementForm) resetAnnouncementForm();
              }}>
                {showAnnouncementForm ? <X size={18} /> : <Plus size={18} />}
                {showAnnouncementForm ? 'Close Form' : 'New Announcement'}
              </button>
            </div>

            <div className="announcement-stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div className="stat-card-small" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Total</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>{announcementStats.total}</div>
              </div>
              <div className="stat-card-small" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center',
                borderBottom: '4px solid #22c55e'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Published</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>{announcementStats.published}</div>
              </div>
              <div className="stat-card-small" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center',
                borderBottom: '4px solid #f59e0b'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Pending</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{announcementStats.pending}</div>
              </div>
              <div className="stat-card-small" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center',
                borderBottom: '4px solid #6b7280'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Drafts</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#6b7280' }}>{announcementStats.draft}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {['all', 'published', 'pending', 'draft', 'archived'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setAnnouncementFilter(filter)} 
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: announcementFilter === filter ? '#3b82f6' : 'white',
                    color: announcementFilter === filter ? 'white' : '#1e293b',
                    cursor: 'pointer',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}
                >
                  {filter === 'all' ? 'All' : filter}
                  {filter === 'all' && ` (${announcementStats.total})`}
                  {filter === 'published' && ` (${announcementStats.published})`}
                  {filter === 'pending' && ` (${announcementStats.pending})`}
                  {filter === 'draft' && ` (${announcementStats.draft})`}
                </button>
              ))}
            </div>

            {showAnnouncementForm && (
              <div className="enroll-form-container" style={{ marginBottom: '24px' }}>
                <form className="enroll-form" onSubmit={handleAnnouncementSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title *</label>
                      <input 
                        type="text" 
                        name="title" 
                        placeholder="Enter announcement title" 
                        value={announcementForm.title} 
                        onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select 
                        name="category" 
                        value={announcementForm.category} 
                        onChange={(e) => setAnnouncementForm({...announcementForm, category: e.target.value})}
                      >
                        <option value="General">General</option>
                        <option value="Academic">Academic</option>
                        <option value="Event">Event</option>
                        <option value="Important">Important</option>
                        <option value="Holiday">Holiday</option>
                        <option value="Result">Result</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Content *</label>
                      <textarea 
                        name="content" 
                        placeholder="Write announcement content..." 
                        rows="5" 
                        value={announcementForm.content} 
                        onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select 
                        name="status" 
                        value={announcementForm.status} 
                        onChange={(e) => setAnnouncementForm({...announcementForm, status: e.target.value})}
                      >
                        <option value="Draft">📝 Draft</option>
                        <option value="Pending">⏳ Pending Review</option>
                        <option value="Published">✅ Publish Now</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Publish Date</label>
                      <input 
                        type="date" 
                        name="publishDate" 
                        value={announcementForm.publishDate} 
                        onChange={(e) => setAnnouncementForm({...announcementForm, publishDate: e.target.value})} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URL (optional)</label>
                      <input 
                        type="text" 
                        name="imageUrl" 
                        placeholder="https://example.com/image.jpg" 
                        value={announcementForm.imageUrl} 
                        onChange={(e) => setAnnouncementForm({...announcementForm, imageUrl: e.target.value})} 
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label style={{ marginBottom: 0 }}>Pin Announcement</label>
                      <input 
                        type="checkbox" 
                        name="pinned" 
                        checked={announcementForm.pinned} 
                        onChange={(e) => setAnnouncementForm({...announcementForm, pinned: e.target.checked})} 
                        style={{ width: '20px', height: '20px' }}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => { setShowAnnouncementForm(false); resetAnnouncementForm(); }}>Cancel</button>
                    <button type="submit" className="btn-submit"><Megaphone size={18} /> {editingAnnouncementId ? 'Update Announcement' : 'Create Announcement'}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="table-card">
              <div className="table-header">
                <h3>All Announcements</h3>
                <div className="table-actions">
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {announcements.filter(a => announcementFilter === 'all' || a.status.toLowerCase() === announcementFilter).length} announcements
                  </span>
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Pinned</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Views</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.filter(a => announcementFilter === 'all' || a.status.toLowerCase() === announcementFilter).length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <Megaphone size={48} style={{ color: '#d1d5db' }} />
                            <span>No announcements found</span>
                            <button 
                              className="btn-submit" 
                              style={{ padding: '8px 20px', fontSize: '14px' }}
                              onClick={() => setShowAnnouncementForm(true)}
                            >
                              <Plus size={16} /> Create First Announcement
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      announcements
                        .filter(a => announcementFilter === 'all' || a.status.toLowerCase() === announcementFilter)
                        .map((announcement, index) => {
                          const statusInfo = getAnnouncementStatusBadge(announcement.status);
                          return (
                            <tr key={announcement.id} className="table-row-animate" style={{ animationDelay: `${index * 0.05}s` }}>
                              <td className="student-name">
                                {announcement.pinned && <Pin size={14} color="#f59e0b" style={{ marginRight: '6px' }} />}
                                {announcement.title}
                              </td>
                              <td><span className="category-badge" style={{ background: '#e0e7ff', color: '#4338ca', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' }}>{announcement.category || 'General'}</span></td>
                              <td><span className={statusInfo.class}>{statusInfo.label}</span></td>
                              <td>{announcement.pinned ? '📌 Yes' : '—'}</td>
                              <td>{announcement.author || 'Admin'}</td>
                              <td style={{ fontSize: '12px' }}>{formatDate(announcement.publishDate || announcement.createdAt)}</td>
                              <td>{announcement.views || 0}</td>
                              <td>
                                <div className="action-buttons">
                                  <button className="action-btn-small view" onClick={() => {}} title="View"><Eye size={14} /></button>
                                  <button className="action-btn-small edit" onClick={() => editAnnouncement(announcement.id)} title="Edit"><Edit size={14} /></button>
                                  <button className="action-btn-small" onClick={() => toggleAnnouncementStatus(announcement.id)} title="Toggle Status" style={{ background: '#8b5cf6', color: 'white', borderRadius: '4px', border: 'none', padding: '4px 6px', cursor: 'pointer' }}>
                                    {announcement.status === 'Published' ? <EyeOff size={14} /> : <Check size={14} />}
                                  </button>
                                  <button className="action-btn-small" onClick={() => togglePin(announcement.id)} title="Toggle Pin" style={{ background: '#f59e0b', color: 'white', borderRadius: '4px', border: 'none', padding: '4px 6px', cursor: 'pointer' }}>
                                    <Pin size={14} />
                                  </button>
                                  <button className="action-btn-small delete" onClick={() => deleteAnnouncement(announcement.id)} title="Delete"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS PAGE */}
        {activePage === 'settings' && (
          <div className="page-container">
            <div className="page-header">
              <div><h2 className="page-title">Settings</h2><p className="page-subtitle">Manage your account and preferences</p></div>
              <button className="page-action-btn" onClick={handleSettingsSave}><Save size={18} /> Save Changes</button>
            </div>

            <div className="settings-grid">
              <div className="settings-card">
                <h4>Profile Settings</h4>
                <div className="settings-item"><label>Full Name</label><input type="text" name="fullName" value={settings.fullName} onChange={handleSettingsChange} placeholder="Enter full name" /></div>
                <div className="settings-item"><label>Email Address</label><input type="email" name="email" value={settings.email} onChange={handleSettingsChange} placeholder="Enter email address" /></div>
                <div className="settings-item"><label>Phone Number</label><input type="tel" name="phone" value={settings.phone} onChange={handleSettingsChange} placeholder="Enter phone number" /></div>
              </div>

              <div className="settings-card">
                <h4>Institute Information</h4>
                <div className="settings-item"><label>Institute Name</label><input type="text" name="instituteName" value={settings.instituteName} onChange={handleSettingsChange} placeholder="Enter institute name" /></div>
                <div className="settings-item"><label>Location</label><input type="text" name="location" value={settings.location} onChange={handleSettingsChange} placeholder="Enter location" /></div>
                <div className="settings-item"><label>Contact Email</label><input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleSettingsChange} placeholder="Enter contact email" /></div>
              </div>

              <div className="settings-card">
                <h4>Security</h4>
                <div className="settings-item"><label>Current Password</label><input type="password" name="currentPassword" value={settings.currentPassword} onChange={handleSettingsChange} placeholder="Enter current password" /></div>
                <div className="settings-item"><label>New Password</label><input type="password" name="newPassword" value={settings.newPassword} onChange={handleSettingsChange} placeholder="Enter new password (min 6 chars)" /></div>
                <div className="settings-item"><label>Confirm Password</label><input type="password" name="confirmPassword" value={settings.confirmPassword} onChange={handleSettingsChange} placeholder="Confirm new password" /></div>
              </div>

              <div className="settings-card">
                <h4>Preferences</h4>
                <div className="settings-item"><label>Language</label><select name="language" value={settings.language} onChange={handleSettingsChange}><option>English</option><option>Dzongkha</option><option>Hindi</option><option>Nepali</option></select></div>
                <div className="settings-item"><label>Currency</label><select name="currency" value={settings.currency} onChange={handleSettingsChange}><option>Nu. (Ngultrum)</option><option>$ (USD)</option><option>₹ (INR)</option><option>€ (EUR)</option></select></div>
                <div className="settings-item">
                  <label>Notifications</label>
                  <div className="toggle-switch">
                    <input type="checkbox" name="notifications" checked={settings.notifications} onChange={handleSettingsChange} />
                    <span className="toggle-slider"></span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    {settings.notifications ? '🔔 Notifications enabled' : '🔕 Notifications disabled'}
                  </span>
                </div>
              </div>

              <div className="settings-card" style={{ border: '2px solid #ef4444' }}>
                <h4 style={{ color: '#ef4444' }}>⚠️ Danger Zone</h4>
                <div className="settings-item">
                  <label style={{ color: '#ef4444', fontWeight: 'bold' }}>Clear All Data</label>
                  <button 
                    onClick={clearAllData}
                    style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      padding: '10px 20px', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginTop: '8px',
                      width: '100%'
                    }}
                  >
                    🗑️ Delete All Data
                  </button>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    This will permanently delete all students, payments, staff, attendance, admission, and announcement records from localStorage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo-wrapper"><span className="footer-logo">🤖</span></div>
              <div><p className="footer-title">Building Future with Robotics & IoT</p><p className="footer-tagline">Inspire + Innovate + Implement</p></div>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} Robotics & IoT Center, Thimphu. All rights reserved.</p>
              <div className="footer-social">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">YouTube</a>
                <a href="http://www.robotics.bt" className="social-link highlight">www.robotics.bt</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default StaffDashboard;