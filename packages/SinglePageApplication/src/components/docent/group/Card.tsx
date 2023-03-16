import React from 'react';
import { classNames } from '../../../util/extra';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (click: React.MouseEvent<HTMLDivElement>) => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  const defaultClassName = 'w-full aspect-square max-w-xs bg-white rounded-xl shadow-sm ';
  const classes = classNames(defaultClassName, className ?? '', onClick ? 'cursor-pointer' : 'cursor-default');

  return (
    <div onClick={onClick} className={classes}>
      <div className="flex flex-col h-full w-full justify-center items-center">{children}</div>
    </div>
  );
};

export default Card;
