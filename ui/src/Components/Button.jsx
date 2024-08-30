import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({ print, target }) {
    return (
        <React.Fragment>
            <button className='relative mx-8'>
                <Link 
                    className='bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105'
                    to={target}
                >
                    {print}
                </Link>
            </button>
        </React.Fragment>
    );
}