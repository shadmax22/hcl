import { Response } from 'express';
import User from '../models/User';
import Goal from '../models/Goal';
import TrackingRecord from '../models/TrackingRecord';
import PreventiveCareReminder from '../models/PreventiveCareReminder';
import Notification from '../models/Notification';

class PatientController {
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
          created_at: user.created_at,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve profile',
      });
    }
  }

  async getGoals(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;

      const goals = await Goal.find({ patient_id: userId })
        .sort({ created_at: -1 });

      res.status(200).json({
        message: 'Goals retrieved successfully',
        count: goals.length,
        goals: goals,
      });
    } catch (error) {
      console.error('Get goals error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve goals',
      });
    }
  }

  async getTrackingRecordCategories(_req: any, res: Response): Promise<void> {
    try {
      const categories = [
          { value: 'weight', label: 'Weight (kg)' },
          { value: 'height', label: 'Height (cm)' },
          { value: 'bmi', label: 'BMI' }, 
          { value: 'blood_pressure_systolic', label: 'Blood Pressure - Systolic (mmHg)' },
          { value: 'blood_pressure_diastolic', label: 'Blood Pressure - Diastolic (mmHg)' },
          { value: 'blood_pressure', label: 'Blood Pressure (mmHg)' },
          { value: 'heart_rate', label: 'Heart Rate (bpm)' },
          { value: 'steps', label: 'Steps' },
          { value: 'sleep', label: 'Sleep (hours)' },
          { value: 'water', label: 'Water (liters)' },
          { value: 'exercise', label: 'Exercise (minutes)' },
      ];

      res.status(200).json({
        message: 'Tracking record categories retrieved successfully',
        categories: categories,
      });
    } catch (error) {
      console.error('Get tracking record categories error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve tracking record categories',
      });
    }
  }

  async getTrackingRecords(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const { type } = req.query;

      const query: any = { patient_id: userId };
      if (type) {
        query.type = type;
      }

      const records = await TrackingRecord.find(query)
        .sort({ created_at: -1 })
        .limit(100);

      res.status(200).json({
        message: 'Tracking records retrieved successfully',
        count: records.length,
        records: records,
      });
    } catch (error) {
      console.error('Get tracking records error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve tracking records',
      });
    }
  }

  async addTrackingRecord(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const { type, value, date } = req.body;

      if (!type || value === undefined || value === null) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'type and value are required',
        });
        return;
      }

      const validTypes = ['weight', 'height', 'bmi', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'blood_pressure', 'heart_rate', 'steps', 'sleep', 'water', 'exercise'];
      if (!validTypes.includes(type)) {
        res.status(400).json({
          error: 'Validation Error',
          message: `type must be one of: ${validTypes.join(', ')}`,
        });
        return;
      }

      if (typeof value !== 'number' || value < 0) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'value must be a positive number',
        });
        return;
      }

      const trackingRecord = new TrackingRecord({
        patient_id: userId,
        type,
        value,
        date: date ? new Date(date) : new Date(),
      });

      await trackingRecord.save();

      res.status(201).json({
        message: 'Tracking record added successfully',
        record: {
          id: trackingRecord._id,
          patient_id: trackingRecord.patient_id,
          type: trackingRecord.type,
          value: trackingRecord.value,
          date: trackingRecord.date || trackingRecord.created_at,
          created_at: trackingRecord.created_at,
        },
      });
    } catch (error) {
      console.error('Add tracking record error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to add tracking record',
      });
    }
  }

  async updateTrackingRecord(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const { type, value, date } = req.body;

      const trackingRecord = await TrackingRecord.findOne({
        _id: id,
        patient_id: userId,
      });

      if (!trackingRecord) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Tracking record not found',
        });
        return;
      }

      if (type !== undefined) {
        const validTypes = ['weight', 'height', 'bmi', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'blood_pressure', 'heart_rate', 'steps', 'sleep', 'water', 'exercise'];
        if (!validTypes.includes(type)) {
          res.status(400).json({
            error: 'Validation Error',
            message: `type must be one of: ${validTypes.join(', ')}`,
          });
          return;
        }
        trackingRecord.type = type;
      }

      if (value !== undefined && value !== null) {
        if (typeof value !== 'number' || value < 0) {
          res.status(400).json({
            error: 'Validation Error',
            message: 'value must be a positive number',
          });
          return;
        }
        trackingRecord.value = value;
      }

      if (date !== undefined) {
        trackingRecord.date = new Date(date);
      }

      await trackingRecord.save();

      res.status(200).json({
        message: 'Tracking record updated successfully',
        record: {
          id: trackingRecord._id,
          patient_id: trackingRecord.patient_id,
          type: trackingRecord.type,
          value: trackingRecord.value,
          date: trackingRecord.date || trackingRecord.created_at,
          created_at: trackingRecord.created_at,
        },
      });
    } catch (error) {
      console.error('Update tracking record error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to update tracking record',
      });
    }
  }

  async deleteTrackingRecord(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const trackingRecord = await TrackingRecord.findOneAndDelete({
        _id: id,
        patient_id: userId,
      });

      if (!trackingRecord) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Tracking record not found',
        });
        return;
      }

      res.status(200).json({
        message: 'Tracking record deleted successfully',
      });
    } catch (error) {
      console.error('Delete tracking record error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to delete tracking record',
      });
    }
  }

  async getReminders(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;

      const reminders = await PreventiveCareReminder.find({
        patient_id: userId,
        stat: 'active',
      })
        .sort({ due_date: 1 });

      res.status(200).json({
        message: 'Reminders retrieved successfully',
        count: reminders.length,
        reminders: reminders,
      });
    } catch (error) {
      console.error('Get reminders error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve reminders',
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

export default new PatientController();

