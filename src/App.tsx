import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LocationPage } from './pages/LocationPage';
import { LoginPage } from './pages/LoginPage';
import { RoleSelectPage } from './pages/RoleSelectPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SkillIntelligencePage } from './pages/SkillIntelligencePage';
import { ProfilePage } from './pages/ProfilePage';
import { AssessmentPage } from './pages/AssessmentPage';
import { LearningPage } from './pages/LearningPage';
import { CareerPage } from './pages/CareerPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { HelpGrievancePage } from './pages/HelpGrievancePage';

// Layouts
import { BeneficiaryLayout } from './components/layout/BeneficiaryLayout';
import { EmployerLayout } from './components/layout/EmployerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { NgoLayout } from './components/layout/NgoLayout';

// Employer Pages
import { EmployerDashboardPage } from './pages/employer/EmployerDashboardPage';
import { EmployerCompanyPage } from './pages/employer/EmployerCompanyPage';
import { EmployerJobsPage } from './pages/employer/EmployerJobsPage';
import { EmployerNewJobPage } from './pages/employer/EmployerNewJobPage';
import { EmployerCandidatesPage } from './pages/employer/EmployerCandidatesPage';
import { EmployerApplicationsPage } from './pages/employer/EmployerApplicationsPage';
import { EmployerAnalyticsPage } from './pages/employer/EmployerAnalyticsPage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminBeneficiariesPage } from './pages/admin/AdminBeneficiariesPage';
import { AdminSkillsPage } from './pages/admin/AdminSkillsPage';
import { AdminOccupationsPage } from './pages/admin/AdminOccupationsPage';
import { AdminTrainingPage } from './pages/admin/AdminTrainingPage';
import { AdminEmployersPage } from './pages/admin/AdminEmployersPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminLanguagesPage } from './pages/admin/AdminLanguagesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';
import { AdminSystemPage } from './pages/admin/AdminSystemPage';

// NGO Pages
import { NgoLandingPage } from './pages/ngo/NgoLandingPage';
import { NgoOnboardingSetupPage } from './pages/ngo/NgoOnboardingSetupPage';
import { NgoDashboardPage } from './pages/ngo/NgoDashboardPage';
import { NgoCommunityPage } from './pages/ngo/NgoCommunityPage';
import { NgoBeneficiariesPage } from './pages/ngo/NgoBeneficiariesPage';
import { NgoAssistedOnboardingPage } from './pages/ngo/NgoAssistedOnboardingPage';
import { NgoSkillsPage } from './pages/ngo/NgoSkillsPage';
import { NgoSkillGapsPage } from './pages/ngo/NgoSkillGapsPage';
import { NgoAssessmentsPage } from './pages/ngo/NgoAssessmentsPage';
import { NgoTrainingPage } from './pages/ngo/NgoTrainingPage';
import { NgoOpportunitiesPage } from './pages/ngo/NgoOpportunitiesPage';
import { NgoEmployersPage } from './pages/ngo/NgoEmployersPage';
import { NgoMatchingPage } from './pages/ngo/NgoMatchingPage';
import { NgoApplicationsPage } from './pages/ngo/NgoApplicationsPage';
import { NgoOutcomesPage } from './pages/ngo/NgoOutcomesPage';
import { NgoProgramsPage } from './pages/ngo/NgoProgramsPage';
import { NgoCasesPage } from './pages/ngo/NgoCasesPage';
import { NgoComplaintsPage } from './pages/ngo/NgoComplaintsPage';
import { NgoReportsPage } from './pages/ngo/NgoReportsPage';
import { NgoOrganizationPage } from './pages/ngo/NgoOrganizationPage';
import { NgoSettingsPage } from './pages/ngo/NgoSettingsPage';

// Route Guards
import { ProtectedRoute, RoleRoute, AdminRoute } from './components/auth/RouteGuards';
import { useAuth } from './hooks/useAuth';
import { useLocation } from './hooks/useLocation';
import { LanguageProvider } from './hooks/useLanguage';

import { UserProfileService } from './services/profile/userProfileService';

