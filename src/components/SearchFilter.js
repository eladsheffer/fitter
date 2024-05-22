import React from 'react';
import { FormCheck } from 'react-bootstrap';

export default function SearchFilter({ title, data, filterType, onFilterChange }) {
    return (
        <div>
            <h5>{title}:</h5>
            {data.map(item => (
                <FormCheck
                    key={item}
                    type="checkbox"
                    label={item}
                    onChange={() => onFilterChange(filterType, item)}
                />
            ))}
        </div>
    );
}
