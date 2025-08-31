const field = document.querySelector('.field');
const startBtn = document.querySelector('.btn-start');
const levelBlock = document.querySelector('.difficulty-level');
const levelBtn = document.querySelectorAll('.difficulty-level .btn')
const difficultyTitle = document.querySelector('.difficulty-title');
const gameTitle = document.querySelector('.game-title p')

let defaultLevel = 'light'

const gameState = {
  x: 0,
  y: 0,
  nextBlockValue: 1,
  error: 0,
  arr: [],
  timeOut: null,
}

const levels = {
  light: { timeVision: 5000, countError: 4 },
  middle: { timeVision: 4000, countError: 3 },
  hard: { timeVision: 3000, countError: 2 }
}

difficultyTitle.innerHTML = `Можешь допустить <span class="difficulty-title-count">${levels[defaultLevel].countError - 1}</span> ошибки.`

const difficultyLevel = () => {
  const level = levels[defaultLevel]
  timeVision = level.timeVision
  countError = level.countError
  difficultyTitle.innerHTML = `Можешь допустить <span class="difficulty-title-count">${countError - 1}</span> ${countError === 2 ? 'ошибку' : 'ошибки'}.`
  // gameTitle.innerHTML = `(level: ${defaultLevel})`
}

levelBlock.addEventListener('click', (event) => {
  const target = event.target
  if (target.matches('.difficulty-title-count, .difficulty-title, .difficulty-level')) return

  target.blur();
  defaultLevel = event.target.getAttribute('data-level')

  levelBtn.forEach(block => {
    block.classList.remove('active')
    target.classList.add('active')
  })
  difficultyLevel()
})


const gameInitial = () => {
  let gameDifficulty = defaultLevel
  gameTitle.innerHTML = `(level: ${gameDifficulty})`
  gameState.x = 0;
  gameState.y = 0;
  gameState.error = 0;
  gameState.nextBlockValue = 1;


  if (gameState.timeOut) {
    clearTimeout(gameState.timeOut)
  }

  gameState.arr = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort((a, b) => 0.5 - Math.random())
  field.innerHTML = '';
  startBtn.blur();
  document.removeEventListener('keydown', moveBlocks);

  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const div = document.createElement('div');
      div.classList.add('block')
      div.textContent = gameState.arr[i * 3 + k]
      field.append(div)

      if (i === 0 && k === 0) {
        div.classList.add('active')
      }
    }
  }

  gameState.timeOut = setTimeout(() => {
    const blocks = document.querySelectorAll('.block');
    blocks.forEach(block => {
      block.textContent = ''
      document.addEventListener('keydown', moveBlocks);
    })
  }, timeVision);

}


const moveBlocks = (event) => {
  const blocks = document.querySelectorAll('.block');

  if (event.key !== 'ArrowUp' && event.key !== 'ArrowRight' && event.key !== 'ArrowDown' && event.key !== 'ArrowLeft' && event.key !== 'Enter') {
    return
  }

  switch (event.key) {
    case 'ArrowUp':
      gameState.y = gameState.y - 1 < 0 ? gameState.y = 2 : gameState.y - 1
      break
    case 'ArrowDown':
      gameState.y = gameState.y + 1 > 2 ? gameState.y = 0 : gameState.y + 1
      break
    case 'ArrowLeft':
      gameState.x = gameState.x - 1 < 0 ? gameState.x = 2 : gameState.x - 1
      break
    case 'ArrowRight':
      gameState.x = gameState.x + 1 > 2 ? gameState.x = 0 : gameState.x + 1
      break
    case 'Enter':
      if (gameState.nextBlockValue === gameState.arr[gameState.y * 3 + gameState.x]) {
        blocks[gameState.y * 3 + gameState.x].textContent = gameState.arr[gameState.y * 3 + gameState.x]
        gameState.nextBlockValue++

      } else {
        gameState.error++
        if (gameState.error >= countError) {
          setTimeout(() => {
            alert('Ты проиграл, попробуй еще раз')
            gameInitial()
          }, 300)
        } else {
          alert(`Ошибка ${gameState.error}`)
        }
      }

      if (gameState.nextBlockValue === 10) {
        setTimeout(() => {
          alert('Ура! Отличная память, ты победил!')
          gameInitial()
        }, 300)
      }
      break
  }

  blocks.forEach(block => block.classList.remove('active'))
  blocks[gameState.y * 3 + gameState.x].classList.add('active')
}
difficultyLevel()
startBtn.addEventListener('click', gameInitial)
