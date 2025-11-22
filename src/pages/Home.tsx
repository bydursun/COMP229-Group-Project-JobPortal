import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Briefcase, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { number: '10,000+', label: 'Active Jobs', icon: Briefcase },
    { number: '50,000+', label: 'Professionals', icon: Users },
    { number: '95%', label: 'Success Rate', icon: Award },
  ];

  const features = [
    {
      title: 'Smart Job Matching',
      description: 'Our AI-powered system matches you with jobs that perfectly fit your skills and preferences.',
      icon: Search,
    },
    {
      title: 'Professional Network',
      description: 'Connect with industry leaders and expand your professional network.',
      icon: Users,
    },
    {
      title: 'Career Growth',
      description: 'Access resources and tools to accelerate your career development.',
      icon: Award,
    },
  ];

  const benefits = [
    'Free job search and application',
    'Personalized job recommendations',
    'Resume builder and optimization',
    'Interview preparation resources',
    'Salary insights and negotiation tips',
    '24/7 customer support'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in-up">
              Find Your Dream
              <span className="block bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mt-2">Career Today</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with top employers and discover opportunities that match your skills. 
              Your next career move starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="group relative bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-110 shadow-2xl overflow-hidden"
                  >
                    <span className="relative z-10">Get Started Free</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                  <Link
                    to="/jobs"
                    className="group relative border-2 border-white text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl overflow-hidden"
                  >
                    <span className="relative z-10">Browse Jobs</span>
                  </Link>
                </>
              ) : (
                <Link
                  to={user.role === 'jobseeker' ? '/jobs' : '/dashboard'}
                  className="group relative bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-110 shadow-2xl inline-flex items-center overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    {user.role === 'jobseeker' ? 'Browse Jobs' : 'Go to Dashboard'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="group flex flex-col items-center transform hover:scale-110 transition-all duration-300">
                  <div className="bg-white/20 p-4 rounded-2xl mb-3 group-hover:bg-white/30 transition-colors">
                    <stat.icon className="h-10 w-10 text-blue-200 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-4xl font-extrabold mb-2 group-hover:scale-110 transition-transform">{stat.number}</div>
                  <div className="text-blue-100 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Why Choose JobPortal?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              We're committed to making your job search efficient, effective, and successful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group glass-effect rounded-2xl p-10 shadow-premium hover:shadow-premium-hover transition-all duration-500 transform hover:-translate-y-4 animate-fade-in-up border border-white/20"
                style={{animationDelay: `${index * 150}ms`}}
              >
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <feature.icon className="h-10 w-10 text-white animate-pulse" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 leading-tight">
                Everything You Need to Land Your Dream Job
              </h2>
              <p className="text-xl text-gray-700 mb-10 font-medium leading-relaxed">
                Our comprehensive platform provides all the tools and resources you need 
                to succeed in your job search journey.
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="flex items-center group animate-slide-up"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <div className="relative">
                      <CheckCircle className="h-7 w-7 text-green-500 mr-4 flex-shrink-0 group-hover:text-green-600 transition-colors" />
                      <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                    </div>
                    <span className="text-gray-800 text-lg font-medium group-hover:text-blue-600 transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-in-up animation-delay-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative glass-effect rounded-3xl p-10 text-white shadow-premium border border-white/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <h3 className="text-3xl font-extrabold mb-4 relative z-10">Ready to Start?</h3>
                <p className="mb-8 text-lg relative z-10 text-blue-50">
                  Join thousands of professionals who have found their perfect job through our platform.
                </p>
                {!user ? (
                  <Link
                    to="/register"
                    className="group relative bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 inline-flex items-center shadow-xl hover:shadow-2xl transform hover:scale-105 z-10"
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="group relative bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 inline-flex items-center shadow-xl hover:shadow-2xl transform hover:scale-105 z-10"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 animate-fade-in-up">
            Start Your Career Journey Today
          </h2>
          <p className="text-2xl text-blue-100 mb-12 font-medium leading-relaxed animate-fade-in-up animation-delay-200">
            Don't wait for opportunities to come to you. Take control of your career and 
            discover what's possible with JobPortal.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-300">
            <Link
              to="/jobs"
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 shadow-2xl overflow-hidden"
            >
              <span className="relative z-10">Browse All Jobs</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </Link>
            {!user && (
              <Link
                to="/register"
                className="group relative border-2 border-white text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Sign Up Now
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;