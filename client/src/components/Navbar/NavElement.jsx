import React from 'react';
import { Link } from 'react-router-dom';

const NavElement = ({title,link}) => {
    return (
        <Link to={link} className="text-white font-bold">
          {title}
        </Link>
    );
};

export default NavElement;