import { func } from 'prop-types'
import { useEffect, useRef } from 'react'
import { useImmerReducer } from 'use-immer'
import App from './../react-dog-game/src/App'

// we don't want multiple pics of the same breed in
// each round of the game
function onlyUniqueBreeds(pics) {
  // this function takes in the pics data from
  // the dogs api
  const uniqueBreeds = []
  // creating an empty array for unique dogs
  // that we will push to during our iteration
  const uniquePics = pics.filter((pic) => {
    // filtering through all the pics in the
    // dog json data from the api
    const breed = pic.split('/')[4]
    // for each pic, we are setting breed equal to
    // that pic data string split on the /
    if (!uniqueBreeds.includes(breed) && !pic.includes(' ')) {
      // if our unique breeds array does not already
      // include the breed for each iteration and the
      // the pic is not empty, then we push that
      // breed to our unique breeds array and return
      // true
      uniqueBreeds.push(breed)
      return true
    }
  })
  // now we are getting exactly 4 pics for our round
  // of the game from our unique breeds array
  return uniquePics.slice(0, Math.floor(uniquePics.length / 4) * 4)
}

function ourReducer(draft, action) {
  if (draft.points > draft.highScore) draft.highScore = draft.points

  switch (action.type) {
    case 'receiveHighScore':
      draft.highScore = action.value
      if (!action.value) draft.highScore = 0
      return
    case 'decreaseTime':
      if (draft.timeRemaining <= 0) {
        draft.playing = false
      } else {
        draft.timeRemaining--
      }
      return
    case 'guessAttempt':
      if (!draft.playing) return
      if (action.value === draft.currentQuestion.answer) {
        draft.points++
        draft.currentQuestion = generateQuestion()
      } else {
        draft.strikes++
        if (draft.strikes >= 3) {
          draft.playing = false
        }
      }
      return
    case 'startPlaying':
      draft.timeRemaining = 30
      draft.points = 0
      draft.strikes = 0
      draft.playing = true
      draft.currentQuestion = generateQuestion()
      return
    case 'addToCollection':
      draft.bigCollection = draft.bigCollection.concat(action.value)
      return
  }

  function generateQuestion() {
    if (draft.bigCollection.length <= 12) {
      draft.fetchCount++
    }

    if (draft.currentQuestion) {
      draft.bigCollection = draft.bigCollection.slice(
        4,
        draft.bigCollection.length
      )
    }

    const tempRandom = Math.floor(Math.random() * 4)
    const justFour = draft.bigCollection.slice(0, 4)
    return {
      breed: justFour[tempRandom].split('/')[4],
      photos: justFour,
      answer: tempRandom,
    }
  }
}

const initialState = {}

function HeartIcon(props) {}

function App() {
  const timer = useRef(null)
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {})
}
