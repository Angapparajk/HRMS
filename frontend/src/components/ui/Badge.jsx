const Badge = ({ 
  children, 
  variant = 'primary', 
  className = '',
  icon,
  ...props 
}) => {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    gray: 'badge-gray',
  };
  
  return (
    <span className={`badge ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="w-3 h-3 mr-1 inline-block">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
