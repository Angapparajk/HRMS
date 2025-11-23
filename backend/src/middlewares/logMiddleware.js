const { Log } = require('../models');

const createLog = async (organisationId, userId, action, meta = {}) => {
  try {
    await Log.create({
      organisationId,
      userId,
      action,
      meta,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating log:', error);
  }
};

const logMiddleware = (action) => {
  return async (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
      // Log only on successful operations (status 200-299)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const meta = {
          method: req.method,
          path: req.path,
          params: req.params,
          body: req.body
        };

        // For team-related actions, include team name in action
        let logAction = action;
        if (data?.teamName) {
          switch (action) {
            case 'team_created':
              logAction = `${data.teamName} team created`;
              break;
            case 'team_updated':
              logAction = `${data.teamName} team updated`;
              break;
            case 'team_deleted':
              logAction = `${data.teamName} team deleted`;
              break;
            case 'employee_assigned_to_team':
              logAction = `employee assigned to ${data.teamName} team`;
              break;
            case 'employee_unassigned_from_team':
              logAction = `employee unassigned from ${data.teamName} team`;
              break;
          }
        } else if (action === 'profile_updated') {
          logAction = 'profile updated';
        }

        createLog(req.user.orgId, req.user.userId, logAction, meta);
      }

      return originalJson.call(this, data);
    };

    next();
  };
};

module.exports = { logMiddleware, createLog };
