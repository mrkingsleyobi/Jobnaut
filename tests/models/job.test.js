// Test suite for Job model

const jobModel = require('../../src/models/job');

// Mock Prisma Client
jest.mock('../../src/db/client', () => {
  const mockPrisma = {
    job: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };
  return mockPrisma;
});

const prisma = require('../../src/db/client');

describe('Job Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createJob', () => {
    it('should create a new job', async () => {
      // Arrange
      const jobData = {
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        description: 'Exciting opportunity for a software engineer',
        skills: ['JavaScript', 'React'],
        postedDate: new Date(),
        applicationLink: 'https://example.com/apply'
      };

      const mockCreatedJob = {
        id: 1,
        ...jobData,
        skills: JSON.stringify(jobData.skills)
      };

      prisma.job.create.mockResolvedValue(mockCreatedJob);

      // Act
      const result = await jobModel.createJob(jobData);

      // Assert
      expect(prisma.job.create).toHaveBeenCalledWith({
        data: {
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          description: jobData.description,
          skills: JSON.stringify(jobData.skills),
          postedDate: jobData.postedDate,
          applicationLink: jobData.applicationLink,
        },
      });
      expect(result).toEqual(mockCreatedJob);
    });
  });

  describe('getJobById', () => {
    it('should get a job by ID', async () => {
      // Arrange
      const jobId = 1;
      const mockJob = {
        id: jobId,
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        description: 'Exciting opportunity',
        skills: JSON.stringify(['JavaScript', 'React']),
        postedDate: new Date(),
        applicationLink: 'https://example.com/apply'
      };

      prisma.job.findUnique.mockResolvedValue(mockJob);

      // Act
      const result = await jobModel.getJobById(jobId);

      // Assert
      expect(prisma.job.findUnique).toHaveBeenCalledWith({
        where: { id: jobId },
      });
      expect(result).toEqual(mockJob);
    });

    it('should return null if job not found', async () => {
      // Arrange
      const jobId = 999;
      prisma.job.findUnique.mockResolvedValue(null);

      // Act
      const result = await jobModel.getJobById(jobId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getAllJobs', () => {
    it('should get all jobs with pagination', async () => {
      // Arrange
      const mockJobs = [
        {
          id: 1,
          title: 'Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          description: 'Exciting opportunity',
          skills: JSON.stringify(['JavaScript', 'React']),
          postedDate: new Date(),
          applicationLink: 'https://example.com/apply/1'
        },
        {
          id: 2,
          title: 'Product Manager',
          company: 'Startup Inc',
          location: 'New York, NY',
          description: 'Lead product development',
          skills: JSON.stringify(['Product Management', 'Agile']),
          postedDate: new Date(),
          applicationLink: 'https://example.com/apply/2'
        }
      ];

      const mockTotal = 2;

      prisma.job.findMany.mockResolvedValue(mockJobs);
      prisma.job.count.mockResolvedValue(mockTotal);

      // Act
      const result = await jobModel.getAllJobs(1, 10);

      // Assert
      expect(prisma.job.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: {
          postedDate: 'desc',
        },
      });
      expect(prisma.job.count).toHaveBeenCalled();
      expect(result).toEqual({
        jobs: mockJobs,
        total: mockTotal,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('searchJobs', () => {
    it('should search jobs by query', async () => {
      // Arrange
      const query = 'software';
      const mockJobs = [
        {
          id: 1,
          title: 'Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          description: 'Exciting software opportunity',
          skills: JSON.stringify(['JavaScript', 'React']),
          postedDate: new Date(),
          applicationLink: 'https://example.com/apply/1'
        }
      ];

      const mockTotal = 1;

      prisma.job.findMany.mockResolvedValue(mockJobs);
      prisma.job.count.mockResolvedValue(mockTotal);

      // Act
      const result = await jobModel.searchJobs(query, 1, 10);

      // Assert
      expect(prisma.job.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 10,
        orderBy: {
          postedDate: 'desc',
        },
      });
      expect(prisma.job.count).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
      });
      expect(result).toEqual({
        jobs: mockJobs,
        total: mockTotal,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('updateJob', () => {
    it('should update a job', async () => {
      // Arrange
      const jobId = 1;
      const updateData = {
        title: 'Senior Software Engineer',
        skills: ['JavaScript', 'React', 'Node.js']
      };

      const mockUpdatedJob = {
        id: jobId,
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        description: 'Exciting opportunity',
        skills: JSON.stringify(['JavaScript', 'React', 'Node.js']),
        postedDate: new Date(),
        applicationLink: 'https://example.com/apply'
      };

      prisma.job.update.mockResolvedValue(mockUpdatedJob);

      // Act
      const result = await jobModel.updateJob(jobId, updateData);

      // Assert
      expect(prisma.job.update).toHaveBeenCalledWith({
        where: { id: jobId },
        data: {
          title: updateData.title,
          skills: JSON.stringify(updateData.skills),
        },
      });
      expect(result).toEqual(mockUpdatedJob);
    });
  });

  describe('deleteJob', () => {
    it('should delete a job', async () => {
      // Arrange
      const jobId = 1;
      const mockDeletedJob = {
        id: jobId,
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        description: 'Exciting opportunity',
        skills: JSON.stringify(['JavaScript', 'React']),
        postedDate: new Date(),
        applicationLink: 'https://example.com/apply'
      };

      prisma.job.delete.mockResolvedValue(mockDeletedJob);

      // Act
      const result = await jobModel.deleteJob(jobId);

      // Assert
      expect(prisma.job.delete).toHaveBeenCalledWith({
        where: { id: jobId },
      });
      expect(result).toEqual(mockDeletedJob);
    });
  });

  describe('getJobsBySkills', () => {
    it('should get jobs by skills', async () => {
      // Arrange
      const skills = ['JavaScript', 'React'];
      const mockJobs = [
        {
          id: 1,
          title: 'Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          description: 'Exciting opportunity',
          skills: JSON.stringify(['JavaScript', 'React', 'Node.js']),
          postedDate: new Date(),
          applicationLink: 'https://example.com/apply/1'
        }
      ];

      const mockTotal = 1;

      prisma.job.findMany.mockResolvedValue(mockJobs);
      prisma.job.count.mockResolvedValue(mockTotal);

      // Act
      const result = await jobModel.getJobsBySkills(skills, 1, 10);

      // Assert
      // Check that the OR conditions were created correctly
      const expectedWhere = {
        OR: [
          {
            skills: {
              path: '$[*]',
              string_contains: 'JavaScript',
            },
          },
          {
            skills: {
              path: '$[*]',
              string_contains: 'React',
            },
          },
        ],
      };

      expect(prisma.job.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: 0,
        take: 10,
        orderBy: {
          postedDate: 'desc',
        },
      });
      expect(prisma.job.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
      expect(result).toEqual({
        jobs: mockJobs,
        total: mockTotal,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });
});