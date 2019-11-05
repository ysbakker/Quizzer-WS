import React from 'react';
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router'

import Landing from '../components/landing'
import LandingForm from '../components/landingform'

import Logo from '../components/logo'
import LoadingSpinner from '../components/loadingspinner'
import ListView from '../components/listview'
import ApproveItem from '../components/approveitem'

import * as appStateActions from '../actions/appStateActions'
import * as adminStateActions from '../actions/adminStateActions'
import * as quizStateActions from '../actions/quizStateActions'

import createRoomAction from '../actions/async/createRoomAction'
import verifyTeamAction from '../actions/async/verifyTeamAction'
import startRoundAction from '../actions/async/startRoundAction'
import setCategoriesAction from '../actions/async/setCategoriesAction';
import setQuestionAction from '../actions/async/setQuestionAction';
import fetchQuestionsAction from '../actions/async/fetchQuestionsAction';
import AdminView from './adminview';
import SelectItem from '../components/selectitem';
import closeQuestionAction from '../actions/async/closeQuestionAction';
import verifyAnswerAction from '../actions/async/verifyAnswerAction';

/************************
 ** AdminApp Component **
 ************************/

class AdminApp extends React.Component {
  /**
   * landingViewComponent returns the component that
   * should render in the landing view based on appState.status
   */
  landingViewComponent = () => {
    const { props } = this
    const { appState } = props
    // Form values dependent on current app status
    const formValues = {
      'enteringName': {
        fieldType: 'text',
        fieldName: 'name',
        fieldPlaceholder: 'The Liberty Well',
        fieldMaxLength: 16,
        label: 'Enter an interesting room name',
        validation: {
          min: 2,
          max: 16
        }
      },
      'enteringPassword': {
        fieldType: 'password',
        fieldName: 'pass',
        fieldPlaceholder: 'welcome123',
        fieldMaxLength: 16,
        label: 'Enter a password for your room',
        validation: {
          min: 2,
          max: 16
        }
      }
    }

    switch (appState.status) {
      case 'enteringName': {
        return <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={name => {
            props.updateStatus('enteringPassword')
            props.updateRoomName(name)
          }}
        />
      }
      case 'enteringPassword': {
        return <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={password => {
            props.updateRoomPassword(password)
            props.createRoom()
          }}
        />
      }
      default:
        return null
    }
  }

  componentDidMount() {
    const { props } = this

    if (props.appState.status === 'enteringRoom') props.updateStatus('enteringName')
  }

  /**
   * TeamApp render
   */

