import React from 'react';

const Loading = ({ message = 'Đang tải...' }) => {
    return (
        <div className="loading">
            <div className="spinner"></div>
            <p>{message}</p>
        </div>
    );
};

export default Loading;
