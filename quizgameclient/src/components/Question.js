import { React, Component } from 'react';
import QuestionHeader from './QuestionHeader';
import QuestionDescription from './QuestionDescription';
import AnswerBox from './AnswerBox';

class Question extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            questions: [],
            answers: []
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e) => {
        let targetEl = e.target;
        let selectedAnswer = targetEl.parentNode.getAttribute('dataset-id');


    };


    createAnsweredQuestion(selectedAnswer) {

    }

    componentDidMount() {
        // fetch question from database
        fetch("/assets/data/question.json")
            .then(res => res.json())
            .then(
                (result) => {
                    let questionResultSet = [];
                    let answersResultSet = [];
                    questionResultSet.push(result);

                    questionResultSet.forEach((element, index) => {
                        Array.from(element.answers).forEach((item) => {
                            if (item !== null) {
                                answersResultSet.push(item);
                            }
                        });
                    });
                    this.setState({
                        isLoaded: true,
                        questions: questionResultSet,
                        answers: answersResultSet
                    });
                    console.log(this.state.answers);
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
        const { isLoaded, error, questions, answers } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <article id="page-header">
                    <div>
                        {questions.map((item) => (
                            <div key={item.id}>
                                <QuestionHeader category={item.category} field={item.field} points={item.points}></QuestionHeader>
                                <QuestionDescription description={item.description}></QuestionDescription>
                            </div>
                        ))}
                    </div>

                    <div className="">
                        {answers.map((answerProperty) => (
                            <div key={answerProperty.answer.id} dataset-id = { answerProperty.answer.id } onClick = { this.handleClick } >
                                <AnswerBox key={answerProperty.answer.id} answer={answerProperty.answer.answerName} />
                            </div>
                        ))}
                    </div>
                </article>
            );   
        }
    }

}


export default Question;