import cron from 'node-cron';
import Goal from '../models/Goal';
import GoalLog from '../models/GoalLog';
import TrackingRecord from '../models/TrackingRecord';
import Notification from '../models/Notification';

class GoalNotificationJob {
  private isRunning = false;

  async checkUnachievedGoals(): Promise<void> {
    if (this.isRunning) {
      console.log('Goal notification job is already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('Starting goal notification job...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all active goals
      const activeGoals = await Goal.find({
        stat: 'active',
        due_date: { $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) }, // Goals due within 7 days or past due
      });

      console.log(`Found ${activeGoals.length} active goals to check`);

      for (const goal of activeGoals) {
        try {
          const isAchieved = await this.checkGoalProgress(goal);
          
          if (!isAchieved) {
            // Check if notification already sent today for this goal
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            
            const existingNotification = await Notification.findOne({
              user_id: goal.patient_id,
              message: { $regex: `Goal.*${goal.tracking_type}`, $options: 'i' },
              created_at: { $gte: todayStart },
            });

            if (!existingNotification) {
              const daysUntilDue = Math.ceil(
                (goal.due_date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              );

              let message = '';
              if (daysUntilDue < 0) {
                message = `Your ${goal.tracking_type} goal (target: ${goal.target_value}) was due ${Math.abs(daysUntilDue)} day(s) ago and has not been achieved. Please update your progress.`;
              } else if (daysUntilDue === 0) {
                message = `Your ${goal.tracking_type} goal (target: ${goal.target_value}) is due today and has not been achieved. Please update your progress.`;
              } else {
                message = `Your ${goal.tracking_type} goal (target: ${goal.target_value}) is due in ${daysUntilDue} day(s) and is not on track. Please update your progress.`;
              }

              await Notification.create({
                user_id: goal.patient_id,
                message: message,
                type: 'goal_update',
                is_read: false,
              });

              console.log(`Notification sent to patient ${goal.patient_id} for goal ${goal._id}`);
            }
          }
        } catch (error) {
          console.error(`Error processing goal ${goal._id}:`, error);
        }
      }

      console.log('Goal notification job completed successfully');
    } catch (error) {
      console.error('Error in goal notification job:', error);
    } finally {
      this.isRunning = false;
    }
  }

  private async checkGoalProgress(goal: any): Promise<boolean> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get the most recent progress for this goal
      let currentValue: number | null = null;

      if (goal.tracking_type === 'weight' || goal.tracking_type === 'bmi') {
        // Check TrackingRecord for weight/bmi
        const latestRecord = await TrackingRecord.findOne({
          patient_id: goal.patient_id,
          type: goal.tracking_type,
        })
          .sort({ created_at: -1 });

        if (latestRecord) {
          currentValue = latestRecord.value;
        }
      } else if (goal.tracking_type === 'steps') {
        // Check GoalLog for steps
        const latestLog = await GoalLog.findOne({
          goal_id: goal._id,
        })
          .sort({ date: -1 });

        if (latestLog) {
          currentValue = latestLog.actual_value;
        }
      }

      // If no progress recorded, goal is not achieved
      if (currentValue === null) {
        return false;
      }

      // Check if goal is achieved (current value should be close to or better than target)
      // For weight goals, we might want to check if it's within a range
      // For now, simple comparison: if current is better than or equal to target
      const progressPercentage = (currentValue / goal.target_value) * 100;
      
      // Consider goal achieved if progress is at least 80% of target
      // Or if past due date and still not close, it's not achieved
      const isPastDue = goal.due_date < today;
      
      if (isPastDue) {
        // If past due, need to be at least 90% of target
        return progressPercentage >= 90;
      } else {
        // If not past due, 80% is acceptable
        return progressPercentage >= 80;
      }
    } catch (error) {
      console.error(`Error checking goal progress for goal ${goal._id}:`, error);
      return false;
    }
  }

  start(): void {
    // Run daily at 9:00 AM
    cron.schedule('0 9 * * *', () => {
      console.log('Scheduled goal notification job triggered');
      this.checkUnachievedGoals();
    });

    // Also run immediately on startup (optional - comment out if not needed)
    // this.checkUnachievedGoals();

    console.log('Goal notification job scheduled to run daily at 9:00 AM');
  }

  // Manual trigger for testing
  async runNow(): Promise<void> {
    await this.checkUnachievedGoals();
  }
}

export default new GoalNotificationJob();

