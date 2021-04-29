import React from "react";

class QuestionList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            error: null,
            questions: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:8087/question")
            .then(res => res.json())
            .then((result) => {
                console.log(result)
            }, (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            })
    }

    render() {
        return (
            <div>Question List</div>
        );
    }
}


export default QuestionList