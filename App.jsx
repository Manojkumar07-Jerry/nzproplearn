import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import ProgramCatalog from './components/ProgramCatalog';
import SmartRecommendationWizard from './components/SmartRecommendationWizard';
import LearningPathVisualizer from './components/LearningPathVisualizer';
import StudentPortalSection from './components/StudentPortalSection';
import AudienceSection from './components/AudienceSection';
import ExecutionProcess from './components/ExecutionProcess';
import ProgramFormats from './components/ProgramFormats';
import EventsGallery from './components/EventsGallery';
import CertVerifyModal from './components/CertVerifyModal';
import BookingModal from './components/BookingModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import TrainerPortalModal from './components/TrainerPortalModal';
import PaymentModal from './components/PaymentModal';
import ProgramRegistrationModal from './components/ProgramRegistrationModal';
import CoursePlayerModal from './components/CoursePlayerModal';
import Footer from './components/Footer';

// NEW NEXUS AI & JOIN NEXUS GENZ COMPONENTS
import NexusAiModal from './components/NexusAiModal';
import JoinNexusGenzModal from './components/JoinNexusGenzModal';
import BecomeTrainerModal from './components/BecomeTrainerModal';
import InternshipCatalog from './components/InternshipCatalog';
import InternshipApplicationModal from './components/InternshipApplicationModal';
import { Sparkles } from 'lucide-react';

import { useAuth } from './context/AuthContext';
import { INITIAL_TRAINERS, INITIAL_EVENTS } from './data/programsData';

