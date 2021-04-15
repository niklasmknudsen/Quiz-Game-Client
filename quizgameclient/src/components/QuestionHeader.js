import React from 'react';

function QuestionHeader(props) {
    return (
        <header className="question-header">
            <h1>{props.category}</h1>
            <h3>{props.field}</h3>
            <p>{props.points}</p>
        </header>
    );
}

export default QuestionHeader;