import { React, Component } from 'react';
import QuestionHeader from './QuestionHeader';
import QuestionDescription from './QuestionDescription';
import AnswerBox from './AnswerBox';
import FeedbackBox from './FeedbackBox';
import '../css/question.css';

class Question extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            questions: [],
            question: null,
            correctAnswer: null,
            answers: [],
            clickedTimes: 0
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    /**
     * Function to handle click on selected Answer in given question
     * @param {any} e
     */
    handleClick = (e) => {
        let _this = this;
        if (this.state.clickedTimes < 1) {

            // gets target element
            let targetEl = e.target.parentNode;
            let selectedAnswerIndex = targetEl.getAttribute('dataset-id');

            // grabs user selected answer + selected question
            const selectedAnswer = this.findAnswerById(selectedAnswerIndex);
            const selectedQuestion = this.state.question;

            // creates a new instace of a answeredQuestion
            const answeredQuestionDTO = {
                answer: selectedAnswer.id
            };

            // calls post endpoint
            let newAnsweredQuestion = null;
            fetch('http://localhost:8087/question/' + selectedQuestion.id + '/answer/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "answer": answeredQuestionDTO.answer })
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                newAnsweredQuestion = data;

                if (newAnsweredQuestion.trueAnswer === true) {
                    targetEl.classList.add('green');
                } else {
                    targetEl.classList.add('red');
                }

                _this.setState({
                    clickedTimes: 1,
                    correctAnswer: newAnsweredQuestion
                });
                let feedBackArea = document.getElementById("feeback-area");
                feedBackArea.classList.toggle("hidden-field");
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    /**
     * Function to handle reset of page
     * @param {any} e
     */
    handleReset = (e) => {
        window.location.reload();
    }

    /**
     * Function to find an answer by id
     * @param {any} idx
     * @returns null || answer
     */
    findAnswerById(idx) {
        let answers = this.state.answers;

        if (answers.length > 0) {
            for (let key in answers) {
                try {
                    if (parseInt(answers[key].id) === parseInt(idx)) {
                        return answers[key];
                    }
                } catch (error) {
                    throw new error;
                }
            }
        } else {
            return null;
        }
    };

    componentDidMount() {
        /* /quesition/:id
         * fetch question from database
         */
        // TODO Fix hardcoded ID
        // "29c19107-9a91-45ae-8f27-9fb96c095d10"
        fetch("http://localhost:8087/question/"+ this.props.questId)
            .then(res => res.json())
            .then(
                (result) => {
                    let questionResult = result;
                    let answersResultSet = [];

                    Array.from(questionResult.answers).forEach((item) => {
                        if (item !== null) {
                            answersResultSet.push(item);
                        }
                    });

                    this.setState({
                        isLoaded: true,
                        question: questionResult,
                        answers: answersResultSet
                    });
                },

                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    render() {
        const { isLoaded, error, question, answers, correctAnswer } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            if (correctAnswer !== null) {
                return (
                    <article id="page-header">
                    <div>
                        <QuestionHeader category={question.category} field={question.field} points={question.points}></QuestionHeader>
                        <QuestionDescription description={question.description}></QuestionDescription>
                    </div>
                    <div className="answers-container">
                        {answers.map((answerProperty) => (
                            <div className="answer-suggestions" key={answerProperty.id} dataset-id={answerProperty.id} onClick={this.handleClick} >
                                <AnswerBox key={answerProperty.id} answer={answerProperty.answerName} />
                            </div>
                        ))}
                    </div>
                    <div id="feeback-area" className="hidden-field">
                        <FeedbackBox explanation={correctAnswer.explanation} url={correctAnswer.url} />
                    </div>
                    <div id="reset-area">
                            <button onClick={this.handleReset}>
                                Try Again
                            </button>
                    </div>
                </article>
                );
            } else {
                return (
                    <article id="page-header">
                        <div>
                            <QuestionHeader category={question.category} field={question.field} points={question.points}></QuestionHeader>
                            <QuestionDescription description={question.description}></QuestionDescription>
                        </div>

                        <div className="answers-container">
                            {answers.map((answerProperty) => (
                                <div className="answer-suggestions" key={answerProperty.id} dataset-id={answerProperty.id} onClick={this.handleClick} >
                                    <AnswerBox key={answerProperty.id} answer={answerProperty.answerName} />
                                </div>
                            ))}
                        </div>
                        <div id="reset-area">
                            <button onClick={this.handleReset}>
                                Try Again
                            </button>
                    </div>
                    </article>
                );
            }
        }
    }

}


export default Question;