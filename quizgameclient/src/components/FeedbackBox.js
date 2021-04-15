import React from 'react';

function FeedbackBox(props) {

    return (
        <section>
            <p>{props.answer}</p>

            Source:<a href={props.url}>Link to source</a>
        </section>
    );
}

export default FeedbackBox;