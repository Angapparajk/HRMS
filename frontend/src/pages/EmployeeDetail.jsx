import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { employeesAPI, teamsAPI } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [allTeams, setAllTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [empRes, teamsRes] = await Promise.all([
        employeesAPI.getById(id),
        teamsAPI.getAll()
      ]);
      setEmployee(empRes.data.data);
      setAllTeams(teamsRes.data.data);
      setSelectedTeams(empRes.data.data.teams?.map(t => t.id) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeams = async () => {
    try {
      const currentTeamIds = employee.teams?.map(t => t.id) || [];
      
      // Find teams to assign (newly selected)
      const teamsToAssign = selectedTeams.filter(tid => !currentTeamIds.includes(tid));
      
      // Find teams to unassign (deselected)
      const teamsToUnassign = currentTeamIds.filter(tid => !selectedTeams.includes(tid));

      // Assign new teams
      for (const teamId of teamsToAssign) {
        await teamsAPI.assignEmployee(teamId, id);
      }

      // Unassign removed teams
      for (const teamId of teamsToUnassign) {
        await teamsAPI.unassignEmployee(teamId, id);
      }

      await fetchData();
      setShowAssignModal(false);
    } catch (error) {
      alert('Error updating team assignments');
    }
  };

  const handleTeamToggle = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400 rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading employee details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Employee not found</p>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/employees')}>
            Back to Employees
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
        <PageHeader
          title={`${employee.firstName} ${employee.lastName}`}
          subtitle={employee.position || 'Employee'}
          breadcrumbs={[
            { label: 'Employees', path: '/employees' },
            { label: 'Details' }
          ]}
          action={
            <Button
              variant="primary"
              onClick={() => navigate(`/employees/${id}/edit`)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              Edit
            </Button>
          }
        />

        {/* Employee Profile Card */}
        <Card className="animate-slideUp">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <Avatar name={`${employee.firstName} ${employee.lastName}`} size="xl" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{employee.firstName} {employee.lastName}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{employee.position || 'No position set'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="primary">{employee.department || 'No department'}</Badge>
                <Badge variant="gray">{employee.teams?.length || 0} teams</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</label>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-900 dark:text-gray-100">{employee.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone</label>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-gray-900 dark:text-gray-100">{employee.phone || '-'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Teams Card */}
        <Card className="animate-slideUp">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Team Assignments</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAssignModal(true)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              Manage Teams
            </Button>
          </div>
          
          {employee.teams && employee.teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employee.teams.map((team) => (
                <div key={team.id} className="card-hover p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{team.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{team.description || 'No description'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Not assigned to any teams</p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => setShowAssignModal(true)}>
                Assign to teams
              </Button>
            </div>
          )}
        </Card>

        {/* Back Button */}
        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={() => navigate('/employees')}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            Back to Employees
          </Button>
        </div>
      </div>

      {/* Assign Teams Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign to Teams"
        size="md"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {allTeams.map((team) => (
            <label key={team.id} className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedTeams.includes(team.id)}
                onChange={() => handleTeamToggle(team.id)}
                className="mt-1 w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{team.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{team.description || 'No description'}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
          <Button variant="primary" onClick={handleAssignTeams} className="flex-1">
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => setShowAssignModal(false)} className="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default EmployeeDetail;
