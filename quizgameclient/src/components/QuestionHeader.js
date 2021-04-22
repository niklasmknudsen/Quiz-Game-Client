import React from 'react';
import '../css/questionHeader.css';

function QuestionHeader(props) {
    return (
        <header className="question-header">
            <label>Category</label>
            <h1>{props.category}</h1>

            <label>Field</label>
            <h3>{props.field}</h3>

            <label>Points</label>
            <p>{props.points}</p>
        </header>
    );
}

export default QuestionHeader;