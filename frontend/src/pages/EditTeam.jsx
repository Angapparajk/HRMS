import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { teamsAPI, employeesAPI } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [currentTeamEmployees, setCurrentTeamEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeTeamInfo, setEmployeeTeamInfo] = useState({});
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // First fetch team and employees
      const [teamRes, employeesRes] = await Promise.all([
        teamsAPI.getById(id),
        employeesAPI.getAll()
      ]);
      
      const team = teamRes.data.data;
      const employees = employeesRes.data.data;
      
      setFormData({
        name: team.name,
        description: team.description || ''
      });
      
      const currentEmployeeIds = team.employees?.map(e => e.id) || [];
      setCurrentTeamEmployees(currentEmployeeIds);
      setSelectedEmployees(currentEmployeeIds);
      setAllEmployees(employees);
      
      setLoading(false);
      
      // Then fetch team info for each employee (this can happen after render)
      const teamInfo = {};
      for (const emp of employees) {
        try {
          const teamsRes = await teamsAPI.getEmployeeTeams(emp.id);
          teamInfo[emp.id] = teamsRes.data.data.teams || [];
        } catch (err) {
          teamInfo[emp.id] = [];
        }
      }
      setEmployeeTeamInfo(teamInfo);
      setLoadingEmployees(false);
    } catch (error) {
      setError('Error loading data');
      console.error('Error:', error);
      setLoading(false);
      setLoadingEmployees(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const toggleEmployee = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleRemoveEmployee = async (employeeId, employeeName) => {
    if (!window.confirm(`Are you sure you want to remove ${employeeName} from ${formData.name}?`)) {
      return;
    }

    try {
      await teamsAPI.unassignEmployee(id, employeeId);
      
      // Update local state
      setCurrentTeamEmployees(prev => prev.filter(id => id !== employeeId));
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
      
      // Show success message with team name
      alert(`${employeeName} removed from ${formData.name} team successfully`);
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing employee from team');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Update team details
      await teamsAPI.update(id, formData);
      
      // Handle employee assignments
      const employeesToAdd = selectedEmployees.filter(empId => !currentTeamEmployees.includes(empId));
      const employeesToRemove = currentTeamEmployees.filter(empId => !selectedEmployees.includes(empId));
      
      // Add new employees
      for (const employeeId of employeesToAdd) {
        await teamsAPI.assignEmployee(id, employeeId);
      }
      
      // Remove employees
      for (const employeeId of employeesToRemove) {
        await teamsAPI.unassignEmployee(id, employeeId);
      }
      
      navigate('/teams');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating team');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400 rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading team...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
        <PageHeader
          title="Edit Team"
          subtitle="Update team information and manage members"
          breadcrumbs={[
            { label: 'Teams', href: '/teams' },
            { label: 'Edit' }
          ]}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Details Card */}
          <Card className="animate-slideUp">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Team Details</h3>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-500 p-4 rounded-lg mb-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 dark:text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Team Name"
                name="name"
                type="text"
                required
                placeholder="e.g., Engineering Team"
                value={formData.name}
                onChange={handleChange}
                helperText="Enter a descriptive name for the team"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow resize-none"
                  placeholder="Describe the team's purpose and responsibilities..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          {/* Employee Management Card */}
          <Card className="animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Manage Team Members</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add or remove employees from this team ({selectedEmployees.length} selected)
                </p>
              </div>
            </div>

            {loadingEmployees ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading employees...</p>
              </div>
            ) : allEmployees.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="mt-2 text-gray-500 dark:text-gray-400">No employees available</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allEmployees.map((employee) => {
                  const isSelected = selectedEmployees.includes(employee.id);
                  const isCurrent = currentTeamEmployees.includes(employee.id);
                  const otherTeams = (employeeTeamInfo[employee.id] || []).filter(t => t.id !== parseInt(id));
                  const hasOtherTeams = otherTeams.length > 0;

                  return (
                    <div
                      key={`emp-${employee.id}`}
                      className={`p-4 border rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => toggleEmployee(employee.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleEmployee(employee.id)}
                            className="mt-1 w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Avatar 
                            name={`${employee.firstName} ${employee.lastName}`} 
                            size="md" 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {employee.firstName} {employee.lastName}
                              </p>
                              {isCurrent && (
                                <Badge variant="primary" className="text-xs">
                                  Current Member
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{employee.email}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              {employee.position || 'No position'} • {employee.department || 'No department'}
                            </p>
                            
                            {hasOtherTeams && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                <div className="text-xs text-warning-700 dark:text-warning-400 font-semibold">
                                  ⚠️ Also in {otherTeams.length} other team{otherTeams.length !== 1 ? 's' : ''}:
                                </div>
                                {otherTeams.map((team) => (
                                  <Badge key={team.id} variant="warning" className="text-xs">
                                    {team.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isCurrent && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveEmployee(employee.id, `${employee.firstName} ${employee.lastName}`);
                              }}
                              className="p-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                              title="Remove from team"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                          
                          {isSelected && (
                            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedEmployees.length > 0 
                  ? `Team has ${selectedEmployees.length} member${selectedEmployees.length !== 1 ? 's' : ''}`
                  : 'No team members selected'}
              </p>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/teams')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  }
                >
                  {submitting ? 'Updating...' : 'Update Team'}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditTeam;
