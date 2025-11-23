import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { teamsAPI, employeesAPI } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

const CreateTeam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeTeamInfo, setEmployeeTeamInfo] = useState({});
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeesAPI.getAll();
      setAllEmployees(response.data.data);
      
      // Fetch team info for each employee
      const teamInfo = {};
      await Promise.all(
        response.data.data.map(async (emp) => {
          try {
            const teamsRes = await teamsAPI.getEmployeeTeams(emp.id);
            teamInfo[emp.id] = teamsRes.data.data.teams || [];
          } catch (err) {
            teamInfo[emp.id] = [];
          }
        })
      );
      setEmployeeTeamInfo(teamInfo);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await teamsAPI.create({
        ...formData,
        employeeIds: selectedEmployees
      });
      navigate('/teams');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
        <PageHeader
          title="Create New Team"
          subtitle="Add a new team to your organisation"
          breadcrumbs={[
            { label: 'Teams', href: '/teams' },
            { label: 'New' }
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

          {/* Employee Selection Card */}
          <Card className="animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add Team Members</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Select employees to add to this team ({selectedEmployees.length} selected)
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
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/employees/new')}
                >
                  Add Employee First
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allEmployees.map((employee) => {
                  const isSelected = selectedEmployees.includes(employee.id);
                  const currentTeams = employeeTeamInfo[employee.id] || [];
                  const hasTeams = currentTeams.length > 0;

                  return (
                    <div
                      key={employee.id}
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
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{employee.email}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              {employee.position || 'No position'} • {employee.department || 'No department'}
                            </p>
                            
                            {hasTeams && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                <div className="text-xs text-warning-700 dark:text-warning-400 font-semibold">
                                  ⚠️ Already in {currentTeams.length} team{currentTeams.length !== 1 ? 's' : ''}:
                                </div>
                                {currentTeams.map((team) => (
                                  <Badge key={team.id} variant="warning" className="text-xs">
                                    {team.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {isSelected && (
                          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
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
                  ? `Creating team with ${selectedEmployees.length} member${selectedEmployees.length !== 1 ? 's' : ''}`
                  : 'You can add team members now or later'}
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
                  loading={loading}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  }
                >
                  {loading ? 'Creating...' : 'Create Team'}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateTeam;
