import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, LayoutDashboard, LogOut, PlusCircle, CheckSquare, FileSpreadsheet, 
  Clock, CheckCircle2, AlertCircle, Building, GraduationCap, Plane, Save, 
  Navigation, Globe2, MapPin, Map, BookOpen, UserPlus, UserCog, Trash2, 
  Printer, Search, Filter, Edit, X, FileText, Banknote, Paperclip, ArrowLeftCircle,
  ArrowRightCircle, XCircle,Download,Star, MessageSquare,
} from 'lucide-react';

// --- Constants & Config ---
const FACULTIES = [
  "Faculty of Engineering", "Faculty of Business Administration", "Faculty of Home Economics Technology",
  "Faculty of Fine and Applied Arts", "Faculty of Agricultural Technology", "Faculty of Technical Education",
  "Faculty of Architecture", "Faculty of Science and Technology", "Faculty of Mass Communication Technology",
  "Faculty of Liberal Arts", "Faculty of Nursing", "Faculty of Integrative Medicine" ,"-"
];

// --- Mock Data & Constants ---
const USERS = {
  admin: { username: 'admin', password: '12345', role: 'admin', name: 'Administrator' },
};

const STATUSES = {
  SUBMITTED: 'Submitted',
  
  IN_PROG_FAC: 'In Progress for Faculty Scholarship',
  HOLD_FAC: 'On Hold - Faculty Scholarship',
  REJECT_FAC: 'Rejected - Faculty Scholarship',
  APP_FAC: 'Approve Faculty Scholarship',
  
  IN_PROG_UNI: 'In Progress for University Scholarship',
  HOLD_UNI: 'On Hold - University Scholarship',
  REJECT_UNI: 'Rejected - University Scholarship',
  APP_UNI: 'Approve University Scholarship',
  
  COMPLETE: 'Complete'
};

const STATUS_COLORS = {
  [STATUSES.SUBMITTED]: 'bg-slate-100 text-slate-800 border-slate-300',
  
  [STATUSES.IN_PROG_FAC]: 'bg-blue-50 text-blue-700 border-blue-200',
  [STATUSES.HOLD_FAC]: 'bg-amber-50 text-amber-700 border-amber-200',
  [STATUSES.REJECT_FAC]: 'bg-red-50 text-red-700 border-red-200',
  [STATUSES.APP_FAC]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  
  [STATUSES.IN_PROG_UNI]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [STATUSES.HOLD_UNI]: 'bg-amber-50 text-amber-700 border-amber-200',
  [STATUSES.REJECT_UNI]: 'bg-red-50 text-red-700 border-red-200',
  [STATUSES.APP_UNI]: 'bg-teal-50 text-teal-700 border-teal-200',
  
  [STATUSES.COMPLETE]: 'bg-slate-800 text-white border-slate-900 shadow-sm'
};

const ACTION_MAP = {
  [STATUSES.SUBMITTED]: [
    { label: 'Start Faculty Review', next: STATUSES.IN_PROG_FAC, color: 'bg-blue-600 hover:bg-blue-700 text-white' , role: ['admin','facultyCoordinator']}
  ],
  [STATUSES.IN_PROG_FAC]: [
    { label: 'Approve (Fac)', next: STATUSES.APP_FAC, color: 'bg-emerald-600 hover:bg-emerald-700 text-white', role: ['admin', 'facultyCoordinator'] },
    { label: 'Hold', next: STATUSES.HOLD_FAC, color: 'bg-amber-500 hover:bg-amber-600 text-white', role: ['admin', 'facultyCoordinator'] },
    { label: 'Reject', next: STATUSES.REJECT_FAC, color: 'bg-red-500 hover:bg-red-600 text-white', role: ['admin', 'facultyCoordinator'] }
  ],
  [STATUSES.HOLD_FAC]: [
    { label: 'Resume', next: STATUSES.IN_PROG_FAC, color: 'bg-blue-500 hover:bg-blue-600 text-white' , role: ['admin', 'facultyCoordinator']},
    { label: 'Reject', next: STATUSES.REJECT_FAC, color: 'bg-red-500 hover:bg-red-600 text-white' , role: ['admin', 'facultyCoordinator']}
  ],
  [STATUSES.APP_FAC]: [
    { label: 'Start Uni Review', next: STATUSES.IN_PROG_UNI, color: 'bg-indigo-600 hover:bg-indigo-700 text-white' , role: ['admin', 'facultyCoordinator']}
  ],
  [STATUSES.IN_PROG_UNI]: [
    { label: 'Approve (Uni)', next: STATUSES.APP_UNI, color: 'bg-teal-600 hover:bg-teal-700 text-white' , role: ['admin', 'universityCoordinator']},
    { label: 'Hold', next: STATUSES.HOLD_UNI, color: 'bg-amber-500 hover:bg-amber-600 text-white' , role: ['admin', 'universityCoordinator']},
    { label: 'Reject', next: STATUSES.REJECT_UNI, color: 'bg-red-500 hover:bg-red-600 text-white' , role: ['admin', 'universityCoordinator']}
  ],
  [STATUSES.HOLD_UNI]: [
    { label: 'Resume', next: STATUSES.IN_PROG_UNI, color: 'bg-blue-500 hover:bg-blue-600 text-white' , role: ['admin', 'universityCoordinator']},
    { label: 'Reject', next: STATUSES.REJECT_UNI, color: 'bg-red-500 hover:bg-red-600 text-white' , role: ['admin', 'universityCoordinator']}
  ],
  [STATUSES.APP_UNI]: [
    { label: 'Complete', next: STATUSES.COMPLETE, color: 'bg-orange-600 hover:bg-orange-700 text-white' , role: ['admin', 'universityCoordinator']}
  ],
  
};

// Generate years 2016 - 2036
const YEARS = Array.from({ length: 21 }, (_, i) => 2016 + i);
const SEMESTERS = [1, 2, 3];

// World Map Zones
const ZONES = [
  { id: 'NA', name: 'North America', top: '30%', left: '20%' },
  { id: 'SA', name: 'South America', top: '70%', left: '30%' },
  { id: 'EU', name: 'Europe', top: '25%', left: '50%' },
  { id: 'AF', name: 'Africa', top: '60%', left: '52%' },
  { id: 'ME', name: 'Middle East', top: '45%', left: '60%' },
  { id: 'AS', name: 'Asia', top: '35%', left: '75%' },
  { id: 'OC', name: 'Oceania', top: '75%', left: '85%' },
];

// Region Mapping Function
const getRegion = (country) => {
  const c = (country || '').toLowerCase();
  if (c.includes('united states') || c.includes('america') || c.includes('canada')) return 'NA';
  if (c.includes('brazil') || c.includes('argentina') || c.includes('chile') || c.includes('peru')) return 'SA';
  if (c.includes('uk') || c.includes('england') || c.includes('germany') || c.includes('france') || c.includes('switzerland') || c.includes('italy') || c.includes('netherlands') || c.includes('europe')) return 'EU';
  if (c.includes('africa') || c.includes('egypt') || c.includes('kenya') || c.includes('morocco')) return 'AF';
  if (c.includes('uae') || c.includes('saudi') || c.includes('qatar') || c.includes('israel') || c.includes('arab')) return 'ME';
  if (c.includes('australia') || c.includes('new zealand')) return 'OC';
  // Default to Asia
  return 'AS';
};

// Cookie Helper Functions
const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0)===' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
};

