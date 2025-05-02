import React from 'react';
import PropTypes from 'prop-types';
import './Heading.css'; 

// Heading component factory
const Heading = ({ level, children, className }) => {
  const Tag = `h${level}`;
  return <Tag className={className}>{children}</Tag>;
};

Heading.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// Default custom heading components
export const H1 = ({ children, className }) => <Heading level={1} className={`h1 ${className}`}>{children}</Heading>;
export const H2 = ({ children, className }) => <Heading level={2} className={`h2 ${className}`}>{children}</Heading>;
export const H3 = ({ children, className }) => <Heading level={3} className={`h3 ${className}`}>{children}</Heading>;
export const H4 = ({ children, className }) => <Heading level={4} className={`h4 ${className}`}>{children}</Heading>;
export const H5 = ({ children, className }) => <Heading level={5} className={`h5 ${className}`}>{children}</Heading>;
export const H6 = ({ children, className }) => <Heading level={6} className={`h6 ${className}`}>{children}</Heading>;

