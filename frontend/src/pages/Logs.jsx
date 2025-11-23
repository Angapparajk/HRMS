import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { logsAPI } from '../services/api';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const params = {};
      if (filters.action) params.action = filters.action;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await logsAPI.getAll(params);
      setLogs(response.data.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = () => {
    setLoading(true);
    fetchLogs();
  };

  const handleClearFilters = () => {
    setFilters({
      action: '',
      startDate: '',
      endDate: ''
    });
    setLoading(true);
    setTimeout(() => fetchLogs(), 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionBadgeVariant = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) return 'success';
    if (actionLower.includes('update') || actionLower.includes('login')) return 'primary';
    if (actionLower.includes('delete')) return 'danger';
    if (actionLower.includes('assign') || actionLower.includes('unassign')) return 'warning';
    return 'gray';
  };

  const formatActionText = (action) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 animate-fadeIn">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading logs...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6">
        <PageHeader
          title="Activity Logs"
          subtitle="View all system activities and changes"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Activity Logs' }
          ]}
        />

        {/* Filters */}
        <Card className="animate-slideUp">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Filter Logs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Action Type
              </label>
              <select
                name="action"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                value={filters.action}
                onChange={handleFilterChange}
              >
                <option value="">All Actions</option>
                <option value="organisation_created">Organisation Created</option>
                <option value="login">Login</option>
                <option value="employee_created">Employee Created</option>
                <option value="employee_updated">Employee Updated</option>
                <option value="employee_deleted">Employee Deleted</option>
                <option value="team_created">Team Created</option>
                <option value="team_updated">Team Updated</option>
                <option value="team_deleted">Team Deleted</option>
                <option value="employee_assigned_to_team">Employee Assigned</option>
                <option value="employee_unassigned_from_team">Employee Unassigned</option>
              </select>
            </div>

            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />

            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handleApplyFilters} variant="primary">
              Apply Filters
            </Button>
            <Button onClick={handleClearFilters} variant="secondary">
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Logs Table */}
        <Card className="animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Activity Log
            </h2>
            <Badge variant="gray">{logs.length} entries</Badge>
          </div>

          {logs.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getActionBadgeVariant(log.action)}>
                            {formatActionText(log.action)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {log.user?.name || 'System'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="space-y-1">
                            {log.meta?.organisationName && (
                              <div><span className="font-medium dark:text-gray-300">Org:</span> {log.meta.organisationName}</div>
                            )}
                            {log.meta?.adminEmail && (
                              <div><span className="font-medium dark:text-gray-300">Email:</span> {log.meta.adminEmail}</div>
                            )}
                            {log.meta?.email && (
                              <div><span className="font-medium dark:text-gray-300">Email:</span> {log.meta.email}</div>
                            )}
                            {log.meta?.path && (
                              <div><span className="font-medium dark:text-gray-300">Path:</span> {log.meta.path}</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {logs.map((log) => (
                  <Card key={log.id} variant="interactive" className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {formatActionText(log.action)}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {log.user?.name || 'System'}
                        </p>
                      </div>

                      {(log.meta?.organisationName || log.meta?.adminEmail || log.meta?.email || log.meta?.path) && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pt-2 border-t border-gray-100 dark:border-gray-700">
                          {log.meta?.organisationName && (
                            <div><span className="font-medium dark:text-gray-300">Org:</span> {log.meta.organisationName}</div>
                          )}
                          {log.meta?.adminEmail && (
                            <div><span className="font-medium dark:text-gray-300">Email:</span> {log.meta.adminEmail}</div>
                          )}
                          {log.meta?.email && (
                            <div><span className="font-medium dark:text-gray-300">Email:</span> {log.meta.email}</div>
                          )}
                          {log.meta?.path && (
                            <div><span className="font-medium dark:text-gray-300">Path:</span> {log.meta.path}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="No logs found"
              description="No activity logs match your current filters. Try adjusting your filter criteria."
              icon={
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Logs;