const eraseCookie = (name) => {   
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

// Role Permission Checkers
const canEditRecord = (user, record) => {
  if (!user || !record) return false;
  if (user.role === 'admin' || user.role === 'universityCoordinator') return true; 
  if (user.role === 'facultyCoordinator') return record.faculty === user.faculty;
  if (user.role === 'student') return record.createdBy === user.username;
  return false;
};

// Star Rating Component
const StarRating = ({ rating, setRating, readOnly }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          size={24} 
          className={`cursor-pointer transition-colors ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'} ${readOnly ? 'pointer-events-none' : 'hover:scale-110'}`}
          onClick={() => !readOnly && setRating(star)}
        />
      ))}
    </div>
  );
}

// Components 
const Badge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[status] || 'bg-gray-100'}`}>
    {status}
  </span>
);

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
      {icon} <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white shadow-inner`}>{icon}</div>
      <div><p className="text-sm text-slate-500 font-medium">{title}</p><p className="text-2xl font-bold text-slate-800">{value}</p></div>
    </div>
  );
}

export default function App() {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('mock_users');
    return savedUsers ? JSON.parse(savedUsers) : USERS;
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null); 

  useEffect(() => { localStorage.setItem('mock_users', JSON.stringify(users)); }, [users]);

 useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) throw new Error('API Error'); 
        const data = await response.json();
        if (Array.isArray(data)) setStudents(data);
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const savedUserId = getCookie('auth_user_id');
    if (savedUserId && users[savedUserId]) setCurrentUser(users[savedUserId]); 
  }, [users]); 

// Login Handler
  const handleLogin = (username, password) => {
    if (users[username] && users[username].password === password) {
      setCurrentUser(users[username]);
      setCookie('auth_user_id', username, 7); 
      setActiveTab('dashboard');
      return true; 
    } else {
      return false; 
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setEditingStudent(null);
    eraseCookie('auth_user_id');
  };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  // Real Cloud Upload Vercel Blob
  const uploadFileToCloud = async (file) => {
    if (!file) return null;
    const fileExtension = file.name.split('.').pop();
    const safeFileName = `${Date.now()}_doc.${fileExtension}`;
    try {
      const response = await fetch(`/api/upload?filename=${safeFileName}`, { method: 'POST', body: file });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return data.url; 
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Failed to upload ${file.name}`);
      return null;
    }
  };

  // Create Record Handler
   const handleAddStudent = async (studentData) => {
    try {
      const newStudent = {
        ...studentData,
        id: Date.now().toString(), // สร้าง ID ชั่วคราว
        status: STATUSES.SUBMITTED,
        submittedAt: new Date().toISOString(),
        createdBy: currentUser.username || 'unknown_user'
      };
      // ยิงข้อมูลไปหลังบ้าน
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      if (!response.ok) throw new Error('Save failed');
      const savedStudent = await response.json();
      setStudents([savedStudent, ...students]);
      setActiveTab('list');
    } catch(error) {
      console.error("Error adding document: ", error);
      alert("Error saving data. Please check Vercel Logs.");
    }
  }

  const handleUpdateStudent = async (id, updatedData) => {
    try {
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData })
      });

      if(response.ok){
      const updatedList = students.map(s => s.id === id ? { ...s, ...updatedData } : s);
      setStudents(updatedList);
      setActiveTab('list');
      setEditingStudent(null);
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to completely delete this student's record? This action cannot be undone.")) {
      try {
        const response = await fetch('/api/students', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        
        if(response.ok){
        const filteredList = students.filter(s => s.id !== id);
        setStudents(filteredList);
        }
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  // Update Status Handler
 const handleUpdateStatus = async(id, newStatus) => {
    try {
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (response.ok) {
        const updatedList = students.map(s => s.id === id ? { ...s, status: newStatus } : s);
        setStudents(updatedList);
      }
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 print:h-auto print:block">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-10 flex-shrink-0 print:hidden">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white leading-tight">RMUTT CWIE International<br/></h1>
        </div>
        
        <div className="p-4 border-b border-slate-800 bg-slate-800/50">
          <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Current User</div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${currentUser.role === 'student' ? 'bg-orange-500' : 'bg-blue-500'}`}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{currentUser.name}</div>
              <div className="text-xs text-blue-400 capitalize">{currentUser.role}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={20} />} label="Dashboard" 
            active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<FileSpreadsheet size={20} />} label=" Spreadsheet" 
            active={activeTab === 'list'} onClick={() => {setActiveTab('list'); setEditingStudent(null); }} 
          />

          {['admin', 'facultyCoordinator', 'student'].includes(currentUser.role) && (
            <NavItem icon={<PlusCircle size={20} />} label="New Registration" active={activeTab === 'entry'} onClick={() => {setActiveTab('entry'); setEditingStudent(null); }} />
          )}

          {['admin', 'facultyCoordinator', 'universityCoordinator'].includes(currentUser.role) && (
            <NavItem icon={<CheckSquare size={20} />} label="Approvals" active={activeTab === 'approval'} onClick={() => {setActiveTab('approval'); setEditingStudent(null);}} />
          )}

          {currentUser.role === 'admin' && (
              <NavItem icon={<UserCog size={20} />} label="User Management" active={activeTab === 'users'} onClick={() => {setActiveTab('users'); setEditingStudent(null); }} />
          )}
          
          <div className="pt-4 mt-4 border-t border-slate-800">
            <NavItem 
              icon={<BookOpen size={20} />} label="User Guide" 
              active={activeTab === 'guide'} onClick={() => {setActiveTab('guide'); setEditingStudent(null); }} 
            />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-3 py-2 rounded-md hover:bg-slate-800">
            <LogOut size={20} /><span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 print:overflow-visible print:block">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm flex-shrink-0 print:hidden">
          <h2 className="text-xl font-semibold text-slate-800 truncate">
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'list' && 'Spreadsheet : Student Records'}
            {activeTab === 'entry' && 'Student Registration Form'}
            {activeTab === 'approval' && 'Approval Management System'}
            {activeTab === 'users' && 'User Account Management'}
            {activeTab === 'edit' && 'Edit Student Record'}
            {activeTab === 'guide' && 'System User Guide'}
          </h2>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 print:p-0 print:overflow-visible print:block">
          {activeTab === 'dashboard' && <DashboardView students={students} />}
          {activeTab === 'list' && <StudentListView students={students} currentUser={currentUser} onEdit={(student) => { setEditingStudent(student); setActiveTab('edit'); }} onDelete={handleDeleteStudent} />}
          {activeTab === 'entry' && <DataEntryView onSubmit={handleAddStudent} uploadFileToCloud={uploadFileToCloud} currentUser={currentUser}/>}
          {activeTab === 'edit' && <EditStudentView student={editingStudent} onUpdate={handleUpdateStudent} onCancel={() => { setActiveTab('list'); setEditingStudent(null); }} uploadFileToCloud={uploadFileToCloud} currentUser={currentUser}/>}
          {activeTab === 'approval' && <ApprovalView students={students} onUpdateStatus={handleUpdateStatus} currentUser={currentUser}/>}
          {activeTab === 'users' && <UserManagementView users={users} setUsers={setUsers} currentUser={currentUser}/>}
          {activeTab === 'guide' && <GuideView />}
        </div>
      </main>
    </div>
  );
}

// Dashboard Views

