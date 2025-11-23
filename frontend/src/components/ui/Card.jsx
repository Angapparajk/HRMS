const Card = ({ 
  children, 
  className = '', 
  hover = false,
  interactive = false,
  onClick,
  ...props 
}) => {
  const classes = `card ${hover ? 'card-hover' : ''} ${interactive ? 'card-interactive' : ''} ${className}`;
  
  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
