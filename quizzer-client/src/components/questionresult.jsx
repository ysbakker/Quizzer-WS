import React from 'react'

export default function QuestionResult(props) {
  const { correct, answer } = props
  if (correct === undefined) return null
  else return <div className={`question-result${correct ? ' correct' : ' incorrect'}`}>
    {correct
      ? <>
        <img src="/img/check.svg" alt="correct indicator" />
        <p>Correct!</p>
      </>
      : <>
        <img src="/img/cross.svg" alt="incorrect indicator" />
        <p>Incorrect!</p>
        <p className="answer">The correct answer was:<span>{answer}</span></p>
      </>}
  </div>
}