// Smart Root Redirect
const RootRedirect: React.FC = () => {
  const { isAuthenticated, session } = useAuth();
  const { location } = useLocation();

  if (isAuthenticated && session?.role) {
    if (session.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (session.role === 'EMPLOYER') return <Navigate to="/employer" replace />;
    if (session.role === 'NGO') return <Navigate to="/ngo" replace />;
    // Beneficiary / Job Seeker
    if (!UserProfileService.isProfileConfirmed()) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/career" replace />;
  }

  if (isAuthenticated) {
    return <Navigate to="/role-select" replace />;
  }

  if (location) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/location" replace />;
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Entry & Onboarding Foundation */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/language" element={<LocationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/phone" element={<LoginPage />} />
          <Route path="/auth/google" element={<LoginPage />} />

          {/* Dedicated NGO Landing & Entry Portal */}
          <Route path="/ngo-portal" element={<NgoLandingPage />} />

          {/* Role Selection (After Authentication) */}
          <Route
            path="/role-select"
            element={
              <ProtectedRoute>
                <RoleSelectPage />
              </ProtectedRoute>
            }
          />

          {/* Voice-First Beneficiary Onboarding Interview */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companion"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* NGO Organization Setup Wizard */}
          <Route
            path="/ngo/setup"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['NGO', 'ADMIN']}>
                  <NgoOnboardingSetupPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* 1. BENEFICIARY ECOSYSTEM ROUTES (Under BeneficiaryLayout) */}
          <Route
            element={
              <ProtectedRoute>
                <BeneficiaryLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/skills" element={<SkillIntelligencePage />} />
            <Route path="/skill-intelligence" element={<SkillIntelligencePage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/jobs" element={<OpportunitiesPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/progress" element={<CareerPage />} />
            <Route path="/help" element={<HelpGrievancePage />} />
          </Route>

          {/* 2. EMPLOYER ECOSYSTEM ROUTES (Under EmployerLayout) */}
          <Route
            path="/employer"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['EMPLOYER', 'ADMIN']}>
                  <EmployerLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<EmployerDashboardPage />} />
            <Route path="company" element={<EmployerCompanyPage />} />
            <Route path="jobs" element={<EmployerJobsPage />} />
            <Route path="jobs/new" element={<EmployerNewJobPage />} />
            <Route path="candidates" element={<EmployerCandidatesPage />} />
            <Route path="applications" element={<EmployerApplicationsPage />} />
            <Route path="interviews" element={<EmployerApplicationsPage />} />
            <Route path="analytics" element={<EmployerAnalyticsPage />} />
          </Route>

          {/* 3. NGO / COMMUNITY TEAM COMMAND CENTER (Under NgoLayout) */}
          <Route
            path="/ngo"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['NGO', 'ADMIN']}>
                  <NgoLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<NgoDashboardPage />} />
            <Route path="dashboard" element={<NgoDashboardPage />} />
            <Route path="community" element={<NgoCommunityPage />} />
            <Route path="beneficiaries" element={<NgoBeneficiariesPage />} />
            <Route path="onboarding" element={<NgoAssistedOnboardingPage />} />
            <Route path="skills" element={<NgoSkillsPage />} />
            <Route path="skill-gaps" element={<NgoSkillGapsPage />} />
            <Route path="assessments" element={<NgoAssessmentsPage />} />
            <Route path="training" element={<NgoTrainingPage />} />
            <Route path="training-programs" element={<NgoTrainingPage defaultTab="programs" />} />
            <Route path="opportunities" element={<NgoOpportunitiesPage />} />
            <Route path="employers" element={<NgoEmployersPage />} />
            <Route path="matching" element={<NgoMatchingPage />} />
            <Route path="applications" element={<NgoApplicationsPage />} />
            <Route path="outcomes" element={<NgoOutcomesPage />} />
            <Route path="programs" element={<NgoProgramsPage />} />
            <Route path="cases" element={<NgoCasesPage />} />
            <Route path="complaints" element={<NgoComplaintsPage />} />
            <Route path="reports" element={<NgoReportsPage />} />
            <Route path="organization" element={<NgoOrganizationPage />} />
            <Route path="settings" element={<NgoSettingsPage />} />
          </Route>

          {/* 4. ADMIN COMMAND CENTER ROUTES (Strict Server-Side Authorized Boundary) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="dashboard" element={<AdminOverviewPage />} />
            <Route path="beneficiaries" element={<AdminBeneficiariesPage />} />
            <Route path="skills" element={<AdminSkillsPage />} />
            <Route path="occupations" element={<AdminOccupationsPage />} />
            <Route path="training" element={<AdminTrainingPage />} />
            <Route path="employers" element={<AdminEmployersPage />} />
            <Route path="jobs" element={<AdminJobsPage />} />
            <Route path="applications" element={<AdminApplicationsPage />} />
            <Route path="complaints" element={<AdminComplaintsPage />} />
            <Route path="languages" element={<AdminLanguagesPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="audit" element={<AdminAuditPage />} />
            <Route path="system" element={<AdminSystemPage />} />
          </Route>

          {/* Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
