// import { useState, useEffect } from 'react';
// import DashboardLayout from '../layouts/DashboardLayout';
// import PageHeader from '../components/ui/PageHeader';
// import Input from '../components/ui/Input';
// import Button from '../components/ui/Button';
// import Card from '../components/ui/Card';
// import Avatar from '../components/ui/Avatar';
// import { useTheme } from '../contexts/ThemeContext';

// const Settings = () => {
//   const { theme, setTheme } = useTheme();
//   const [activeTab, setActiveTab] = useState('profile');
//   const [formData, setFormData] = useState({
//     name: 'Admin User',
//     email: 'admin@example.com',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//     company: 'My Company',
//     timezone: 'UTC',
//     language: 'English',
//     notifications: {
//       email: true,
//       push: false,
//       sms: false
//     },
//     theme: theme
//   });

//   useEffect(() => {
//     setFormData(prev => ({ ...prev, theme }));
//   }, [theme]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: type === 'checkbox' ? checked : value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value
//       }));
      
//       // Update theme in real-time
//       if (name === 'theme') {
//         setTheme(value);
//       }
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // API call would go here
//     alert('Settings saved successfully!');
//   };

//   const tabs = [
//     { id: 'profile', label: 'Profile', icon: '👤' },
//     { id: 'security', label: 'Security', icon: '🔒' },
//     { id: 'preferences', label: 'Preferences', icon: '⚙️' },
//     { id: 'notifications', label: 'Notifications', icon: '🔔' }
//   ];

//   return (
//     <DashboardLayout>
//       <div className="space-y-6 animate-fadeIn bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
//         <PageHeader
//           title="Settings"
//           subtitle="Manage your account settings and preferences"
//         />

//         {/* Tabs */}
//         <div className="border-b border-gray-200 dark:border-gray-700">
//           <nav className="-mb-px flex space-x-8">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`
//                   py-4 px-1 border-b-2 font-medium text-sm transition-colors
//                   ${activeTab === tab.id
//                     ? 'border-primary-500 text-primary-600 dark:text-primary-400'
//                     : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
//                   }
//                 `}
//               >
//                 <span className="mr-2">{tab.icon}</span>
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Profile Tab */}
//         {activeTab === 'profile' && (
//           <div className="space-y-6 animate-slideUp">
//             <Card>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Profile Information</h3>
              
//               {/* Avatar Section */}
//               <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
//                 <Avatar
//                   name={formData.name}
//                   size="xl"
//                   className="ring-4 ring-primary-50 dark:ring-primary-900/30"
//                 />
//                 <div className="flex-1">
//                   <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{formData.name}</h4>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{formData.email}</p>
//                   <div className="flex space-x-3">
//                     <Button variant="outline" size="sm">
//                       Change Photo
//                     </Button>
//                     <Button variant="ghost" size="sm" className="text-danger-600 hover:text-danger-700">
//                       Remove
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <Input
//                     label="Full Name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     icon={
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                     }
//                   />
//                   <Input
//                     label="Email Address"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     icon={
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                     }
//                   />
//                 </div>

//                 <Input
//                   label="Company Name"
//                   name="company"
//                   value={formData.company}
//                   onChange={handleChange}
//                   icon={
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                     </svg>
//                   }
//                 />

//                 <div className="flex justify-end space-x-3 pt-4">
//                   <Button variant="outline" type="button">
//                     Cancel
//                   </Button>
//                   <Button type="submit">
//                     Save Changes
//                   </Button>
//                 </div>
//               </form>
//             </Card>
//           </div>
//         )}

