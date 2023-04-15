import React, { CSSProperties, useCallback } from 'react';
import { Badge } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/esm/types';
interface StatusBadgeProps {
  text?: string;
  pill?: boolean;
  style?: CSSProperties;
  className?: string;
}
const StatusBadge: React.FC<StatusBadgeProps> = props => {
  const { text, style, pill, className } = props;

  const getColorOfBadge = useCallback((): Variant => {
    switch (text?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'needs update':
        return 'danger';
      case 'pending submission':
        return 'secondary';
      case 'submitted':
        return 'primary';
      case 'resubmitted':
        return 'info';
      case 'in review':
        return 'warning';
      default:
        return 'primary';
    }
  }, [text]);

  return (
    <Badge
      {...(style && { style })}
      pill={pill}
      bg={getColorOfBadge()}
      className={`${className}`}
      style={{
        color: (['warning'] as Variant[]).includes(getColorOfBadge()) ? 'black' : 'white',
      }}
    >
      {text}
    </Badge>
  );
};

export default StatusBadge;
