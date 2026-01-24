require("module-alias/register")

const Enrollment = require('@model/enrollment');
const Module = require('@model/module');
const {AppError} = require('@util/errorHandler');

const enrollStudentService = async (moduleId, userId) => {
  const module = await Module.findById(moduleId);
  if (!module) throw new AppError('Module not found', 404);

  const existingEnrollment = await Enrollment.findOne({ module: moduleId, student: userId });
  if (existingEnrollment) throw new AppError('Student already enrolled', 400);

  const enrollment = await Enrollment.create({
    module: moduleId,
    student: userId,
    completedUnits: [],
    quizScores: []
  });

  return enrollment;
};

const getStudentEnrollmentsService = async (userId) => {
  const enrollments = await Enrollment.find({ student: userId })
    .populate('module', 'title thumbnail instructor') 
    .populate('student', 'name email');
  return enrollments;
};

const markUnitCompleteService = async (enrollmentId, unitId, userId) => {
  const enrollment = await Enrollment.findOne({ _id: enrollmentId, student: userId }).populate('module');
  if (!enrollment) throw new AppError('Enrollment not found', 404);

  if (!enrollment.completedUnits.includes(unitId)) {
    enrollment.completedUnits.push(unitId);
  }

  // Check for progress status 
  const totalUnits = enrollment.module.content.length;
  const completedCount = enrollment.completedUnits.length;

  if (completedCount === totalUnits) {
    enrollment.isCompleted = true;
    // Here we will allow to get certificate
  }

  await enrollment.save();
  return enrollment;
};

const submitQuizScoreService = async (enrollmentId, unitId, score, userId) => {
  const enrollment = await Enrollment.findOne({ _id: enrollmentId, student: userId });
  if (!enrollment) throw new AppError('Enrollment not found', 404);

  // Remove old score for this quiz if it exists (allow retakes)
  enrollment.quizScores = enrollment.quizScores.filter(q => q.unitId.toString() !== unitId);

  // Add new score
  enrollment.quizScores.push({ unitId, score });

  // If passed (e.g. > 50%), mark as complete automatically
  if (score >= 70) {
    if (!enrollment.completedUnits.includes(unitId)) {
      enrollment.completedUnits.push(unitId);
    }
  }

  await enrollment.save();
  return enrollment;
};

module.exports = {
  enrollStudentService,
  getStudentEnrollmentsService,
  markUnitCompleteService,
  submitQuizScoreService
};