export default function App() {
  const { currentUser, userRole: fbUserRole, userProfile, logout } = useAuth();

  // State
  const [trainers] = useState(INITIAL_TRAINERS);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState(INITIAL_EVENTS);

  // Active Role fallback
  const [overrideRole, setOverrideRole] = useState(null);
  const activeRole = overrideRole || fbUserRole || (currentUser ? 'student' : null);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingInitialProgram, setBookingInitialProgram] = useState('');
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [certVerifyModalOpen, setCertVerifyModalOpen] = useState(false);
  const [initialCertVerifyId, setInitialCertVerifyId] = useState('');
  
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [trainerPortalOpen, setTrainerPortalOpen] = useState(false);
  const [studentPortalOpen, setStudentPortalOpen] = useState(false);
  
  // Nexus AI & Join Nexus GenZ Modals State
  const [nexusAiOpen, setNexusAiOpen] = useState(false);
  const [nexusAiCourseContext, setNexusAiCourseContext] = useState(null);
  
  const [joinGenzModalOpen, setJoinGenzModalOpen] = useState(false);
  const [becomeTrainerModalOpen, setBecomeTrainerModalOpen] = useState(false);
  
  const [internshipAppModalOpen, setInternshipAppModalOpen] = useState(false);
  const [selectedInternshipForApp, setSelectedInternshipForApp] = useState(null);

  // Direct UPI Payment & Registration Modal State
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [selectedRegistrationProgram, setSelectedRegistrationProgram] = useState(null);
  const [initialRegistrationRecord, setInitialRegistrationRecord] = useState(null);

  // Payment & Course Player modals
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentProgram, setSelectedPaymentProgram] = useState(null);

  const [coursePlayerOpen, setCoursePlayerOpen] = useState(false);
  const [selectedPlayerProgram, setSelectedPlayerProgram] = useState(null);
  const [selectedPlayerEnrollment, setSelectedPlayerEnrollment] = useState(null);

  const handleOpenRegistration = (programOrTitle, existingReg = null) => {
    if (typeof programOrTitle === 'string') {
      setSelectedRegistrationProgram({ title: programOrTitle, price: 'will update soon..' });
    } else {
      setSelectedRegistrationProgram(programOrTitle);
    }
    setInitialRegistrationRecord(existingReg);
    setRegistrationModalOpen(true);
  };

  const fetchData = useCallback(async () => {
    try {
      const bkRes = await fetch('/api/bookings');
      if (bkRes.ok) {
        const bkData = await bkRes.json();
        setBookings(bkData);
      }

      const evRes = await fetch('/api/events');
      if (evRes.ok) {
        const evData = await evRes.json();
        setEvents(evData);
      }
    } catch (_err) {
      console.log('Running on client fallback data layer');
    }
  }, []);

  // Initial Load & Refresh
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleOpenBooking = (programTitle = '') => {
    setBookingInitialProgram(programTitle);
    setBookingModalOpen(true);
  };

  const handleOpenCertVerifyWithId = (certId = '') => {
    setInitialCertVerifyId(certId);
    setCertVerifyModalOpen(true);
  };

  const handleOpenStudentPortal = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (fbUserRole && fbUserRole !== 'student') {
      window.alert('This portal is restricted to student accounts only.');
      return;
    }

    setStudentPortalOpen(true);
  };

  const handleOpenNexusAiWithContext = (programContext = null) => {
    setNexusAiCourseContext(programContext);
    setNexusAiOpen(true);
  };

  const handleApplyInternship = (internship) => {
    if (!currentUser || !currentUser.email) {
      setAuthModalOpen(true);
      return;
    }

    if (fbUserRole && fbUserRole !== 'student') {
      window.alert('Internship applications are available only to enrolled students.');
      return;
    }

    setSelectedInternshipForApp(internship);
    setInternshipAppModalOpen(true);
  };

  const handleLoginSuccess = (role, _user) => {
    const normalizedRole = String(role || fbUserRole || 'student').trim().toLowerCase();
    setOverrideRole(normalizedRole);

    if (normalizedRole === 'admin' || normalizedRole === 'superadmin') {
      setAdminDashboardOpen(true);
    } else if (normalizedRole === 'trainer') {
      setTrainerPortalOpen(true);
    } else {
      setStudentPortalOpen(true);
    }
  };

  const handleSignOut = () => {
    logout();
    setOverrideRole(null);
    setAdminDashboardOpen(false);
    setTrainerPortalOpen(false);
    setStudentPortalOpen(false);
  };

  const handleOpenAdmin = () => {
    if (!currentUser || fbUserRole !== 'admin') {
      window.alert('Access denied. Admin dashboard access is restricted to authorized administrator accounts.');
      return;
    }

    setAdminDashboardOpen(true);
  };

  const handleOpenPayment = (program) => {
    setSelectedPaymentProgram(program);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (enrollment) => {
    setPaymentModalOpen(false);
    fetchData();
    if (selectedPaymentProgram) {
      setSelectedPlayerProgram(selectedPaymentProgram);
      setSelectedPlayerEnrollment(enrollment);
      setCoursePlayerOpen(true);
    }
  };

  const handleOpenCoursePlayerFromPortal = (enrollment) => {
    setSelectedPlayerEnrollment(enrollment);
    setSelectedPlayerProgram({
      id: enrollment.programId,
      title: enrollment.programTitle,
      duration: '1 Month',
      price: enrollment.amountPaid || 'will update soon..'
    });
    setCoursePlayerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070A14] text-slate-100 selection:bg-cyan-500 selection:text-black relative">
      
      {/* Header Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenCertVerify={() => handleOpenCertVerifyWithId('')}
        userRole={activeRole}
        onOpenAdmin={handleOpenAdmin}
        onOpenStudentPortal={handleOpenStudentPortal}
        onSignOut={handleSignOut}
        onOpenNexusAi={() => handleOpenNexusAiWithContext(null)}
        onOpenJoinGenz={() => setJoinGenzModalOpen(true)}
        onOpenInternships={() => {
          const el = document.getElementById('internships');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onOpenCertVerify={() => handleOpenCertVerifyWithId('')}
        />

        {/* Introduction Philosophy */}
        <IntroSection />

        {/* Comprehensive Database-Driven Technology Programs Catalog */}
        <ProgramCatalog
          onOpenBooking={(title) => handleOpenBooking(title)}
          onOpenRegistration={handleOpenRegistration}
          userRole={activeRole}
          onAskNexusAi={(program) => handleOpenNexusAiWithContext(program)}
        />

        {/* Student Internship Catalog */}
        <InternshipCatalog
          onApplyInternship={handleApplyInternship}
        />

        {/* Smart Program Recommendation Wizard */}
        <SmartRecommendationWizard
          onSelectProgram={(program) => handleOpenRegistration(program)}
        />

        {/* Visual Step-by-Step Learning Paths */}
        <LearningPathVisualizer
          onSelectProgram={(program) => handleOpenRegistration(program)}
        />

        {/* Audience Cards (Who We Serve) */}
        <AudienceSection
          onOpenBooking={(title) => handleOpenBooking(title)}
        />

        {/* 5-Step Execution Process Timeline */}
        <ExecutionProcess />

        {/* 4 Program Formats */}
        <ProgramFormats
          onOpenBooking={(title) => handleOpenBooking(title)}
        />

        {/* Official Nexus GenZ Media Gallery */}
        <EventsGallery
          events={events}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenCertVerify={() => handleOpenCertVerifyWithId('')}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* FLOATING NEXUS AI BUTTON (BOTTOM RIGHT) */}
      <button
        onClick={() => handleOpenNexusAiWithContext(null)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-2xl shadow-cyan-500/40 hover:scale-110 transition-all border border-cyan-400/50 flex items-center gap-2 group animate-pulse"
      >
        <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
        <span>✦ Ask Nexus AI</span>
      </button>

      {/* MODALS */}

      {/* Nexus AI Assistant Modal */}
      <NexusAiModal
        isOpen={nexusAiOpen}
        onClose={() => {
          setNexusAiOpen(false);
          setNexusAiCourseContext(null);
        }}
        initialCourseContext={nexusAiCourseContext}
      />

      {/* Join Nexus GenZ Modal */}
      <JoinNexusGenzModal
        isOpen={joinGenzModalOpen}
        onClose={() => setJoinGenzModalOpen(false)}
        onOpenTrainerForm={() => setBecomeTrainerModalOpen(true)}
        onOpenInternships={() => {
          const el = document.getElementById('internships');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Become Trainer Modal */}
      <BecomeTrainerModal
        isOpen={becomeTrainerModalOpen}
        onClose={() => setBecomeTrainerModalOpen(false)}
      />

      {/* Internship Application Modal */}
      <InternshipApplicationModal
        isOpen={internshipAppModalOpen}
        onClose={() => {
          setInternshipAppModalOpen(false);
          setSelectedInternshipForApp(null);
        }}
        internship={selectedInternshipForApp}
      />

      {/* Direct UPI QR Payment & Program Registration Modal */}
      <ProgramRegistrationModal
        isOpen={registrationModalOpen}
        onClose={() => setRegistrationModalOpen(false)}
        program={selectedRegistrationProgram}
        initialRegistration={initialRegistrationRecord}
        onRegistrationSuccess={() => fetchData()}
      />

      {/* Certificate Verification System Modal */}
      <CertVerifyModal
        isOpen={certVerifyModalOpen}
        onClose={() => setCertVerifyModalOpen(false)}
        initialCertId={initialCertVerifyId}
      />

      {/* Institutional Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialProgram={bookingInitialProgram}
        onBookingSubmitted={() => fetchData()}
      />

      {/* Multi-Role Firebase Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Razorpay Secure Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        program={selectedPaymentProgram}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Interactive Student Course Player Modal */}
      <CoursePlayerModal
        isOpen={coursePlayerOpen}
        onClose={() => setCoursePlayerOpen(false)}
        program={selectedPlayerProgram}
        enrollment={selectedPlayerEnrollment}
        onOpenPayment={handleOpenPayment}
      />

      {/* Executive Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        onRefreshData={fetchData}
        trainers={trainers}
        bookings={bookings}
        events={events}
      />

      {/* Trainer Portal Modal */}
      <TrainerPortalModal
        isOpen={trainerPortalOpen}
        onClose={() => setTrainerPortalOpen(false)}
      />

      {/* Authenticated Student Portal Modal */}
      <StudentPortalSection
        isOpen={studentPortalOpen}
        onClose={() => setStudentPortalOpen(false)}
        userInfo={userProfile || { name: currentUser?.displayName, email: currentUser?.email }}
        onOpenBooking={(title) => handleOpenBooking(title)}
        onOpenCertVerify={(certId) => handleOpenCertVerifyWithId(certId)}
        onOpenCoursePlayer={handleOpenCoursePlayerFromPortal}
        onOpenRegistration={handleOpenRegistration}
        onOpenNexusAi={() => setNexusAiOpen(true)}
      />

    </div>
  );
}
