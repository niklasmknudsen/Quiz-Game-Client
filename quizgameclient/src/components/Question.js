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
            correctAnswer: {},
            answers: [],
            clickedTimes: 0
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e) => {
        if (this.state.clickedTimes < 1) {
            // call method to clear elements from color classes.
            this.clearAnswersFromColors();
            // gets target element
            let targetEl = e.target.parentNode;
            let selectedAnswerIndex = targetEl.getAttribute('dataset-id');

            // grabs user selected answer + selected question
            const selectedAnswer = this.findAnswerById(selectedAnswerIndex);
            const selectedQuestion = this.state.question;

            console.log(selectedAnswer)
            // creates a new instace of a answeredQuestion
            const answeredQuestionDTO = {
                answer: selectedAnswer.id

            };
            console.log(selectedQuestion.id);

            // calls post endpoint
            this.createAnsweredQuestion(selectedQuestion, answeredQuestionDTO, selectedAnswer);

            this.setState({
                clickedTimes: 1
            });
        }
    };

    /**
     * Method to create a new instance of answeredQuestion
     * @param {any} newAnsweredQuestion
     */
    createAnsweredQuestion(selectedQuestion, AnsweredQuestionDTO, selectedAnswer) {
        let newAnsweredQuestion = null;
        let feedBackArea = document.getElementById("feeback-area");
        ///assets/data/answeredQuestion.json
        fetch('http://localhost:8087/question/' + selectedQuestion.id + '/answer/', {
            method: 'post',
            body: JSON.stringify(AnsweredQuestionDTO)
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            newAnsweredQuestion = data;



            this.setState({
                correctAnswer: newAnsweredQuestion
            });


            if (newAnsweredQuestion.id === selectedAnswer.id) {
                targetEl.classList.add('green');

                console.log(targetEl.classList.contains('green'));
            } else {
                targetEl.classList.add('red');
                let childElements = document.querySelectorAll('.answer-suggestions');

                /*
                for (let i = 0; i < childElements.length; i++) {
                    try {
                        let correctAnswerIndex = parseInt(newAnsweredQuestion.id);
                        let answerIndexes = parseInt(childElements[i].getAttribute('dataset-id'));

                        if (correctAnswerIndex == answerIndexes) {
                            childElements[i].classList.add('green');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } */
            }

            feedBackArea.classList.toggle("hidden-field");

            return newAnsweredQuestion;
        }).catch((error) => {
            console.log(error);
        });
    };

    clearAnswersFromColors() {
        let childElements = document.querySelectorAll('.answer-suggestions');

        for (let i = 0; i < childElements.length; i++) {
            if (childElements[i].classList.contains('green')) {
                childElements[i].classList.remove('green');
            } else if (childElements[i].classList.contains('red')) {
                childElements[i].classList.remove('red');
            }
        }
    };

    /**
     * Method to find an answer by id
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
        fetch("http://localhost:8087/question/29c19107-9a91-45ae-8f27-9fb96c095d10")
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

                    console.log(answersResultSet)
                    this.setState({
                        isLoaded: true,
                        question: questionResult,
                        answers: answersResultSet
                    });
                    console.log(this.state.correctAnswer);
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
                </article>
            );
        }
    }

}


export default Question;