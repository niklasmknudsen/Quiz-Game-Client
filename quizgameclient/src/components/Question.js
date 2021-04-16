import { React, Component } from 'react';
import QuestionHeader from './QuestionHeader';
import QuestionDescription from './QuestionDescription';
import AnswerBox from './AnswerBox';
import FeedbackBox from './FeedbackBox';

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

            // creates a new instace of a answeredQuestion
            const answeredQuestionDTO = {
                question: selectedQuestion,
                answer: selectedAnswer.answer
            };

            // calls post endpoint
            this.createAnsweredQuestion(answeredQuestionDTO);

            // handle DOM manipulation of correct answer. 
            if (this.state.correctAnswer.answer.id === selectedAnswer.answer.id) {
                targetEl.classList.add('green');

                console.log(targetEl.classList.contains('green'));
            } else {
                targetEl.classList.add('red');
                let childElements = document.querySelectorAll('.answer-suggestions');

                for (let i = 0; i < childElements.length; i++) {
                    try {
                        let correctAnswerIndex = parseInt(this.state.correctAnswer.answer.id);
                        let answerIndexes = parseInt(childElements[i].getAttribute('dataset-id'));

                        if (correctAnswerIndex == answerIndexes) {
                            childElements[i].classList.add('green');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

            let feedBackArea = document.getElementById("feeback-area").classList.toggle("hidden-field");

            this.setState({
                clickedTimes: 1
            });
        }
    };

    /**
     * Method to create a new instance of answeredQuestion
     * @param {any} newAnsweredQuestion
     */
    createAnsweredQuestion(AnsweredQuestionDTO) {
        let newAnsweredQuestion = null;

        fetch('/assets/data/answeredQuestion.json', {
            method: 'post',
            body: JSON.stringify(AnsweredQuestionDTO)
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            newAnsweredQuestion = data;




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
                    if (parseInt(answers[key].answer.id) === parseInt(idx)) {
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

    /**
     * Method used to find correct answer from the selected Question answers
     * @param {any} array
     */
    findCorrectAnswer(array) {
        let found = null;
        for (let key in array) {
            if (array[key].answer.trueAnswer === true) {
                found = array[key];
                break;
            }
        }

        return found;
    };


    componentDidMount() {
        /* /quesition/:id
         * fetch question from database
         */
        fetch("/assets/data/question.json")
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
                        correctAnswer: this.findCorrectAnswer(answersResultSet),
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

                    <div className="">
                        {answers.map((answerProperty) => (
                            <div className="answer-suggestions" key={answerProperty.answer.id} dataset-id = { answerProperty.answer.id } onClick = { this.handleClick } >
                                <AnswerBox key={answerProperty.answer.id} answer={answerProperty.answer.answerName} />
                            </div>
                        ))}
                    </div>
                    <div id="feeback-area" className="hidden-field">
                        <FeedbackBox explanation={correctAnswer.answer.explanation} url={correctAnswer.answer.url} />
                    </div>
                </article>
            );   
        }
    }

}


export default Question;