  render() {
    const ApproveListView = ListView(ApproveItem)
    const SelectListView = ListView(SelectItem)

    const { props } = this
    const { appState, adminState, quizState } = props

    if (appState.status === 'loading') return <div className="team-landing">
      <Logo />
      <LoadingSpinner
        text={appState.loadingMessage !== undefined && appState.loadingMessage !== null
          ? appState.loadingMessage
          : "Waiting..."}
      />
    </div>

    return <Switch>
      <Route exact path="/quizmaster/create">
        <Landing>
          {this.landingViewComponent()}
        </Landing>
      </Route>
      <Route exact path="/quizmaster/verifyteams">
        <AdminView
          buttons={[
            { text: `Start round ${quizState.round + 1}`, clickHandler: props.startRound }
          ]}
        >
          <ApproveListView
            title='Approve teams'
            items={adminState.pendingTeams.map(team => { return { id: team._id, text: team.name } })}
            handlers={{
              acceptHandler: (id) => props.verifyTeam(id, true),
              denyHandler: (id) => props.verifyTeam(id, false)
            }}
          />
          />
        </AdminView>
      </Route>
      <Route exact path="/quizmaster/pickcategories">
        <AdminView
          buttons={[
            { text: `Pick Question 1`, clickHandler: () => props.setCategories(quizState.roundCategories) }
          ]}
        >
          <SelectListView
            title={`Pick up to ${3 - quizState.roundCategories.length} more categor${quizState.roundCategories.length === 2 ? 'y' : 'ies'}`}
            items={quizState.allCategories.map(cat => ({ id: cat, text: cat }))}
            selectedIds={quizState.roundCategories}
            handlers={{
              onSelectHandler: (cat) => {
                if (quizState.roundCategories.length < 3) props.addCategory(cat)
              },
              onDeselectHandler: (cat) => props.deleteCategory(cat)
            }}
          />
        </AdminView>
      </Route>
      <Route exact path="/quizmaster/pickquestion">
        <AdminView
          buttons={quizState.questionNr >= 12
            ? [{
              text: `Next Round`, clickHandler: () => {
                props.startRound()
                props.quizState.roundCategories.forEach(cat => props.deleteCategory(cat))
              }
            }, {
              text: `Stop Quiz`, clickHandler: () => {
                props.history.push('/quizmaster/pickcategories')
              }
            }]
            : [
              { text: `Open Question ${quizState.questionNr + 1}`, clickHandler: () => props.setQuestionAsync(quizState.question) }
            ]}
        >
          {quizState.questionNr < 12
            ? <SelectListView
              title={`Pick a question`}
              items={quizState.pickableQuestions.map(q => ({ id: q._id, text: q.question.replace(/`/g, '\''), sub: { Category: q.category, Answer: q.answer.replace(/`/g, '\'') } }))}
              selectedIds={quizState.question ? quizState.question._id.split() : null}
              handlers={{
                onSelectHandler: (q) => props.setQuestion({ _id: q }),
                onDeselectHandler: (q) => null // do nothing
              }}
            />
            : null
          }
        </AdminView>
      </Route>
      <Route exact path="/quizmaster/verifyanswers">
        <AdminView
          buttons={quizState.question && quizState.question.open
            ? [{ text: `Close Question ${quizState.questionNr}`, clickHandler: () => props.closeQuestion() }]
            : [{
              text: `Next Question`, clickHandler: () => {
                props.history.push('/quizmaster/pickquestion')
                props.fetchQuestions()
              }
            }]
          }
        >
          {quizState.question && quizState.question.open ?
            <SelectListView
              title={`Waiting for answers...`}
              items={adminState.teamAnswers.map(a => ({ id: a.team._id, text: `"${a.answer}"`, sub: { Team: a.team.name } }))}
              selectedIds={[]}
              handlers={{
                onSelectHandler: () => null, // do nothing
                onDeselectHandler: () => null // do nothing
              }}
            /> :
            <ApproveListView
              title={`Verify Answers`}
              items={adminState.teamAnswers.map(a => ({ id: a.team._id, text: `"${a.answer}"`, sub: { Team: a.team.name } }))}
              handlers={{
                acceptHandler: (team) => props.verifyAnswer(team, true),
                denyHandler: (team) => props.verifyAnswer(team, false)
              }}
            />}
        </AdminView>
      </Route>

      <Route exact path="/quizmaster" render={() => {
        props.history.push(`/quizmaster/create`)
      }} />
    </Switch>
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
    adminState: state.adminState,
    quizState: state.quizState
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateStatus: status => dispatch(appStateActions.updateStatusAction(status)),
    updateRoomName: name => dispatch(appStateActions.updateRoomNameAction(name)),
    updateRoomPassword: password => dispatch(adminStateActions.updateRoomPasswordAction(password)),
    createRoom: password => dispatch(createRoomAction(password)),
    verifyTeam: (teamid, accepted) => dispatch(verifyTeamAction(teamid, accepted)),
    startRound: () => dispatch(startRoundAction()),
    addCategory: cat => dispatch(quizStateActions.addCategoryAction(cat)),
    deleteCategory: cat => dispatch(quizStateActions.deleteCategoryAction(cat)),
    setCategories: cats => dispatch(setCategoriesAction(cats)),
    fetchQuestions: amt => dispatch(fetchQuestionsAction(amt)),
    setQuestion: q => dispatch(quizStateActions.setQuestionAction(q)),
    setQuestionAsync: q => dispatch(setQuestionAction(q)),
    closeQuestion: () => dispatch(closeQuestionAction()),
    verifyAnswer: (team, correct) => dispatch(verifyAnswerAction(team, correct))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminApp)