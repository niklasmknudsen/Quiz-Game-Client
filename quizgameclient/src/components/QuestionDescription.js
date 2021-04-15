import React from 'react';

function QuestionDescription(props) {
    return (
        <section className="question-description">
            <p>{props.description}</p>
        </section>
    );
}

export default QuestionDescription;