//         {/* Security Tab */}
//         {activeTab === 'security' && (
//           <div className="space-y-6 animate-slideUp">
//             <Card>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Change Password</h3>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <Input
//                   label="Current Password"
//                   name="currentPassword"
//                   type="password"
//                   value={formData.currentPassword}
//                   onChange={handleChange}
//                   icon={
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   }
//                 />
//                 <Input
//                   label="New Password"
//                   name="newPassword"
//                   type="password"
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   icon={
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   }
//                 />
//                 <Input
//                   label="Confirm New Password"
//                   name="confirmPassword"
//                   type="password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   icon={
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   }
//                 />
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <Button variant="outline" type="button">
//                     Cancel
//                   </Button>
//                   <Button type="submit">
//                     Update Password
//                   </Button>
//                 </div>
//               </form>
//             </Card>

//             <Card>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Two-Factor Authentication</h3>
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
//                 Add an extra layer of security to your account by enabling two-factor authentication.
//               </p>
//               <Button variant="outline">
//                 Enable 2FA
//               </Button>
//             </Card>
//           </div>
//         )}

//         {/* Preferences Tab */}
//         {activeTab === 'preferences' && (
//           <div className="space-y-6 animate-slideUp">
//             <Card>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Application Preferences</h3>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Timezone
//                     </label>
//                     <select
//                       name="timezone"
//                       value={formData.timezone}
//                       onChange={handleChange}
//                       className="input-field"
//                     >
//                       <option value="UTC">UTC (GMT+0)</option>
//                       <option value="EST">Eastern Time (GMT-5)</option>
//                       <option value="PST">Pacific Time (GMT-8)</option>
//                       <option value="IST">India Standard Time (GMT+5:30)</option>
//                       <option value="JST">Japan Standard Time (GMT+9)</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Language
//                     </label>
//                     <select
//                       name="language"
//                       value={formData.language}
//                       onChange={handleChange}
//                       className="input-field"
//                     >
//                       <option value="English">English</option>
//                       <option value="Spanish">Spanish</option>
//                       <option value="French">French</option>
//                       <option value="German">German</option>
//                       <option value="Japanese">Japanese</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
//                     Theme
//                   </label>
//                   <div className="grid grid-cols-3 gap-4">
//                     {['light', 'dark'].map((themeOption) => (
//                       <label
//                         key={themeOption}
//                         className={`
//                           relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all
//                           ${formData.theme === themeOption
//                             ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
//                             : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
//                           }
//                         `}
//                       >
//                         <input
//                           type="radio"
//                           name="theme"
//                           value={themeOption}
//                           checked={formData.theme === themeOption}
//                           onChange={handleChange}
//                           className="sr-only"
//                         />
//                         <div className="text-center">
//                           <div className="text-2xl mb-2">
//                             {themeOption === 'light' && '☀️'}
//                             {themeOption === 'dark' && '🌙'}
//                           </div>
//                           <span className="text-sm font-medium capitalize dark:text-gray-200">{themeOption}</span>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4">
//                   <Button variant="outline" type="button">
//                     Cancel
//                   </Button>
//                   <Button type="submit">
//                     Save Preferences
//                   </Button>
//                 </div>
//               </form>
//             </Card>
//           </div>
//         )}

//         {/* Notifications Tab */}
//         {activeTab === 'notifications' && (
//           <div className="space-y-6 animate-slideUp">
//             <Card>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Notification Settings</h3>
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
//                   <div className="flex-1">
//                     <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Email Notifications</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Receive notifications via email about important updates
//                     </p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name="notifications.email"
//                       checked={formData.notifications.email}
//                       onChange={handleChange}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
//                   </label>
//                 </div>

//                 <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
//                   <div className="flex-1">
//                     <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Push Notifications</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Get push notifications on your browser
//                     </p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name="notifications.push"
//                       checked={formData.notifications.push}
//                       onChange={handleChange}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
//                   </label>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex-1">
//                     <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">SMS Notifications</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Receive text messages for critical alerts
//                     </p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name="notifications.sms"
//                       checked={formData.notifications.sms}
//                       onChange={handleChange}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
//                   </label>
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
//                   <Button variant="outline" type="button">
//                     Cancel
//                   </Button>
//                   <Button onClick={handleSubmit}>
//                     Save Notification Settings
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Settings;
