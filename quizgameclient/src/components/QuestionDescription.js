import React from 'react';
import '../css/questionDescription.css';

function QuestionDescription(props) {
    return (
        <section className="question-description">
            <p>{props.description}</p>
        </section>
    );
}

export default QuestionDescription;