function DashboardView({ students }) {
  const [selectedZone, setSelectedZone] = useState('ALL');
  const stats = useMemo(() => {
    return {
      total: students.length,
      submitted: students.filter(s => s.status === STATUSES.SUBMITTED).length,
      inProgress_Fac: students.filter(s => s.status === STATUSES.IN_PROG_FAC).length,
      approved_Fac: students.filter(s => s.status === STATUSES.APP_FAC).length,
      holdOn_Fac: students.filter(s => s.status === STATUSES.HOLD_FAC).length,
      rejected_Fac: students.filter(s => s.status === STATUSES.REJECT_FAC).length,
      inProgress_Uni: students.filter(s => s.status === STATUSES.IN_PROG_UNI).length,
      approved_Uni: students.filter(s => s.status === STATUSES.APP_UNI).length,
      holdOn_Uni: students.filter(s => s.status === STATUSES.HOLD_UNI).length,
      rejected_Uni: students.filter(s => s.status === STATUSES.REJECT_UNI).length,
      complete: students.filter(s => s.status === STATUSES.COMPLETE).length,
    };
  }, [students]);

  const studentsPerZone = useMemo(() => {
    const counts = { NA: 0, SA: 0, EU: 0, AF: 0, ME: 0, AS: 0, OC: 0 };
    students.forEach(s => {
      const region = getRegion(s.country);
      if (counts[region] !== undefined) counts[region]++;
    });
    return counts;
  }, [students]);

  const displayStudents = useMemo(() => {
    if (selectedZone === 'ALL') return students.slice(0, 10);
    return students.filter(s => getRegion(s.country) === selectedZone);
  }, [students, selectedZone]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Records" value={stats.total} icon={<Users />} color="bg-slate-500" />
        <StatCard title="Submitted" value={stats.submitted} icon={<Clock />} color="bg-yellow-500" />
        <StatCard title="In Progress Fac" value={stats.inProgress_Fac} icon={<Clock />} color="bg-blue-500" />
        <StatCard title="Approved Fac" value={stats.approved_Fac} icon={<CheckCircle2 />} color="bg-green-500" />
        <StatCard title="Hold On Fac" value={stats.holdOn_Fac} icon={<AlertCircle />} color="bg-orange-500" />
        <StatCard title="Rejected Fac" value={stats.rejected_Fac} icon={<XCircle />} color="bg-red-500" />
        <StatCard title="In Progress Uni" value={stats.inProgress_Uni} icon={<Clock />} color="bg-blue-500" />
        <StatCard title="Approved Uni" value={stats.approved_Uni} icon={<CheckCircle2 />} color="bg-green-500" />
        <StatCard title="Hold On Uni" value={stats.holdOn_Uni} icon={<AlertCircle />} color="bg-orange-500" />
        <StatCard title="Rejected Uni" value={stats.rejected_Uni} icon={<XCircle />} color="bg-red-500" />
        <StatCard title="Complete" value={stats.complete} icon={<CheckCircle2 />} color="bg-green-500" />
      </div>

      {/* Map & Region Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* World Map Component */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Globe2 className="text-blue-600" size={20} /> Cooperative Education Deployment Map
            </h3>
            <button 
              onClick={() => setSelectedZone('ALL')}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${selectedZone === 'ALL' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'}`}
            >
              View All
            </button>
          </div>
          <div className="relative w-full h-[400px] bg-[#e6f2f8] overflow-hidden">
            <img 
              src="worldMap.jpg" 
              alt="World Map Zones" 
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none" 
            />

            {/* Region Markers */}
            {ZONES.map(zone => {
              const count = studentsPerZone[zone.id];
              const isSelected = selectedZone === zone.id;     
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 transition-all duration-300 ${isSelected ? 'scale-110 z-20' : 'hover:scale-110'}`}
                  style={{ top: zone.top, left: zone.left }}
                >
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] border-2 transition-colors duration-300 ${
                    isSelected ? 'bg-blue-500 border-white text-white' : count > 0 ? 'bg-emerald-500 border-white text-white' : 'bg-slate-700 border-slate-500 text-slate-400'
                  }`}>
                    <MapPin size={18} />
                    {count > 0 && !isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 shadow-md">
                        {count}
                      </span>
                    )}
                  </div>
                  <div className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl border backdrop-blur-md transition-all ${
                    isSelected ? 'bg-blue-600 text-white border-blue-500' : 'bg-white/90 text-slate-800 border-white/50'
                  }`}>
                    {zone.name}
                    {isSelected && <span className="ml-1.5 bg-blue-800/50 px-1.5 py-0.5 rounded text-[10px]">{count} students</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* List of Students in Selected Zone */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[465px]">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Navigation className="text-emerald-600" size={18} /> 
              {selectedZone === 'ALL' ? 'Recent Entries' : `Students in ${ZONES.find(z => z.id === selectedZone)?.name}`}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="divide-y divide-slate-100">
              {displayStudents.map(s => (
                <div key={s.id} className="p-4 hover:bg-slate-50 transition-colors rounded-lg group cursor-default">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <span className="font-medium text-slate-900 leading-tight">{s.prefix} {s.firstName} {s.lastName}</span>
                    <div className="shrink-0"><Badge status={s.status} /></div>
                  </div>
                  <div className="text-sm text-slate-500 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <Building size={14} className="text-slate-400 shrink-0 mt-0.5" /> 
                      <span className="line-clamp-1" title={s.company}>{s.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400 shrink-0" /> 
                      <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{s.country}</span>
                    </div>
                  </div>
                </div>
              ))}
              {displayStudents.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400">
                  <Map size={48} className="text-slate-200 mb-3" />
                  <p className="text-center font-medium">No students deployed<br/>in this region.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function DataEntryView({ onSubmit, uploadFileToCloud, currentUser }) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Auto-assign faculty if FacCoord, else use form value
    if (currentUser.role === 'facultyCoordinator') {
      data.faculty = currentUser.faculty;
    }
    
    // ดึงตัว File Object ออกมาจากฟอร์มให้ถูกต้อง
    const facFile = formData.get('facultyScholarshipFile');
    // อัปโหลด Faculty File
    if (facFile && facFile.size > 0) {data.facultyScholarshipFileName = await uploadFileToCloud(facFile);} 
    else {data.facultyScholarshipFileName = null;}
    delete data.facultyScholarshipFile; 
    
    // ดึงตัว File Object ออกมาจากฟอร์มให้ถูกต้อง
    const uniFile = formData.get('uniScholarshipFile');
    // อัปโหลด Uni File
    if (uniFile && uniFile.size > 0) {data.uniScholarshipFileName = await uploadFileToCloud(uniFile);} 
    else { data.uniScholarshipFileName = null;}
    delete data.uniScholarshipFile;

    // Required fields base on Student
    const requiredFields = ['prefix', 'firstName', 'lastName', 'gpax', 'engTest', 'faculty', 'company', 'country', 'position', 'year', 'semester', 'departureDate', 'startDate', 'endDate', 'returnDate'];
    let isComplete = true;
    for (let field of requiredFields) {
      if (!data[field] || String(data[field]).trim() === "") {
        isComplete = false;
        break;
      }
    }

    if (!isComplete) {
      setError('Please complete all required fields.');
      setSuccess('');
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    data.year = parseInt(data.year, 10);
    data.semester = parseInt(data.semester, 10);
    await onSubmit(data); 
    setError('');
    setSuccess('Record successfully saved and submitted.');
    e.target.reset();
    setIsSubmitting(false);
    
    setTimeout(() => setSuccess(''), 4000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <PlusCircle className="text-blue-500" /> Create New Record
      </h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 shadow-sm animate-pulse">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 shadow-sm">
          <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
          <p className="font-bold">{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Personal Data */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><GraduationCap size={18} /> Student Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1">Prefix</label><select name="prefix" className="w-full px-3 py-2 border rounded-md" required><option value="">Select...</option><option value="Mr.">Mr.</option><option value="Ms.">Ms.</option><option value="Mrs.">Mrs.</option></select></div>
            <div><label className="block text-sm font-medium mb-1">First Name</label><input type="text" name="firstName" className="w-full px-3 py-2 border rounded-md" required/></div>
            <div><label className="block text-sm font-medium mb-1">Last Name</label><input type="text" name="lastName" className="w-full px-3 py-2 border rounded-md" required/></div>
            <div><label className="block text-sm font-medium mb-1">GPAX</label><input type="number" step="0.01" min="0" max="4" name="gpax" className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">English Proficiency Test</label><input type="text" name="engTest" placeholder="e.g., TOEIC 600" className="w-full px-3 py-2 border rounded-md" /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Faculty</label>
              <select name="faculty" className="w-full px-3 py-2 border rounded-md bg-white" required disabled={currentUser.role === 'facultyCoordinator'} defaultValue={currentUser.role === 'facultyCoordinator' ? currentUser.faculty : ''}>
                <option value="">Select Faculty...</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Organization Data */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Building size={18} /> Host Organization Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Organization Name </label><input type="text" name="company" className="w-full px-3 py-2 border rounded-md" required/></div>
            <div><label className="block text-sm font-medium mb-1">Country</label><input type="text" name="country" className="w-full px-3 py-2 border rounded-md" required/></div>
            <div><label className="block text-sm font-medium mb-1">Position / Job Title</label><input type="text" name="position" className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Academic Year</label><select name="year" className="w-full px-3 py-2 border rounded-md"><option value="">Select...</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Semester</label><select name="semester" className="w-full px-3 py-2 border rounded-md"><option value="">Select...</option>{SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}</select></div>
          </div>
        </div>

        {/* Section 3: Schedule */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Plane size={18} /> Internship Schedule</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Departure Date</label><input type="date" name="departureDate" className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Internship Start Date</label><input type="date" name="startDate" className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Internship End Date</label><input type="date" name="endDate" className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Return Date</label><input type="date" name="returnDate" className="w-full px-3 py-2 border rounded-md" /></div>
          </div>
          </div>
        </div>

        {/* Section 4: Document Attachments */}
        {['admin', 'facultyCoordinator', 'universityCoordinator'].includes(currentUser.role) && (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Paperclip size={18} />Scholarship Documents Request</h4>
          <div className="space-y-6">
            
            {/* 4.1 Faculty Scholarship */}
            <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
              <h5 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                <Banknote size={16} className="text-emerald-600"/> 1. Faculty Scholarship Request
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Attach PDF File</label>
                   <input type="file" name="facultyScholarshipFile" accept=".pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors" disabled={currentUser.role === 'student'}/>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Requested Amount (THB)</label>
                   <input type="number" name="facultyScholarshipAmount" min="0" placeholder="e.g. 50000" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" disabled={currentUser.role === 'student'}/>
                 </div>
              </div>
            </div>

            {/* 4.2 University Scholarship */}
            <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
              <h5 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                <Banknote size={16} className="text-emerald-600"/> 2. University Scholarship Request
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Attach PDF File</label>
                   <input type="file" name="uniScholarshipFile" accept=".pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors" disabled={currentUser.role === 'student'}/>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Requested Amount (THB)</label>
                   <input type="number" name="uniScholarshipAmount" min="0" placeholder="e.g. 50000" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" disabled={currentUser.role === 'student'}/>
                 </div>
              </div>
            </div>
             {currentUser.role === 'student' && <p className="text-xs text-red-500 mt-2">Students cannot upload scholarship files directly. Please contact your Faculty Coordinator.</p>}
          </div>
        </div>
        )}

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isSubmitting} className={`w-full md:w-auto text-white px-8 py-3 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
            <Save size={20} /> {isSubmitting ? 'Uploading...' : 'Save and Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

function EditStudentView({ student, onUpdate, onCancel, uploadFileToCloud, currentUser  }) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Local state for star rating
  const [facScore, setFacScore] = useState(student.facScore || 0);
  const [uniScore, setUniScore] = useState(student.uniScore || 0);
  // Role Checks
  if (!student) return null;
  const isStudent = currentUser.role === 'student';
  const isFac = currentUser.role === 'facultyCoordinator';
  const isUni = currentUser.role === 'universityCoordinator';
  const isAdmin = currentUser.role === 'admin';

  const isCompleteProgress = student.status === STATUSES.COMPLETE;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const facFile = formData.get('facultyScholarshipFile');
    const uniFile = formData.get('uniScholarshipFile');
    const projPdf = formData.get('projectPdfFile');
    const projReport = formData.get('projectReportFile');

    // File Uploads
    if (facFile && facFile.size > 0) data.facultyScholarshipFileName = await uploadFileToCloud(facFile);
    else data.facultyScholarshipFileName = student.facultyScholarshipFileName || null;
    delete data.facultyScholarshipFile; 

    if (uniFile && uniFile.size > 0) data.uniScholarshipFileName = await uploadFileToCloud(uniFile);
    else data.uniScholarshipFileName = student.uniScholarshipFileName || null;
    delete data.uniScholarshipFile;

    if (projPdf && projPdf.size > 0) data.projectPdfFileName = await uploadFileToCloud(projPdf);
    else data.projectPdfFileName = student.projectPdfFileName || null;
    delete data.projectPdfFile;

    if (projReport && projReport.size > 0) data.projectReportFileName = await uploadFileToCloud(projReport);
    else data.projectReportFileName = student.projectReportFileName || null;
    delete data.projectReportFile;

    const requiredFields = ['prefix', 'firstName', 'lastName', 'gpax', 'engTest', 'faculty', 'company', 'country', 'position', 'year', 'semester', 'departureDate', 'startDate', 'endDate', 'returnDate'];
    let isComplete = true;
    for (let field of requiredFields) {
      if (!data[field] || String(data[field]).trim() === "") {
        isComplete = false;
        break;
      }
    }

    if (!isComplete) {
      setError('Please complete all required fields.');
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    data.year = parseInt(data.year, 10);
    data.semester = parseInt(data.semester, 10);
    await onUpdate(student.id, data);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Edit className="text-orange-500" /> Edit Student Record</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 p-2 bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 shadow-sm animate-pulse">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="font-bold">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Personal Data */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><GraduationCap size={18} /> Student Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1">Prefix</label>
            <select name="prefix" defaultValue={student.prefix} disabled={isUni} className="w-full px-3 py-2 border rounded-md bg-white">
              <option value="Mr.">Mr.</option><option value="Ms.">Ms.</option><option value="Mrs.">Mrs.</option>
            </select></div>
            <div><label className="block text-sm font-medium mb-1">First Name</label><input type="text" name="firstName" defaultValue={student.firstName} disabled={isUni} className="w-full px-3 py-2 border rounded-md" required/></div>
            <div><label className="block text-sm font-medium mb-1">Last Name</label><input type="text" name="lastName" defaultValue={student.lastName} disabled={isUni} className="w-full px-3 py-2 border rounded-md" required/></div>
            <div><label className="block text-sm font-medium mb-1">GPAX</label><input type="number" step="0.01" min="0" max="4" name="gpax" defaultValue={student.gpax} disabled={isUni} className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">English Proficiency Test</label><input type="text" name="engTest" placeholder="e.g., TOEIC 600" defaultValue={student.engTest} disabled={isUni} className="w-full px-3 py-2 border rounded-md" /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Faculty</label>
              <select name="faculty" className="w-full px-3 py-2 border rounded-md bg-white" defaultValue={student.faculty}>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Organization Data */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Building size={18} /> Host Organization Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Organization Name </label><input type="text" name="company" defaultValue={student.company} disabled={isStudent} className="w-full px-3 py-2 border rounded-md" required/></div>
            <div><label className="block text-sm font-medium mb-1">Country</label><input type="text" name="country" defaultValue={student.country} disabled={isStudent} className="w-full px-3 py-2 border rounded-md" required/></div>
            <div><label className="block text-sm font-medium mb-1">Position / Job Title</label><input type="text" name="position" defaultValue={student.position} disabled={isStudent} className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Academic Year</label><select name="year" defaultValue={student.year} disabled={isStudent} className="w-full px-3 py-2 border rounded-md"><option value="">Select...</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Semester</label><select name="semester" defaultValue={student.semester} disabled={isStudent} className="w-full px-3 py-2 border rounded-md"><option value="">Select...</option>{SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}</select></div>
          </div>
        </div>

        {/* Section 3: Schedule */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Plane size={18} /> Internship Schedule</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Departure Date</label><input type="date" name="departureDate" defaultValue={student.departureDate} disabled={isStudent}className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Internship Start Date</label><input type="date" name="startDate" defaultValue={student.startDate} disabled={isStudent} className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Internship End Date</label><input type="date" name="endDate" defaultValue={student.endDate} disabled={isStudent} className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Return Date</label><input type="date" name="returnDate" defaultValue={student.returnDate} disabled={isStudent}className="w-full px-3 py-2 border rounded-md" /></div>
          </div>
          </div>
        </div>

        {/* Section 4: Document Attachments */}
        {['admin', 'facultyCoordinator', 'universityCoordinator'].includes(currentUser.role) && (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Paperclip size={18} />Scholarship Documents Request</h4>
          <div className="space-y-6">
            
            {/* 4.1 Faculty Scholarship */}
            <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
              <h5 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                <Banknote size={16} className="text-emerald-600"/> 1. Faculty Scholarship Request
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Attach PDF File</label>
                   {student.facultyScholarshipFileName && <a href={student.facultyScholarshipFileName} target="_blank" className="text-xs text-blue-600 border px-2 py-1 rounded inline-block mb-2"><Download size={12} className="inline"/> View Uploaded File</a>}
                   <input type="file" name="facultyScholarshipFile" accept=".pdf" disabled={isStudent || isUni} className="w-full text-sm file:mr-4 file:py-1 file:rounded file:border-0 file:bg-slate-100" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Requested Amount (THB)</label>
                   <input type="number" name="facultyScholarshipAmount" defaultValue={student.facultyScholarshipAmount} disabled={isStudent || isUni}className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" disabled={currentUser.role === 'student'}/>
                 </div>
              </div>
            </div>

            {/* 4.2 University Scholarship */}
            <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
              <h5 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                <Banknote size={16} className="text-emerald-600"/> 2. University Scholarship Request
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-2">Attach PDF</label>
                    {student.uniScholarshipFileName && <a href={student.uniScholarshipFileName} target="_blank" className="text-xs text-emerald-600 border px-2 py-1 rounded inline-block mb-2"><Download size={12} className="inline"/> View Uploaded File</a>}
                    <input type="file" name="uniScholarshipFile" accept=".pdf" disabled={isStudent || isFac} className="w-full text-sm file:mr-4 file:py-1 file:rounded file:border-0 file:bg-slate-100" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Requested Amount (THB)</label>
                   <input type="number" name="uniScholarshipAmount" defaultValue={student.uniScholarshipAmount} disabled={isStudent || isUni} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" disabled={currentUser.role === 'student'}/>
                 </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* 🚀 NEW: Project Submission System (Visible only on Success) */}
        {isCompleteProgress && (
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 shadow-sm mt-8">
            <h4 className="font-bold text-purple-800 mb-4 flex items-center gap-2"><Star size={20} className="fill-purple-500 text-purple-500"/> Project Submission & Evaluation</h4>
            
            {/* Student Project Input */}
            <div className="space-y-4 mb-8 bg-white p-5 rounded border border-purple-100">
              <div><label className="block text-sm font-bold mb-1">Project Name</label><input type="text" name="projectName" defaultValue={student.projectName} disabled={!isStudent && !isAdmin} className="w-full px-3 py-2 border rounded-md" placeholder="Enter Project Title" /></div>
              <div><label className="block text-sm font-bold mb-1">Project Description</label><textarea name="projectDescription" defaultValue={student.projectDescription} disabled={!isStudent && !isAdmin} rows={3} className="w-full px-3 py-2 border rounded-md" placeholder="Briefly describe the project..." /></div>
              <div><label className="block text-sm font-bold mb-1">Website URL (Optional)</label><input type="url" name="projectWebsite" defaultValue={student.projectWebsite} disabled={!isStudent && !isAdmin} className="w-full px-3 py-2 border rounded-md" placeholder="https://..." /></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-700">Presentation File (PDF/PPT)</label>
                  {student.projectPdfFileName && <a href={student.projectPdfFileName} target="_blank" className="text-xs text-purple-600 border px-2 py-1 rounded inline-block mb-2"><Download size={12} className="inline"/> View File</a>}
                  <input type="file" name="projectPdfFile" disabled={!isStudent && !isAdmin} className="w-full text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-700">Full Report Book (PDF)</label>
                  {student.projectReportFileName && <a href={student.projectReportFileName} target="_blank" className="text-xs text-purple-600 border px-2 py-1 rounded inline-block mb-2"><Download size={12} className="inline"/> View Report</a>}
                  <input type="file" name="projectReportFile" accept=".pdf" disabled={!isStudent && !isAdmin} className="w-full text-sm" />
                </div>
              </div>
            </div>

            {/* Evaluation Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Faculty Evaluation */}
              <div className="bg-blue-50/50 p-4 rounded border border-blue-100">
                <h5 className="font-bold text-blue-800 mb-3 flex items-center gap-1"><MessageSquare size={16}/> Faculty Evaluation</h5>
                <div className="mb-3"><label className="block text-xs font-semibold mb-1 text-slate-500">SCORE</label>
                  <StarRating rating={facScore} setRating={setFacScore} readOnly={isStudent || isUni} />
                </div>
                <div><label className="block text-xs font-semibold mb-1 text-slate-500">COMMENTS</label><textarea name="facComment" defaultValue={student.facComment} disabled={isStudent || isUni} rows={3} className="w-full px-2 py-1 text-sm border rounded bg-white" placeholder="Faculty advisor comments..." /></div>
              </div>

              {/* Uni Evaluation */}
              <div className="bg-emerald-50/50 p-4 rounded border border-emerald-100">
                <h5 className="font-bold text-emerald-800 mb-3 flex items-center gap-1"><MessageSquare size={16}/> University Evaluation</h5>
                <div className="mb-3"><label className="block text-xs font-semibold mb-1 text-slate-500">SCORE</label>
                  <StarRating rating={uniScore} setRating={setUniScore} readOnly={isStudent || isFac} />
                </div>
                <div><label className="block text-xs font-semibold mb-1 text-slate-500">COMMENTS</label><textarea name="uniComment" defaultValue={student.uniComment} disabled={isStudent || isFac} rows={3} className="w-full px-2 py-1 text-sm border rounded bg-white" placeholder="University advisor comments..." /></div>
              </div>
            </div>

          </div>
        )}

        <div className="flex justify-end pt-4">
          <button type="button" onClick={onCancel} className="bg-slate-200 px-6 py-2 rounded-lg font-medium">Cancel</button>
          <button type="submit" disabled={isSubmitting} className={`w-full md:w-auto text-white px-8 py-3 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
            <Save size={20} /> {isSubmitting ? 'Uploading...' : 'Save and Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ApprovalView({ students, onUpdateStatus , currentUser}) {
  const [filter, setFilter] = useState('ALL');

  // กรองตามการจัดกลุ่มสถานะ
  const filteredStudents = students.filter(s => {
    if (currentUser.role === 'facultyCoordinator' && s.faculty !== currentUser.faculty) return false;
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return ![STATUSES.COMPLETE, STATUSES.REJECT_FAC, STATUSES.REJECT_UNI, STATUSES.HOLD_FAC, STATUSES.HOLD_UNI ].includes(s.status);
    if (filter === 'HOLD') return [STATUSES.HOLD_FAC, STATUSES.HOLD_UNI].includes(s.status);
    if (filter === 'RESOLVED') return [STATUSES.COMPLETE, STATUSES.REJECT_FAC, STATUSES.REJECT_UNI ].includes(s.status);
    return true;
  });


  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full max-w-6xl mx-auto">
      <div className="p-4 md:p-6 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <CheckSquare className="text-blue-600" /> Approval Queue
        </h3>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={() => setFilter('ALL')} className={`px-4 py-2 text-sm font-medium rounded-md border ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>All</button>
          <button onClick={() => setFilter('ACTIVE')} className={`px-4 py-2 text-sm font-medium rounded-md border ${filter === 'ACTIVE' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>Active</button>
          <button onClick={() => setFilter('HOLD')} className={`px-4 py-2 text-sm font-medium rounded-md border ${filter === 'HOLD' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>On Hold</button>
          <button onClick={() => setFilter('RESOLVED')} className={`px-4 py-2 text-sm font-medium rounded-md border ${filter === 'RESOLVED' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>Resolved</button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4 md:p-6">
        <div className="grid gap-4">
          {filteredStudents.map(student =>{
            const isCompleted = student.status === STATUSES.COMPLETE;
            const availableActions = (ACTION_MAP[student.status] || []).filter(action => !action.role || action.role.includes(currentUser?.role));
          return(
            <div key={student.id} className={`border rounded-lg p-5 flex flex-col lg:flex-row gap-6 justify-between ${student.status === STATUSES.COMPLETE ? 'border-purple-300 bg-purple-50/20' : 'border-slate-200 bg-white'}`}>
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h4 className="text-lg font-bold text-slate-800">{student.prefix} {student.firstName} {student.lastName}</h4>
                  <Badge status={student.status} />
                </div>
                <div className="text-sm text-slate-600 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="flex gap-2"><Building className="text-slate-400 shrink-0" size={16}/> <span className="truncate"><strong>Organization:</strong> {student.company} ({student.country})</span></p>
                  <p><strong>Position:</strong> {student.position}</p>
                  <p><strong>Academic Record:</strong> GPAX {student.gpax} | {student.engTest}</p>
                  <p><strong>Duration:</strong> {new Date(student.startDate).toLocaleDateString('en-US')} - {new Date(student.endDate).toLocaleDateString('en-US')}</p>
                  <p><strong>Faculty Fund:</strong> ฿{student.facultyScholarshipAmount || '0'} {student.facultyScholarshipFileName && <a href={student.facultyScholarshipFileName} target="_blank" className="text-blue-600 border px-1 rounded ml-1 text-xs">PDF</a>}</p>
                  <p><strong>Uni Fund:</strong> ฿{student.uniScholarshipAmount || '0'} {student.uniScholarshipFileName && <a href={student.uniScholarshipFileName} target="_blank" className="text-emerald-600 border px-1 rounded ml-1 text-xs">PDF</a>}</p>
                </div>
                 {/* Project Sneak Peek */}
                {student.status === STATUSES.COMPLETE && student.projectName && (
                  <div className="mt-3 p-3 bg-purple-100/50 rounded border border-purple-200 text-sm">
                    <strong>Project:</strong> {student.projectName} 
                    <span className="ml-3 font-bold text-yellow-600">★ Fac: {student.facScore||0} | Uni: {student.uniScore||0}</span>
                  </div>
                )}
              </div>
              
              {student.facultyScholarshipFileName && (
                <a 
                  href={student.facultyScholarshipFileName} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors"
                >
                  <Download size={14}/> View Document
                </a>
              )}
              {/* Action Buttons based on Workflow */}
              <div className="flex flex-col gap-2 w-full lg:w-48 lg:shrink-0">
                
                {availableActions.length > 0 && (
                  <div className="flex flex-col gap-2">
                  {availableActions.map(action => (
                    <button key={action.label} onClick={() => onUpdateStatus(student.id, action.next)} className={`px-3 py-2 rounded text-xs font-bold shadow-sm ${action.color}`}>
                      {action.label}
                    </button>
                  ))}
                  </div>
                )}

                {/* ปุ่มย้อนกลับไป Submitted เสมอ */}
                {student.status !== STATUSES.SUBMITTED && (
                    <button 
                      onClick={() => onUpdateStatus(student.id, STATUSES.SUBMITTED)} 
                      className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-md font-medium text-xs transition-colors flex items-center justify-center gap-1 mt-1"
                    >
                      <ArrowLeftCircle size={14}/> Revert to Submitted
                    </button>
                )}
                {/* กล่องข้อความเมื่อสำเร็จแล้ว */}
                {isCompleted && (
                  <div className="text-center text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-md font-medium text-sm mt-2">
                    <CheckCircle2 size={24} className="mx-auto mb-1" />
                    All Steps Completed
                  </div>
                )}
            
                {filteredStudents.length === 0 && (
                  <div className="text-center py-16 text-slate-500 bg-slate-50/50 rounded-lg border border-dashed border-slate-300">
                    <CheckSquare size={48} className="mx-auto text-slate-300 mb-4" />
                    <p>No records match the selected criteria.</p>
                  </div>
                )}
                {student.facultyScholarshipFileName && (
                  <a 
                    href={student.facultyScholarshipFileName} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors"
                  >
                    <Download size={14}/> View Document
                  </a>
                )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StudentListView({ students , currentUser, onEdit , onDelete}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');

  // Derive unique years dynamically for the filter dropdown
  const availableYears = useMemo(() => {
    const years = new Set(students.map(s => s.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [students]);

  // Apply search and filters
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (currentUser.role === 'facultyCoordinator' && s.faculty !== currentUser.faculty) return false;
      if (currentUser.role === 'student' && s.createdBy !== currentUser.username) return false;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        s.firstName.toLowerCase().includes(searchLower) ||
        s.lastName.toLowerCase().includes(searchLower) ||
        s.company.toLowerCase().includes(searchLower) ||
        s.country.toLowerCase().includes(searchLower) ||
        s.position.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const matchesYear = yearFilter === 'ALL' || s.year.toString() === yearFilter.toString();

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [students, currentUser, searchTerm, statusFilter, yearFilter ]);

  const handleExportExcel = () => {
    // 1. เตรียมหัวตาราง
    const headers = ['Status', 'Prefix', 'First Name', 'Last Name', 'GPAX', 'English Test', 
      'Organization', 'Country', 'Position', 'Academic Year', 'Semester', 'Departure',
      'Start Date', 'End Date', 'Return Date', 'Faculty Scholarship (THB)', 'University Scholarship (THB)'];
    
    // 2. ดึงข้อมูลนักศึกษาที่กรองแล้วมาจัดรูปแบบ (ใส่เครื่องหมายคำพูดคร่อมกันตัวลูกน้ำในข้อความ)
    const rows = filteredStudents.map(s => [
      s.status, 
      s.prefix, 
      s.firstName, 
      s.lastName, 
      s.gpax, 
      s.engTest, 
      `"${s.company}"`, 
      `"${s.country}"`, 
      `"${s.position}"`, 
      s.year, 
      s.semester, 
      new Date(s.departureDate).toLocaleDateString('en-US'),
      new Date(s.startDate).toLocaleDateString('en-US'),
      new Date(s.endDate).toLocaleDateString('en-US'),
      new Date(s.returnDate).toLocaleDateString('en-US'),
      s.facultyScholarshipAmount || '0',
      s.uniScholarshipAmount || '0'
    ]);

    // 3. รวมเป็นข้อความ CSV
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // 4. สร้างไฟล์แล้วสั่งดาวน์โหลดอัตโนมัติ (ใส่ BOM \uFEFF เพื่อให้ Excel อ่านภาษาไทย/UTF-8 ได้ถูกต้อง)
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Student_Records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full print:border-none print:shadow-none print:overflow-visible">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap justify-between items-center gap-4 print:hidden">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FileSpreadsheet className="text-emerald-600" /> Spreadsheet: Student Records
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">Total {filteredStudents.length} records</span>
          <button onClick={handleExportExcel} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Printer size={16} /> Export to Export Excel
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Printer size={16} /> Export to PDF
          </button>
        </div>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="p-4 border-b border-slate-200 bg-white flex flex-col lg:flex-row gap-4 print:hidden">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, organization, country, position..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Filter className="text-slate-500" size={16} />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-sm text-slate-700 font-medium cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(STATUSES).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <GraduationCap className="text-slate-500" size={16} />
            <select 
              value={yearFilter} 
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-sm text-slate-700 font-medium cursor-pointer"
            >
              <option value="ALL">All Academic Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="hidden print:block p-4 mb-4 text-center border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">International Cooperative Education Student Report</h2>
        <p className="text-slate-600 mt-2">Printed on: {new Date().toLocaleDateString('en-US')}</p>
      </div>

      <div className="overflow-x-auto flex-1 print:overflow-visible">
        <table className="w-full text-sm text-left whitespace-nowrap print:whitespace-nowrap">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0 shadow-sm z-10 print:static print:shadow-none print:bg-slate-100">
            <tr>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Prifix</th>
              <th className="px-4 py-3 font-semibold">First Name</th>
              <th className="px-4 py-3 font-semibold">Last Name</th>
              <th className="px-4 py-3 font-semibold">GPAX</th>
              <th className="px-4 py-3 font-semibold">English Test</th>
              <th className="px-4 py-3 font-semibold">Organization</th>
              <th className="px-4 py-3 font-semibold">Country</th>
              <th className="px-4 py-3 font-semibold">Position</th>
              <th className="px-4 py-3 font-semibold text-center">Academic Year</th>
              <th className="px-4 py-3 font-semibold text-center">Semester</th>
              <th className="px-4 py-3 font-semibold">Departure</th>
              <th className="px-4 py-3 font-semibold">Start Date</th>
              <th className="px-4 py-3 font-semibold">End Date</th>
              <th className="px-4 py-3 font-semibold">Return</th>
              <th className="px-4 py-3 font-semibold text-center">Faculty Scholarship (THB)</th>
              <th className="px-4 py-3 font-semibold text-center">University Scholarship (THB)</th>
              {currentUser?.role === 'admin' && (
                <th className="px-4 py-3 font-semibold text-center print:hidden sticky right-0 bg-slate-100 border-l border-slate-200">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((s, i) => (
              <tr key={s.id} className={`hover:bg-blue-50/50 ${s.status === STATUSES.COMPLETE ? 'bg-purple-50/10' : ''}`}>
                <td className="px-4 py-3"><Badge status={s.status} /></td>
                <td className="px-4 py-3 text-slate-600">{s.prefix}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{s.firstName}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{s.lastName}</td>
                <td className="px-4 py-3 text-slate-600">{s.gpax}</td>
                <td className="px-4 py-3 text-slate-600">{s.engTest}</td>
                <td className="px-4 py-3 text-slate-700">{s.company}</td>
                <td className="px-4 py-3 text-slate-700">{s.country}</td>
                <td className="px-4 py-3 text-slate-700">{s.position}</td>
                <td className="px-4 py-3 text-center text-slate-600">{s.year}</td>
                <td className="px-4 py-3 text-center text-slate-600">{s.semester}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(s.departureDate).toLocaleDateString('en-US')}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(s.startDate).toLocaleDateString('en-US')}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(s.endDate).toLocaleDateString('en-US')}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(s.returnDate).toLocaleDateString('en-US')}</td>
                <td className="px-4 py-3 text-center text-slate-600">{s.facultyScholarshipAmount}</td>
                <td className="px-4 py-3 text-center text-slate-600">{s.uniScholarshipAmount}</td>
                <td className="px-4 py-3 font-bold text-yellow-500">{s.status === STATUSES.SUCCESS && (s.facScore || s.uniScore) ? `★ ${(s.facScore||0)+(s.uniScore||0)}` : '-'}</td>

                {/* 👉 กล่องใส่ปุ่มโหลดเอกสารในตาราง */}
                <td className="px-4 py-3 text-center print:hidden">
                  <div className="flex flex-col gap-1.5 items-center justify-center">
                    {s.facultyScholarshipFileName && (
                      <a href={s.facultyScholarshipFileName} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded flex items-center gap-1 transition-colors w-full justify-center border border-blue-200">
                        <Download size={12} /> Faculty
                      </a>
                    )}
                    {s.uniScholarshipFileName && (
                      <a href={s.uniScholarshipFileName} target="_blank" rel="noopener noreferrer" className="text-[11px] text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded flex items-center gap-1 transition-colors w-full justify-center border border-emerald-200">
                        <Download size={12} /> University
                      </a>
                    )}
                    {(!s.facultyScholarshipFileName && !s.uniScholarshipFileName ) && (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-2 text-center print:hidden sticky right-0 bg-white group-hover:bg-blue-50 border-l border-slate-100">
                  <div className="flex items-center justify-center gap-2">
                    
                    {/* เช็คสิทธิ์การแก้ไขด้วยฟังก์ชัน canEditRecord ที่สร้างไว้ */}
                    {canEditRecord(currentUser, s) ? (
                      <button onClick={() => onEdit(s)} title="Edit Record" className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 p-1.5 rounded transition-colors"><Edit size={16} /></button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200">Locked</span>
                    )}
                    {/* Admin เท่านั้นที่ลบได้ */}
                    {currentUser?.role === 'admin' && (
                    <button onClick={() => onDelete(s.id)} title="Delete Record" className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"><Trash2 size={16} /></button>
                    )}
                  </div>
                </td>
                
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="15" className="px-4 py-12 text-center text-slate-500">No student records found matching your criteria.</td>
              </tr>
            )}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserManagementView({ users, setUsers ,currentUser}) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [revokeSuccess, setRevokeSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const handleSaveUser = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const name = e.target.name.value;
    const role = e.target.role.value;
    const faculty = e.target.faculty.value;

    if (!username || !password || !name || !role || !faculty) {
      setError('Please complete all required fields.');
      setSuccess('');
      return;
    }

    const newUsers = { ...users }; // ก๊อปปี้ข้อมูลทั้งหมดออกมาก่อน

    if (editingUser) {
      // โหมดแก้ไข (EDIT)
      if (editingUser.username !== username) {
        // ถ้ามีการ "เปลี่ยน Username" ต้องเช็คก่อนว่า Username ใหม่ซ้ำกับคนอื่นในระบบไหม
        if (newUsers[username]) {
          setError('This new username already exists in the system.');
          setSuccess('');
          return;
        }
        // ลบ Key ชื่อเก่าทิ้ง เพื่อเตรียมใช้ชื่อใหม่
        delete newUsers[editingUser.username];
      }
      
      // อัปเดตข้อมูลลงไป
      newUsers[username] = { username, password, name, role, faculty};
      setSuccess(`Account '${username}' has been successfully updated.`);

    } else if(!editingUser){
      // โหมดสร้างใหม่ (ADD)
      if (users[username]) {
        setError('This username already exists in the system.');
        setSuccess('');
        return;
      }
      newUsers[username] = { username, password, name, role, faculty };
      setSuccess(`Account successfully created for ${role}.`);
    }

    setUsers({
      ...users,
      [username]: { username, password, name, role, faculty}
    });
    setEditingUser(null);
    setError('');
    setRevokeSuccess('');
    e.target.reset();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRemoveUser = (usernameToRemove) => {
    if (usernameToRemove === currentUser.username) {
      setError('Revoking administrator privileges is not permitted.');
      setSuccess('');
      setRevokeSuccess('');
      return;
    }

    const newUsers = { ...users };
    delete newUsers[usernameToRemove];
    setUsers(newUsers);
    setRevokeSuccess(`Account for ${usernameToRemove} has been successfully revoked.`);
    setError('');
    setSuccess('');
    e.target.reset();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setError('');
    setSuccess('');
    setRevokeSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* เปลี่ยน Title ฟอร์มตามโหมด */}
            {editingUser ? <Edit className="text-orange-500" /> : <UserPlus className="text-blue-500" />} 
            {editingUser ? `Edit Account : ${editingUser.username}` : 'Add New Account'}
          </div>
          {/* ปุ่ม Cancel จะโผล่มาเฉพาะตอนแก้ไข */}
          {editingUser && (
            <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 p-2 bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          )}
        </h3>
        {/* กล่อง Error (สีแดง แบบกระพริบ) */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 shadow-sm animate-pulse">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="font-bold">{error}</p>
          </div>
        )}
        {/* กล่อง เพิ่มข้อมูลสำเร็จ (สีเขียว) */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 shadow-sm">
            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
            <p className="font-bold">{success}</p>
          </div>
        )}
        {/* กล่อง ลบข้อมูลสำเร็จ (สีแดง) */}
        {revokeSuccess && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 shadow-sm">
            <CheckCircle2 size={20} className="text-red-600 flex-shrink-0" />
            <p className="font-bold">{revokeSuccess}</p>
          </div>
        )}

        {/* 👉 3. ใช้ key={editingUser?.username} บังคับฟอร์มล้างค่าตัวเองเมื่อกดเปลี่ยนคนแก้ไข และดึง defaultValue มาโชว์ */}
        <form key={editingUser ? editingUser.username : 'new-form'} onSubmit={handleSaveUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" name="name" defaultValue={editingUser?.name || ''} placeholder="e.g., Jane Doe" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input type="text" name="username" defaultValue={editingUser?.username || ''} placeholder="e.g., coordinator02" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" name="password" defaultValue={editingUser?.password || ''} placeholder="Create password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account Role</label>
            <select name="role" defaultValue={editingUser?.role || 'admin'} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="admin">Administrator</option>
              <option value="facultyCoordinator">FacultyCoordinator</option>
              <option value="universityCoordinator">UniversityCoordinator</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Faculty</label>
            <select name="faculty" defaultValue={editingUser?.faculty || ''} className="w-full px-3 py-2 border rounded-md bg-white" >
              <option value="">Select Faculty...</option>
              {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <button type="submit" className={`font-medium py-2 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 h-[42px] text-white ${editingUser ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {editingUser ? <><Save size={18} /> Update</> : <><UserPlus size={18} /> Add User</>}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Users className="text-emerald-600" /> Registered Users
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-6 py-3">Full Name</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Faculty</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.values(users).map(user => (
                <tr key={user.username} className={`transition-colors ${editingUser?.username === user.username ? 'bg-orange-50' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' : 
                      user.role === 'facultyCoordinator' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                      user.role === 'universityCoordinator' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                      'bg-orange-100 text-orange-800 border-orange-200'
                    }`}>
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.faculty || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEditClick(user)} className="text-orange-500 hover:text-orange-700 hover:bg-orange-100 px-3 py-1.5 rounded-md transition-colors inline-flex items-center gap-1">
                      <Edit size={16} /> Edit
                    </button>
                    {user.name !== currentUser.name ?(
                      <button 
                        onClick={() => handleRemoveUser(user.username)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Revoke
                      </button>
                    ):(
                      <span className="px-6 py-4 font-medium text-slate-400">- Current User -</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GuideView() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <BookOpen className="text-blue-600 w-8 h-8 flex-shrink-0" />
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">RMUTT CWIE International Guide</h2>
      </div>

      <div className="space-y-8 text-slate-700">
        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" /> 1. User Roles
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Coordinator:</strong> Responsible for registering new student records and viewing the master data list.</li>
            <li><strong>Administrator:</strong> Responsible for progressing, approving, or rejecting student requests, as well as managing user accounts.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-500" /> 2. Data Entry (Coordinator Only)
          </h3>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Navigate to the <strong>"New Registration"</strong> menu on the sidebar.</li>
            <li>Complete all required fields. Incomplete forms will trigger a validation error.</li>
            <li>Click the <strong>"Save and Submit"</strong> button at the bottom of the form.</li>
            <li>The initial status of a newly created record is always <Badge status={STATUSES.SUBMITTED} />.</li>
          </ol>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-orange-500" /> 3. Approval Workflow (Administrator Only)
          </h3>
          <p className="mb-2 ml-4">The approval process consists of two primary stages:</p>
          <ol className="list-decimal list-inside space-y-3 ml-4">
            <li>
              <strong>Acceptance Stage:</strong> Newly submitted requests are marked as "Submitted". The administrator must click <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border border-blue-200">Accept for In Progress</span> to advance the status.
            </li>
            <li>
              <strong>Decision Stage:</strong> Once In Progress, the administrator can select from three actions:
              <div className="mt-2 ml-6 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200">Approve</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded border border-yellow-200">Put on Hold</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded border border-red-200">Reject</span>
              </div>
            </li>
            <li>Administrators may revert a processed decision by clicking <strong>"Revert to In Progress"</strong>.</li>
          </ol>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-purple-500" /> 4. User Account Management (Administrator Only)
          </h3>
          <p className="ml-4">
            Administrators are authorized to create new accounts for both Coordinator and Administrators via the "User Management" tab. Furthermore, they can revoke existing Coordinator accounts (Revocation of other Administrators is strictly prohibited).
          </p>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-500" /> 5. Viewing All Records
          </h3>
          <p className="ml-4">
            All authorized personnel can access the <strong>"Spreadsheet"</strong> to view comprehensive student data in a spreadsheet format, facilitating efficient auditing and data export.
          </p>
        </section>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const isSuccess = onLogin(username, password);
    if (!isSuccess) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 pointer-events-none"></div>
          <GraduationCap size={56} className="mx-auto text-blue-400 mb-4 relative z-10" />
          <h2 className="text-2xl font-bold text-white relative z-10">RMUTT CWIE International</h2>
          <p className="text-slate-400 mt-2 text-sm relative z-10">
            Login in to manage student records
          </p>
        </div>
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 shadow-sm animate-pulse">
               <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
               <p className="text-red-700 font-bold text-sm leading-tight">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">USERNAME</label>
              <input 
                type="text" 
                name="username" 
                placeholder="Enter your username"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 focus:bg-white transition-colors" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PASSWORD</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 focus:bg-white transition-colors" 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-md flex justify-center items-center gap-2 mt-2"
            >
              LOGIN
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}