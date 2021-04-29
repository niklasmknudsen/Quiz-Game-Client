import React from "react";
import Question from './Question';
import '../css/questionList.css';

class QuestionList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            error: null,
            questions: [],
            selectedQuestionId: null
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e) => {
        let targetEl = e.target.parentNode;
        console.log(targetEl.parentNode);
        const selectedQuestionIndex = targetEl.getAttribute("dataset-id");

        this.setState({
            selectedQuestionId: selectedQuestionIndex
        });

    }

    componentDidMount() {
        fetch("http://localhost:8087/question")
            .then(res => res.json())
            .then((result) => {
                console.log(result)
                //let questionResultList = [];


                this.setState({
                    isLoaded: true,
                    questions: result
                });
            }, (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            })
    }

    render() {
        const { isLoaded, error, questions, selectedQuestionId } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            if (selectedQuestionId !== null) {
                return (<Question questId={selectedQuestionId} />);
            } else {
                return (
                    <article id="question-list">
                        <h2>Question List</h2>
                        <section className="question-container">
                            {questions.map((quest) => (
                                <div className="question-row" key={quest.id} dataset-id={quest.id} onClick={this.handleClick} >
                                    <div className="column">Field: </div>
                                    <div className="column">{quest.field}</div>
                                    <div className="column">Points: </div>
                                    <div className="column">{quest.points}</div>
                                </div>
                            ))}

                        </section>
                    </article>);
            }
        }

    }
}

export default QuestionList;