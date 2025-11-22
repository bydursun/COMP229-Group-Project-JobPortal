import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { jobAPI, applicationAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import JobCard from '../components/JobCard';
import { Plus, Briefcase, FileText, Users, TrendingUp, Eye, CreditCard as Edit, Trash2, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalJobs?: number;
  totalApplications?: number;
  pendingApplications?: number;
  acceptedApplications?: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      if (user.role === 'employer') {
        // Fetch employer data
        const jobsResponse = await jobAPI.getMyJobs({ limit: 5 });
        setRecentJobs(jobsResponse.data.data.jobs);
        setStats({
          totalJobs: jobsResponse.data.pagination.totalJobs
        });
      } else {
        // Fetch job seeker data
        const applicationsResponse = await applicationAPI.getMyApplications({ limit: 5 });
        const applications = applicationsResponse.data.data.applications;
        setRecentApplications(applications);
        
        const pendingCount = applications.filter((app: any) => app.status === 'pending').length;
        const acceptedCount = applications.filter((app: any) => app.status === 'accepted').length;
        
        setStats({
          totalApplications: applicationsResponse.data.pagination.totalApplications,
          pendingApplications: pendingCount,
          acceptedApplications: acceptedCount
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'reviewing':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'shortlisted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'accepted':
        return 'bg-green-100 text-green-900';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'employer' 
              ? 'Manage your job postings and track applications' 
              : 'Track your applications and discover new opportunities'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user.role === 'employer' ? (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Views</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.pendingApplications || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Accepted</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.acceptedApplications || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.totalApplications ? 
                        Math.round((stats.acceptedApplications || 0) / stats.totalApplications * 100) : 0
                      }%
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {user.role === 'employer' ? 'Recent Job Postings' : 'Recent Applications'}
                </h2>
              </div>
              <div className="p-6">
                {user.role === 'employer' ? (
                  recentJobs.length > 0 ? (
                    <div className="space-y-4">
                      {recentJobs.map((job: any) => (
                        <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{job.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No job postings yet</p>
                      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Post Your First Job
                      </button>
                    </div>
                  )
                ) : (
                  recentApplications.length > 0 ? (
                    <div className="space-y-4">
                      {recentApplications.map((application: any) => (
                        <div key={application._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {application.jobId?.title || 'Job Title'}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {application.jobId?.company || 'Company'}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                Applied {new Date(application.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {getStatusIcon(application.status)}
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No applications yet</p>
                      <a 
                        href="/jobs"
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                      >
                        Browse Jobs
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                {user.role === 'employer' ? (
                  <>
                    <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <Users className="h-4 w-4 mr-2" />
                      View Applications
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analytics
                    </button>
                  </>
                ) : (
                  <>
                    <a 
                      href="/jobs"
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </a>
                    <a
                      href="/profile"
                      className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Update Resume
                    </a>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Job Alerts
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Profile Status</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <span className="text-sm font-medium text-gray-900">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>✓ Basic Information</p>
                    <p>✓ Contact Details</p>
                    {user.role === 'jobseeker' ? (
                      <>
                        <p>○ Resume Upload</p>
                        <p>○ Skills & Experience</p>
                      </>
                    ) : (
                      <>
                        <p>✓ Company Information</p>
                        <p>○ Company Description</p>
                      </>
                    )}
                  </div>
                  <a
                    href="/profile"
                    className="block text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Complete Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;