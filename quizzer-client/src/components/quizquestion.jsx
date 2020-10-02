import React from 'react'
import LandingForm from './landingform'
import Logo from './logo'

export default function QuizQuestion(props) {
  const { roomname, round, questionNr, question, submittedAnswer, submitAnswer } = props
  return <div className="team-quiz">
    <Logo />
    <div className="quizzer-info">
      <p>"{roomname}"</p>
      <p>Round {round}</p>
    </div>
    <div className="quizzer-question">
      <h2>Question {questionNr}</h2>
      <p className="category">{question ? question.category : ''}</p>
      <p className="question">"{question ? question.question : ''}"</p>
      <LandingForm
        formData={{
          fieldType: 'text',
          fieldName: 'answer',
          fieldPlaceholder: submittedAnswer ? submittedAnswer : 'Answer',
          fieldMaxLength: 50,
          label: 'Your Answer',
          validation: {
            min: 2,
            max: 50
          }
        }}
        handleSubmit={answer => {
          if (!submittedAnswer || answer.toLowerCase() !== submittedAnswer.toLowerCase()) submitAnswer(answer)
        }}
      />
    </div>
  </div>
}