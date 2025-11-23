const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  gradient = false,
  gradientFrom = 'primary-500',
  gradientTo = 'primary-700',
  iconBg = 'primary-100',
  iconColor = 'primary-600',
  className = ''
}) => {
  if (gradient) {
    return (
      <div className={`stat-card-gradient ${className} animate-slideUp`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
            <p className="text-4xl font-bold tracking-tight">{value}</p>
            {trendValue && (
              <p className="text-sm mt-2 opacity-75">
                <span className={trend === 'up' ? 'text-green-200' : 'text-red-200'}>
                  {trend === 'up' ? '↑' : '↓'} {trendValue}
                </span>
                <span className="ml-1">from last month</span>
              </p>
            )}
          </div>
          {icon && (
            <div className="text-white opacity-20">
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card hover:shadow-lg transition-all duration-300 animate-slideUp">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {trendValue && (
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
              <span className={trend === 'up' ? 'text-success-600' : 'text-danger-600'}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="ml-1">from last month</span>
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl bg-${iconBg}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
