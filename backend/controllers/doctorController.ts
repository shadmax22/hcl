import { Response } from 'express';
import User from '../models/User';
import HealthcareProvider from '../models/HealthcareProvider';
import PatientDoctorMapping from '../models/PatientDoctorMapping';
import Goal from '../models/Goal';
import GoalLog from '../models/GoalLog';
import TrackingRecord from '../models/TrackingRecord';
import Notification from '../models/Notification';

class DoctorController {
  async getProfile(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;

      const user = await User.findById(userId)
        .populate('role', 'role_name')
        .select('-password');

      if (!user) {
        res.status(404).json({
          error: 'Not Found',
          message: 'User not found',
        });
        return;
      }

      const provider = await HealthcareProvider.findOne({ user: userId })
        .populate('care_category', 'name');

      res.status(200).json({
        message: 'Profile retrieved successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone_no: user.phone_no,
          DOB: user.DOB,
          gender: user.gender,
          stat: user.stat,
        },
        provider: provider ? {
          id: provider._id,
          specialisation: provider.specialisation,
          care_category: provider.care_category,
          stat: provider.stat,
        } : null,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve profile',
      });
    }
  }

  async getMyPatients(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;

      const provider = await HealthcareProvider.findOne({ user: userId });
      if (!provider) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Healthcare provider profile not found',
        });
        return;
      }

      const mappings = await PatientDoctorMapping.find({
        doctor_id: provider._id,
        stat: 'active',
      })
        .populate('patient_id', 'name email phone_no DOB gender stat');

      const patients = mappings.map((mapping: any) => ({
        id: mapping.patient_id._id,
        name: mapping.patient_id.name,
        email: mapping.patient_id.email,
        phone_no: mapping.patient_id.phone_no,
        DOB: mapping.patient_id.DOB,
        gender: mapping.patient_id.gender,
        stat: mapping.patient_id.stat,
        mapping_id: mapping._id,
        created_at: mapping.created_at,
      }));

      res.status(200).json({
        message: 'Patients retrieved successfully',
        count: patients.length,
        patients: patients,
      });
    } catch (error) {
      console.error('Get my patients error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve patients',
      });
    }
  }

  async getPatientDetails(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const { patientId } = req.params;

      const provider = await HealthcareProvider.findOne({ user: userId });
      if (!provider) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Healthcare provider profile not found',
        });
        return;
      }

      const mapping = await PatientDoctorMapping.findOne({
        doctor_id: provider._id,
        patient_id: patientId,
        stat: 'active',
      });

      if (!mapping) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have access to this patient',
        });
        return;
      }

      const patient = await User.findById(patientId)
        .select('-password');

      if (!patient) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Patient not found',
        });
        return;
      }

      const goals = await Goal.find({ patient_id: patientId });
      const trackingRecords = await TrackingRecord.find({ patient_id: patientId })
        .sort({ created_at: -1 })
        .limit(30);

      res.status(200).json({
        message: 'Patient details retrieved successfully',
        patient: {
          id: patient._id,
          name: patient.name,
          email: patient.email,
          phone_no: patient.phone_no,
          DOB: patient.DOB,
          gender: patient.gender,
          stat: patient.stat,
        },
        goals: goals,
        trackingRecords: trackingRecords,
      });
    } catch (error) {
      console.error('Get patient details error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve patient details',
      });
    }
  }

  async createGoalForPatient(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const { patientId } = req.params;
      const {
        tracking_type,
        target_value,
        due_date,
      }: any = req.body;

      if (!tracking_type || !target_value || !due_date) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'tracking_type, target_value, and due_date are required',
        });
        return;
      }

      const provider = await HealthcareProvider.findOne({ user: userId });
      if (!provider) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Healthcare provider profile not found',
        });
        return;
      }

      const mapping = await PatientDoctorMapping.findOne({
        doctor_id: provider._id,
        patient_id: patientId,
        stat: 'active',
      });

      if (!mapping) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have access to this patient',
        });
        return;
      }

      const goal = new Goal({
        patient_id: patientId,
        tracking_type,
        target_value,
        due_date: new Date(due_date),
        stat: 'active',
      });

      await goal.save();

      res.status(201).json({
        message: 'Goal created successfully for patient',
        goal: {
          id: goal._id,
          patient_id: goal.patient_id,
          tracking_type: goal.tracking_type,
          target_value: goal.target_value,
          due_date: goal.due_date,
          stat: goal.stat,
        },
      });
    } catch (error) {
      console.error('Create goal for patient error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to create goal for patient',
      });
    }
  }

  async getPatientGoals(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const { patientId } = req.params;

      const provider = await HealthcareProvider.findOne({ user: userId });
      if (!provider) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Healthcare provider profile not found',
        });
        return;
      }

      const mapping = await PatientDoctorMapping.findOne({
        doctor_id: provider._id,
        patient_id: patientId,
        stat: 'active',
      });

      if (!mapping) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have access to this patient',
        });
        return;
      }

      const goals = await Goal.find({ patient_id: patientId })
        .sort({ created_at: -1 });

      const goalsWithLogs = await Promise.all(
        goals.map(async (goal: any) => {
          const logs = await GoalLog.find({ goal_id: goal._id })
            .sort({ date: -1 })
            .limit(10);
          return {
            ...goal.toObject(),
            logs: logs,
          };
        })
      );

      res.status(200).json({
        message: 'Patient goals retrieved successfully',
        count: goalsWithLogs.length,
        goals: goalsWithLogs,
      });
    } catch (error) {
      console.error('Get patient goals error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve patient goals',
      });
    }
  }

  async getNotifications(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;

      const notifications = await Notification.find({
        user_id: userId,
      })
        .sort({ created_at: -1 })
        .limit(50);

      res.status(200).json({
        message: 'Notifications retrieved successfully',
        count: notifications.length,
        notifications: notifications,
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve notifications',
      });
    }
  }
}

export default new DoctorController();

