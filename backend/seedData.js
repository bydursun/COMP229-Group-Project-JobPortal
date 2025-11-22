import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import JobPosting from './models/JobPosting.js';
import Application from './models/Application.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (only when seeding demo accounts)
    if (process.env.SEED_DEMO_ACCOUNTS === 'true') {
      await User.deleteMany({});
      await JobPosting.deleteMany({});
      console.log('Cleared existing data for demo seeding');
    } else {
      console.log('SEED_DEMO_ACCOUNTS not enabled; skipping destructive reset and demo user creation');
    }

    // Environment-driven demo passwords (fallback placeholders)
    const demoJobSeekerPassword = process.env.DEMO_JOBSEEKER_PASSWORD || 'changeMeJobSeeker!';
    const demoEmployerPassword = process.env.DEMO_EMPLOYER_PASSWORD || 'changeMeEmployer!';

    // Create sample users (only if enabled)
    const sampleUsers = process.env.SEED_DEMO_ACCOUNTS === 'true' ? [
      {
        name: 'John Doe',
        email: 'jobseeker@demo.com',
        password: demoJobSeekerPassword,
        role: 'jobseeker',
        phone: '+1-416-555-0123',
        location: 'Toronto, ON',
        bio: 'Experienced software developer with 5+ years in full-stack development. Passionate about creating efficient and scalable web applications.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'Git'],
        resumeLink: 'https://example.com/john-doe-resume.pdf'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@demo.com',
        password: demoJobSeekerPassword,
        role: 'jobseeker',
        phone: '+1-647-555-0456',
        location: 'Vancouver, BC',
        bio: 'Creative UI/UX designer with expertise in modern design principles and user-centered design approaches.',
        skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
        resumeLink: 'https://example.com/sarah-johnson-portfolio.pdf'
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@demo.com',
        password: demoJobSeekerPassword,
        role: 'jobseeker',
        phone: '+1-604-555-0789',
        location: 'Montreal, QC',
        bio: 'Data scientist with strong background in machine learning and statistical analysis. Love turning data into actionable insights.',
        skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'R', 'TensorFlow'],
        resumeLink: 'https://example.com/mike-chen-resume.pdf'
      },
      {
        name: 'Emily Rodriguez',
        email: 'employer@demo.com',
        password: demoEmployerPassword,
        role: 'employer',
        company: 'TechCorp Solutions',
        phone: '+1-416-555-1000',
        location: 'Toronto, ON',
        bio: 'Leading technology company focused on innovative software solutions for enterprise clients.'
      },
      {
        name: 'David Kim',
        email: 'david.kim@innovatetech.com',
        password: demoEmployerPassword,
        role: 'employer',
        company: 'InnovateTech Inc.',
        phone: '+1-604-555-2000',
        location: 'Vancouver, BC',
        bio: 'Fast-growing startup specializing in AI and machine learning solutions for healthcare industry.'
      },
      {
        name: 'Lisa Thompson',
        email: 'lisa.thompson@designstudio.com',
        password: demoEmployerPassword,
        role: 'employer',
        company: 'Creative Design Studio',
        phone: '+1-647-555-3000',
        location: 'Toronto, ON',
        bio: 'Award-winning design agency creating beautiful and functional digital experiences for brands worldwide.'
      }
    ] : [];

    // Create users only if demo seeding enabled
    const users = [];
    if (process.env.SEED_DEMO_ACCOUNTS === 'true') {
      for (const userData of sampleUsers) {
        const user = await User.create(userData);
        users.push(user);
        console.log(`Created user: ${user.name} (${user.role})`);
      }
    }

    // Get employer users for job creation (skip if none created)
    const employers = users.filter(user => user.role === 'employer');
    if (process.env.SEED_DEMO_ACCOUNTS !== 'true') {
      console.log('Skipping job creation because demo accounts not seeded. Set SEED_DEMO_ACCOUNTS=true to enable.');
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      return;
    }

    // Create sample job postings
    const sampleJobs = [
      {
        title: 'Senior Full Stack Developer',
        description: `We are seeking a talented Senior Full Stack Developer to join our dynamic team at TechCorp Solutions. 

Key Responsibilities:
• Develop and maintain web applications using modern technologies
• Collaborate with cross-functional teams to define and implement new features
• Write clean, maintainable, and efficient code
• Participate in code reviews and mentor junior developers
• Troubleshoot and debug applications

What We Offer:
• Competitive salary and comprehensive benefits package
• Flexible work arrangements including remote work options
• Professional development opportunities and conference attendance
• Modern office space with state-of-the-art equipment
• Collaborative and inclusive work environment`,
        company: 'TechCorp Solutions',
        location: 'Toronto, ON',
        jobType: 'full-time',
        experience: 'senior',
        salary: {
          min: 85000,
          max: 120000
        },
        requirements: [
          '5+ years of experience in full-stack development',
          'Strong proficiency in JavaScript, React, and Node.js',
          'Experience with MongoDB or other NoSQL databases',
          'Knowledge of RESTful API design and implementation',
          'Familiarity with Git version control',
          'Strong problem-solving and communication skills'
        ],
        benefits: [
          'Health and dental insurance',
          'Flexible working hours',
          'Professional development budget',
          'Stock options',
          'Gym membership',
          'Free lunch and snacks'
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js', 'Git'],
        applicationDeadline: new Date('2024-12-31'),
        createdBy: employers[0]._id
      },
      {
        title: 'UI/UX Designer',
        description: `Creative Design Studio is looking for a passionate UI/UX Designer to create exceptional user experiences for our diverse client portfolio.

Key Responsibilities:
• Design intuitive and engaging user interfaces for web and mobile applications
• Conduct user research and usability testing
• Create wireframes, prototypes, and high-fidelity mockups
• Collaborate with developers to ensure design implementation
• Maintain and evolve design systems

What We Offer:
• Creative freedom and opportunity to work on diverse projects
• Collaborative team environment with experienced designers
• Latest design tools and software
• Flexible schedule and remote work options
• Competitive compensation and benefits`,
        company: 'Creative Design Studio',
        location: 'Toronto, ON',
        jobType: 'full-time',
        experience: 'mid',
        salary: {
          min: 60000,
          max: 80000
        },
        requirements: [
          '3+ years of UI/UX design experience',
          'Proficiency in Figma, Sketch, or Adobe XD',
          'Strong portfolio demonstrating design process',
          'Understanding of user-centered design principles',
          'Experience with prototyping and user testing',
          'Knowledge of HTML/CSS is a plus'
        ],
        benefits: [
          'Health and dental coverage',
          'Flexible work schedule',
          'Creative workspace',
          'Professional development opportunities',
          'Team building events'
        ],
        skills: ['UI/UX Design', 'Figma', 'Prototyping', 'User Research', 'Adobe Creative Suite'],
        applicationDeadline: new Date('2024-12-15'),
        createdBy: employers[2]._id
      },
      {
        title: 'Data Scientist',
        description: `InnovateTech Inc. is seeking a skilled Data Scientist to join our AI research team and help develop cutting-edge machine learning solutions for healthcare applications.

Key Responsibilities:
• Analyze large datasets to extract meaningful insights
• Develop and implement machine learning models
• Collaborate with healthcare professionals to understand domain requirements
• Present findings to stakeholders and technical teams
• Stay current with latest developments in AI and machine learning

What We Offer:
• Opportunity to work on impactful healthcare solutions
• Access to large-scale datasets and computing resources
• Collaborative research environment
• Competitive salary and equity package
• Comprehensive benefits and flexible work arrangements`,
        company: 'InnovateTech Inc.',
        location: 'Vancouver, BC',
        jobType: 'full-time',
        experience: 'mid',
        salary: {
          min: 90000,
          max: 130000
        },
        requirements: [
          'Master\'s degree in Data Science, Statistics, or related field',
          '3+ years of experience in data science or machine learning',
          'Strong programming skills in Python and R',
          'Experience with ML frameworks (TensorFlow, PyTorch, scikit-learn)',
          'Knowledge of SQL and database systems',
          'Strong analytical and problem-solving skills'
        ],
        benefits: [
          'Comprehensive health benefits',
          'Stock options',
          'Flexible work arrangements',
          'Conference and training budget',
          'Research publication opportunities'
        ],
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'R', 'Statistics'],
        applicationDeadline: new Date('2025-01-15'),
        createdBy: employers[1]._id
      },
      {
        title: 'Frontend Developer',
        description: `Join our team as a Frontend Developer and help create beautiful, responsive web applications that delight our users.

Key Responsibilities:
• Develop responsive web applications using React and modern JavaScript
• Implement pixel-perfect designs from UI/UX team
• Optimize applications for maximum speed and scalability
• Collaborate with backend developers to integrate APIs
• Ensure cross-browser compatibility and accessibility

What We Offer:
• Modern tech stack and development tools
• Mentorship from senior developers
• Opportunity to work on diverse projects
• Flexible work environment
• Competitive compensation package`,
        company: 'TechCorp Solutions',
        location: 'Toronto, ON',
        jobType: 'full-time',
        experience: 'entry',
        salary: {
          min: 55000,
          max: 75000
        },
        requirements: [
          '2+ years of frontend development experience',
          'Strong proficiency in React and JavaScript (ES6+)',
          'Experience with HTML5, CSS3, and responsive design',
          'Knowledge of version control (Git)',
          'Understanding of RESTful APIs',
          'Attention to detail and passion for user experience'
        ],
        benefits: [
          'Health and dental insurance',
          'Professional development opportunities',
          'Flexible working hours',
          'Modern office environment',
          'Team events and activities'
        ],
        skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'Responsive Design'],
        applicationDeadline: new Date('2024-12-20'),
        createdBy: employers[0]._id
      },
      {
        title: 'Product Designer',
        description: `We're looking for a creative Product Designer to help shape the future of our digital products and create exceptional user experiences.

Key Responsibilities:
• Lead design projects from concept to implementation
• Create user journey maps and design systems
• Conduct user research and usability testing
• Collaborate with product managers and developers
• Advocate for user-centered design principles

What We Offer:
• Opportunity to impact product direction
• Work with cutting-edge design tools
• Collaborative and creative team environment
• Professional growth opportunities
• Competitive salary and benefits`,
        company: 'InnovateTech Inc.',
        location: 'Vancouver, BC',
        jobType: 'full-time',
        experience: 'senior',
        salary: {
          min: 80000,
          max: 110000
        },
        requirements: [
          '5+ years of product design experience',
          'Strong portfolio showcasing design process',
          'Expertise in Figma, Sketch, and prototyping tools',
          'Experience with design systems and component libraries',
          'Understanding of frontend development principles',
          'Excellent communication and presentation skills'
        ],
        benefits: [
          'Comprehensive benefits package',
          'Equity participation',
          'Flexible work arrangements',
          'Design conference attendance',
          'Creative workspace'
        ],
        skills: ['Product Design', 'Figma', 'Design Systems', 'User Research', 'Prototyping'],
        applicationDeadline: new Date('2025-01-10'),
        createdBy: employers[1]._id
      },
      {
        title: 'Junior Web Developer',
        description: `Perfect opportunity for a recent graduate or career changer to start their journey in web development with our supportive team.

Key Responsibilities:
• Assist in developing and maintaining web applications
• Learn and apply best practices in web development
• Participate in code reviews and team meetings
• Work on bug fixes and feature enhancements
• Contribute to documentation and testing

What We Offer:
• Comprehensive mentorship program
• Structured learning path
• Hands-on experience with modern technologies
• Supportive team environment
• Growth opportunities within the company`,
        company: 'Creative Design Studio',
        location: 'Toronto, ON',
        jobType: 'full-time',
        experience: 'entry',
        salary: {
          min: 45000,
          max: 60000
        },
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          'Basic knowledge of HTML, CSS, and JavaScript',
          'Familiarity with at least one modern framework (React, Vue, or Angular)',
          'Understanding of version control (Git)',
          'Strong willingness to learn and grow',
          'Good communication and teamwork skills'
        ],
        benefits: [
          'Health benefits',
          'Mentorship program',
          'Learning and development budget',
          'Flexible schedule',
          'Team building activities'
        ],
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
        applicationDeadline: new Date('2024-12-25'),
        createdBy: employers[2]._id
      },
      {
        title: 'DevOps Engineer',
        description: `Join our infrastructure team as a DevOps Engineer and help build scalable, reliable systems that power our applications.

Key Responsibilities:
• Design and maintain CI/CD pipelines
• Manage cloud infrastructure on AWS/Azure
• Implement monitoring and alerting systems
• Automate deployment and scaling processes
• Ensure security and compliance standards

What We Offer:
• Work with cutting-edge cloud technologies
• Opportunity to architect scalable systems
• Collaborative engineering culture
• Competitive compensation and benefits
• Professional development support`,
        company: 'TechCorp Solutions',
        location: 'Toronto, ON',
        jobType: 'full-time',
        experience: 'mid',
        salary: {
          min: 80000,
          max: 110000
        },
        requirements: [
          '3+ years of DevOps or infrastructure experience',
          'Strong knowledge of AWS or Azure cloud platforms',
          'Experience with containerization (Docker, Kubernetes)',
          'Proficiency in scripting languages (Python, Bash)',
          'Knowledge of Infrastructure as Code (Terraform, CloudFormation)',
          'Understanding of monitoring tools (Prometheus, Grafana)'
        ],
        benefits: [
          'Comprehensive health coverage',
          'Stock options',
          'Flexible work arrangements',
          'Technology allowance',
          'Conference attendance'
        ],
        skills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Terraform', 'CI/CD'],
        applicationDeadline: new Date('2025-01-05'),
        createdBy: employers[0]._id
      },
      {
        title: 'Marketing Coordinator',
        description: `We're seeking a creative Marketing Coordinator to help promote our design services and build our brand presence.

Key Responsibilities:
• Develop and execute marketing campaigns
• Manage social media accounts and content creation
• Coordinate events and promotional activities
• Analyze marketing metrics and performance
• Support business development initiatives

What We Offer:
• Creative and dynamic work environment
• Opportunity to work with diverse clients
• Professional growth in marketing
• Flexible schedule and remote work options
• Competitive salary and benefits`,
        company: 'Creative Design Studio',
        location: 'Toronto, ON',
        jobType: 'full-time',
        experience: 'entry',
        salary: {
          min: 40000,
          max: 55000
        },
        requirements: [
          'Bachelor\'s degree in Marketing, Communications, or related field',
          '1-2 years of marketing experience',
          'Strong written and verbal communication skills',
          'Experience with social media platforms',
          'Knowledge of digital marketing tools',
          'Creative thinking and attention to detail'
        ],
        benefits: [
          'Health and dental coverage',
          'Professional development opportunities',
          'Flexible work schedule',
          'Creative workspace',
          'Team events'
        ],
        skills: ['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics', 'Communication'],
        applicationDeadline: new Date('2024-12-30'),
        createdBy: employers[2]._id
      }
    ];

    // Create job postings and retain references
    const jobDocs = [];
    for (const jobData of sampleJobs) {
      const job = await JobPosting.create(jobData);
      jobDocs.push(job);
      console.log(`Created job: ${job.title} at ${job.company}`);
    }

    // Prepare sample applications (each jobseeker applies to a couple of jobs)
    const jobseekers = users.filter(u => u.role === 'jobseeker');
    const sampleApplications = [
      {
        userId: jobseekers[0]._id,
        jobId: jobDocs[0]._id,
        coverLetter: 'I am very interested in this senior full stack role and bring strong experience in React/Node.'
      },
      {
        userId: jobseekers[0]._id,
        jobId: jobDocs[3]._id,
        coverLetter: 'Frontend development is my passion; I build performant React interfaces.'
      },
      {
        userId: jobseekers[1]._id,
        jobId: jobDocs[1]._id,
        coverLetter: 'My design background and user research skills align well with this UI/UX position.'
      },
      {
        userId: jobseekers[2]._id,
        jobId: jobDocs[2]._id,
        coverLetter: 'I have production ML experience and am excited about healthcare data science.'
      },
      {
        userId: jobseekers[2]._id,
        jobId: jobDocs[6]._id,
        coverLetter: 'DevOps collaboration improves ML deployment; interested in cross-functional work.'
      }
    ];

    for (const appData of sampleApplications) {
      try {
        const application = await Application.create(appData);
        console.log(`Created application: user ${application.userId} -> job ${application.jobId}`);
      } catch (e) {
        console.warn('Skipping application (possibly duplicate):', e.message);
      }
    }

    console.log('\n✅ Sample data created successfully!');
    console.log(`✅ Seeded ${users.length} users, ${jobDocs.length} jobs, ${sampleApplications.length} applications`);
    console.log('\n📧 Demo Login Credentials:');
    console.log('Demo credentials (do NOT use in production):');
    console.log(`Job Seeker: jobseeker@demo.com / ${process.env.DEMO_JOBSEEKER_PASSWORD ? '[HIDDEN ENV VALUE]' : 'changeMeJobSeeker!'}`);
    console.log(`Employer: employer@demo.com / ${process.env.DEMO_EMPLOYER_PASSWORD ? '[HIDDEN ENV VALUE]' : 'changeMeEmployer!'}`);
    console.log('\n🎯 Additional Test Accounts:');
    console.log('sarah.johnson@demo.com / [USE DEMO_JOBSEEKER_PASSWORD] (Job Seeker)');
    console.log('mike.chen@demo.com / [USE DEMO_JOBSEEKER_PASSWORD] (Job Seeker)');
    console.log('david.kim@innovatetech.com / [USE DEMO_EMPLOYER_PASSWORD] (Employer)');
    console.log('lisa.thompson@designstudio.com / [USE DEMO_EMPLOYER_PASSWORD] (Employer)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();