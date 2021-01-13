const fieldSizePx = 400
let cellSize = 100
const CellNumberArray = [2, 3, 4, 5, 6, 7, 8]
let currentFieldSize = 4
let allCellNumberField = null
const empty = {
    value: 0,
    top: 0,
    left: 0,
    size: null,
    element: null,
}
const timeCount = {
    min: 0,
    sec: 0,
}
let timerId = 0
let movesCount = 0
const cells = []
let numbers = []
let savedGameCount = {}
let bestScoresCount = [{
    moves: "Ходов",
    time: "Время",
    size: "Размер"
}]
let gameSaveFlag = false
let imgBgFlag = true
let imgBg

const gameWrap = document.createElement('div')
const menuWrap = document.createElement('div')
const timeInfo = document.createElement('div')
const timerText = document.createElement('span')
const timeValue = document.createElement('span')
const numberMovesCount = document.createElement('span')
const field = document.createElement('div')
const movesInfo = document.createElement('div')
const numberMoves = document.createElement('span')
const menuOverlay = document.createElement('span')

function initGame() {
    gameWrap.classList.add('game_wrapper')
    menuWrap.classList.add('menu_wrapper')
    timeValue.classList.add('menu_timer')
    numberMovesCount.classList.add('menu_moves')
    pauseButton.classList.add('menu_button')
    field.classList.add('field')
    menuOverlay.classList.add('overlay', 'visible')
    timerText.innerHTML = "Время "
    timeValue.innerHTML = `${addZero(timeCount.min)}:${addZero(timeCount.sec)}`
    numberMoves.innerHTML = "Ходов "
    numberMovesCount.innerText = movesCount
    pauseButton.innerHTML = "Пауза"
    pauseButton.addEventListener('click', () => {
        gamePause()
    })
    gameWrap.appendChild(menuWrap)
    gameWrap.appendChild(field)
    gameWrap.appendChild(soundElement)
    menuWrap.appendChild(timeInfo)
    menuWrap.appendChild(movesInfo)
    menuWrap.appendChild(pauseButton)
    timeInfo.appendChild(timerText)
    timeInfo.appendChild(timeValue)
    movesInfo.appendChild(numberMoves)
    movesInfo.appendChild(numberMovesCount)
    field.appendChild(initNewGame())
    field.appendChild(menuOverlay)
    menuOverlay.appendChild(initMainMenu())
    menuOverlay.appendChild(popupWonGame())
    menuOverlay.appendChild(gameSaveInit())
    menuOverlay.appendChild(bestScoreCreate())
    document.body.appendChild(gameWrap)
}

function generateNumbers() {
    allCellNumberField = currentFieldSize * currentFieldSize
    return [...Array(allCellNumberField).keys()].sort(() => Math.random() - 0.5)
}

function generateArray() {
    numbers = generateNumbers()
    const resultHaveSolution = haveSolution()
    !resultHaveSolution ? generateArray() : 1
}

function initNewGame() {
    generateArray()
    imgBg = `assets/images/${Math.floor(Math.random()*15 + 1)}.jpg`
    field.style.backgroundImage = ''
    numberMovesCount.innerText = movesCount
    cellSize = fieldSizePx / currentFieldSize
    const fragment = document.createDocumentFragment()
    movesCount = 0
    for (let i = 0; i <= allCellNumberField - 1; i++) {

        if (numbers[i] === 0) {
            const cell = document.createElement('div')
            cell.classList.add('empty')
            empty.value = allCellNumberField
            const left = i % currentFieldSize
            const top = (i - left) / currentFieldSize
            empty.left = left
            empty.top = top
            empty.size = fieldSizePx / currentFieldSize
            empty.element = cell
            cells.push(empty)
            cell.style.left = `${left * cellSize}px`
            cell.style.top = `${top * cellSize}px`
            cell.style.width = `${fieldSizePx / currentFieldSize}px`
            cell.style.height = `${fieldSizePx / currentFieldSize}px`
            fragment.appendChild(cell)
        } else {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            const value = numbers[i]
            cell.innerHTML = value
            const left = i % currentFieldSize
            const top = (i - left) / currentFieldSize
            if (imgBgFlag) {
                const posLeft = (numbers[i] - 1) % currentFieldSize;
                const posTop = (numbers[i] - 1 - posLeft) / currentFieldSize;
                cell.style.backgroundImage = `url(${imgBg})`;
                cell.style.backgroundSize = `${currentFieldSize*100}%`;
                cell.style.backgroundPosition = `-${posLeft*100}% -${posTop*100}%`;
            }
            cells.push({
                value: value,
                left: left,
                top: top,
                size: fieldSizePx / currentFieldSize,
                element: cell
            })
            cell.style.left = `${left * cellSize}px`
            cell.style.top = `${top * cellSize}px`
            cell.style.width = `${fieldSizePx / currentFieldSize}px`
            cell.style.height = `${fieldSizePx / currentFieldSize}px`
            fragment.appendChild(cell)
            cell.addEventListener('click', () => {
                move(i)
            })
            cell.addEventListener('mousedown', (event) => {
                dragDrop(i, event)
            })
        }
    }
    return fragment
}

const pauseButton = document.createElement('button')
const mainMenu = document.createElement('div')

function clearField() {
    mainMenu.classList.remove('active')
    pauseButton.classList.remove('active')
    cells.length = 0
    numbers.length = 0
    movesCount = 0
    clearCell()
    clearTimer()
    field.appendChild(initNewGame())
    timerId = window.setInterval(startTimer, 1000)
}

const saveGame = document.createElement('div')
const savedGameHeader = document.createElement('span')
const savedGameData = document.createElement('div')
const savedGameSize = document.createElement('span')
const savedGameTime = document.createElement('span')
const savedGameMoves = document.createElement('span')
const savedGameLoad = document.createElement('button')

function initMainMenu() {
    const fragment = document.createDocumentFragment()
    const saveGameText = document.createElement('span')
    const saveGameButton = document.createElement('button')
    const newGame = document.createElement('button')
    const savedGame = document.createElement('button')
    const bestScore = document.createElement('button')
    const fieldSize = document.createElement('form')
    const fieldSizeText = document.createElement('label')
    const fieldSizeСhoiceUl = document.createElement('select')
    saveGameText.innerHTML = "Сохранить игру?"
    saveGameButton.innerHTML = "сохранить"
    newGame.innerHTML = "Новая игра"
    savedGame.innerHTML = "Сохранённые игры"
    bestScore.innerHTML = "Рекорды"
    fieldSizeText.innerHTML = "Размер поля"
    imageAsBg.innerHTML = "Фоновое изображение: выкл"
    MuteOnOff.innerHTML = "Звук: вкл"
    mainMenu.classList.add('menu_container', 'active')
    saveGame.classList.add('save_game_container')
    saveGameText.classList.add('save_game_text')
    saveGameButton.classList.add('save_game_button')
    newGame.classList.add('main_menu_button')
    savedGame.classList.add('main_menu_button')
    bestScore.classList.add('main_menu_button')
    fieldSize.classList.add('main_menu_field-size')
    fieldSizeText.classList.add('main_menu_field-label')
    fieldSizeСhoiceUl.classList.add('main_menu_field-select')
    imageAsBg.classList.add('main_menu_button')
    MuteOnOff.classList.add('main_menu_button', 'mute_on')
    fragment.appendChild(mainMenu)
    fragment.appendChild(saveGame)
    saveGame.appendChild(saveGameText)
    saveGame.appendChild(saveGameButton)
    mainMenu.appendChild(newGame)
    mainMenu.appendChild(savedGame)
    mainMenu.appendChild(bestScore)
    mainMenu.appendChild(fieldSize)
    mainMenu.appendChild(imageAsBg)
    mainMenu.appendChild(MuteOnOff)
    fieldSize.appendChild(fieldSizeText)
    fieldSize.appendChild(fieldSizeСhoiceUl)
    for (let i = 0; i < CellNumberArray.length; i++) {
        const fieldSizeСhoiceLi = document.createElement('option')
        fieldSizeСhoiceLi.setAttribute('value', `${CellNumberArray[i]}`)
        if (CellNumberArray[i] === 4) {
            fieldSizeСhoiceLi.setAttribute('selected', "selected")
        }
        fieldSizeСhoiceLi.classList.add('main_menu_field-text')
        fieldSizeСhoiceLi.innerHTML = `${CellNumberArray[i]}x${CellNumberArray[i]}`
        fieldSizeСhoiceUl.appendChild(fieldSizeСhoiceLi)
    }
    newGame.addEventListener('click', () => {
        clearField()
        gameSaveFlag = true
    })
    savedGame.addEventListener('click', () => {
        mainMenu.classList.remove('active')
        saveGame.classList.remove('active')
        savedGameWrapper.classList.add('active')
        gameSaveView()
    })
    bestScore.addEventListener('click', () => {
        mainMenu.classList.remove('active')
        saveGame.classList.remove('active')
        bestScoreWrapper.classList.add('active')
        bestScoreView()
    })
    fieldSizeСhoiceUl.addEventListener('click', () => {
        currentFieldSize = fieldSizeСhoiceUl.value
    })
    imageAsBg.addEventListener('click', () => {
        if (imgBgFlag) {
            imgBgFlag = false;
            imageAsBg.innerHTML = "Фоновое изображение: вкл";
        } else {
            imgBgFlag = true;
            imageAsBg.innerHTML = "Фоновое изображение: выкл";
        }
        imageAsBgToggle();
    })
    MuteOnOff.addEventListener('click', () => {
        muteToggle()
    })
    saveGameButton.addEventListener('click', () => {
        gameSaveRecord()
        gameSaveFlag = false
    })
    return fragment
}

const popupWonWrapper = document.createElement('div')

function gamePause() {
    pauseButton.classList.toggle('active')
    popupWonWrapper.classList.remove('active')
    if (pauseButton.classList.contains('active')) {
        field.appendChild(menuOverlay)
        stopTimer()
        mainMenu.classList.add('active')
        saveGame.classList.add('active')
    } else {
        mainMenu.classList.remove('active')
        saveGame.classList.remove('active')
        bestScoreWrapper.classList.remove('active')
        field.removeChild(menuOverlay)
        timerId = window.setInterval(startTimer, 1000)
        gameSaveFlag = true
    }
}

function imageAsBgToggle(imgBgFlag) {
    if (imgBgFlag) {
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i]
            if (cells[i].value !== currentFieldSize * currentFieldSize) {
                const posLeft = (cells[i].value - 1) % currentFieldSize
                const posTop = (cells[i].value - 1 - posLeft) / currentFieldSize
                cell.element.style.backgroundImage = `url(${imgBg})`
                cell.element.style.backgroundSize = `${currentFieldSize*100}%`
                cell.element.style.backgroundPosition = `-${posLeft*100}% -${posTop*100}%`
            }
        }
    } else {
        field.style.backgroundImage = ''
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i]
            if (cells[i].value !== currentFieldSize * currentFieldSize) {
                cell.element.style.backgroundImage = ""
            }
        }
    }
}

function move(index) {
    const cell = cells[index]
    const leftDiff = Math.abs(empty.left - cell.left)
    const topDiff = Math.abs(empty.top - cell.top)
    if (leftDiff + topDiff > 1) {
        cell.element.removeAttribute('draggable')
        return
    }
    cell.element.style.left = `${empty.left * cellSize}px`
    cell.element.style.top = `${empty.top * cellSize}px`
    const emptyLeft = empty.left
    const emptyTop = empty.top
    empty.left = cell.left
    empty.top = cell.top
    empty.element.style.left = `${empty.left * cellSize}px`
    empty.element.style.top = `${empty.top * cellSize}px`
    cell.left = emptyLeft
    cell.top = emptyTop
    movesCount += 1
    numberMovesCount.innerText = movesCount
    if (MuteOnOff.classList.contains('mute_on')) {
        playAudio()
    }
    cell.element.removeAttribute('draggable')
    const isFinished = cells.every(cell => {
        return cell.value === (cell.top * currentFieldSize + cell.left) + 1
    })
    if (isFinished) {
        stopTimer()
        setTimeout(wonAlert, 400)
    }
}

const bestScoreWrapper = document.createElement('div')
const wonSpanResultSize = document.createElement('span')
const wonSpanResultTime = document.createElement('span')
const wonSpanResultMove = document.createElement('span')
const bestScoreHeader = document.createElement('span')
const bestScoreData = document.createElement('div')
const bestScoreData1 = document.createElement('div')
const bestScoreData2 = document.createElement('div')
const bestScoreData3 = document.createElement('div')

function popupWonGame() {
    const fragment = document.createDocumentFragment()
    const wonSpanHeader = document.createElement('span')
    const wonSpanResult = document.createElement('span')
    const closePopup = document.createElement('button')
    wonSpanHeader.classList.add('popup_won-header')
    wonSpanResult.classList.add('popup_won-header')
    wonSpanResultSize.classList.add('popup_won-header')
    wonSpanResultTime.classList.add('popup_won-header')
    wonSpanResultMove.classList.add('popup_won-header')
    popupWonWrapper.classList.add('popup_won-container')
    closePopup.classList.add('popup_won-ok-button')
    wonSpanHeader.innerHTML = "Победа!"
    wonSpanResult.innerHTML = "Ваш результат:"
    closePopup.innerHTML = "Ок"
    fragment.appendChild(popupWonWrapper)
    popupWonWrapper.appendChild(wonSpanHeader)
    popupWonWrapper.appendChild(wonSpanResult)
    popupWonWrapper.appendChild(wonSpanResultSize)
    popupWonWrapper.appendChild(wonSpanResultTime)
    popupWonWrapper.appendChild(wonSpanResultMove)
    popupWonWrapper.appendChild(closePopup)
    closePopup.addEventListener('click', () => {
        popupWonWrapper.classList.remove('active')
        saveGame.classList.remove('active')
        mainMenu.classList.add('active')
    })
    return fragment
}

const savedGameWrapper = document.createElement('div')

function gameSaveInit() {
    const fragment = document.createDocumentFragment()
    const savedGameBack = document.createElement('button')
    savedGameWrapper.classList.add('saved_game-container')
    savedGameHeader.classList.add('saved_game-header')
    savedGameData.classList.add('saved_game-data')
    savedGameSize.classList.add('saved_game-text')
    savedGameTime.classList.add('saved_game-text')
    savedGameMoves.classList.add('saved_game-text')
    savedGameLoad.classList.add('saved_game-button-load')
    savedGameBack.classList.add('button-back')
    savedGameHeader.innerHTML = "Нет сохранённых игр"
    savedGameLoad.innerHTML = "Загрузить игру"
    savedGameBack.innerHTML = "Назад"
    fragment.appendChild(savedGameWrapper)
    savedGameWrapper.appendChild(savedGameHeader)
    savedGameWrapper.appendChild(savedGameData)
    savedGameData.appendChild(savedGameSize)
    savedGameData.appendChild(savedGameTime)
    savedGameData.appendChild(savedGameMoves)
    savedGameData.appendChild(savedGameLoad)
    savedGameWrapper.appendChild(savedGameBack)
    savedGameLoad.addEventListener('click', () => {
        gameSaveFromLS()
        field.appendChild(gameSaveLoading())
    })
    savedGameBack.addEventListener('click', () => {
        savedGameWrapper.classList.remove('active')
        mainMenu.classList.add('active')
        if (gameSaveFlag) {
            saveGame.classList.add('active')
        }
    })
    return fragment
}

function gameSaveView() {
    if ("name" in savedGameCount) {
        savedGameHeader.innerHTML = "Сохранённые игры"
        savedGameSize.innerHTML = `Размер ${savedGameCount.size}x${savedGameCount.size}`
        savedGameTime.innerHTML = `Время ${addZero(savedGameCount.timeMin)}:${addZero(savedGameCount.timeSec)}`
        savedGameMoves.innerHTML = `Ходов ${savedGameCount.move}`
        savedGameLoad.classList.add('active')
    } else {
        savedGameHeader.innerHTML = "Нет сохранённых игр"
    }
}

function gameSaveRecord() {
    savedGameCount.name = "1"
    savedGameCount.size = currentFieldSize
    savedGameCount.timeMin = timeCount.min
    savedGameCount.timeSec = timeCount.sec
    savedGameCount.move = movesCount
    savedGameCount.arrayValue = [...cells]
    savedGameCount.arrayEmptyValue = empty.value
    savedGameCount.arrayEmptyTop = empty.top
    savedGameCount.arrayEmptyLeft = empty.left
    savedGameCount.arrayEmptySize = empty.size
    savedGameCount.arrayEmptyElement = empty.element
    saveGame.classList.remove('active')
    localStorage.game = JSON.stringify(savedGameCount)
}

function gameSaveFromLS() {
    if (localStorage.game !== null && localStorage.game !== '' && localStorage.game !== undefined) {
        savedGameCount = JSON.parse(localStorage.game)
        const sizeFieldSave = savedGameCount.size * savedGameCount.size
        for (let i = 0; i <= sizeFieldSave - 1; i++) {
            const cell = document.createElement('div')
            if (savedGameCount.arrayValue[i].value === sizeFieldSave) {
                cell.classList.add('empty')
                cell.innerHTML = ''
                cell.style.left = `${savedGameCount.arrayValue[i].left * (fieldSizePx / savedGameCount.size)}px`
                cell.style.top = `${savedGameCount.arrayValue[i].top *  (fieldSizePx / savedGameCount.size)}px`
                cell.style.width = `${fieldSizePx / savedGameCount.size}px`
                cell.style.height = `${fieldSizePx / savedGameCount.size}px`
                savedGameCount.arrayValue[i].element = cell
                savedGameCount.arrayEmptyElement = cell
            } else {
                cell.classList.add('cell')
                cell.innerHTML = savedGameCount.arrayValue[i].value
                cell.style.left = `${savedGameCount.arrayValue[i].left *  (fieldSizePx / savedGameCount.size)}px`
                cell.style.top = `${savedGameCount.arrayValue[i].top *  (fieldSizePx / savedGameCount.size)}px`
                cell.style.width = `${fieldSizePx / savedGameCount.size}px`
                cell.style.height = `${fieldSizePx / savedGameCount.size}px`
                savedGameCount.arrayValue[i].element = cell
            }
            cell.addEventListener('click', () => {
                move(i)
            })
            cell.addEventListener('mousedown', (event) => dragDrop(i, event))
        }
    }
}

function gameSaveLoading() {
    mainMenu.classList.remove('active')
    pauseButton.classList.remove('active')
    savedGameWrapper.classList.remove('active')
    field.removeChild(menuOverlay)
    clearCell()
    cells.length = 0
    clearTimer()
    cellSize = savedGameCount.arrayEmptySize
    currentFieldSize = savedGameCount.size
    movesCount = savedGameCount.move
    timeCount.min = savedGameCount.timeMin
    timeCount.sec = savedGameCount.timeSec
    numberMovesCount.innerText = movesCount
    timeValue.innerHTML = `${addZero(timeCount.min)}:${addZero(timeCount.sec)}`
    const fragment = document.createDocumentFragment()
    const sizeFieldSave = savedGameCount.size * savedGameCount.size
    for (let i = 0; i <= sizeFieldSave - 1; i++) {
        cells[i] = savedGameCount.arrayValue[i]
        if (cells[i].value === sizeFieldSave) {
            empty.value = savedGameCount.arrayEmptyValue
            empty.left = savedGameCount.arrayEmptyLeft
            empty.top = savedGameCount.arrayEmptyTop
            empty.size = savedGameCount.arrayEmptySize
            empty.element = savedGameCount.arrayEmptyElement
            cells[i] = empty
        }
        fragment.appendChild(cells[i].element)
    }
    timerId = window.setInterval(startTimer, 1000)
    return fragment
}

function bestScoreCreate() {
    const fragment = document.createDocumentFragment()
    const bestScoreBack = document.createElement('button')
    bestScoreWrapper.classList.add('best_game-container')
    bestScoreHeader.classList.add('best_game-header')
    bestScoreData.classList.add('best_game-data')
    bestScoreData1.classList.add('best_game-text')
    bestScoreData2.classList.add('best_game-text')
    bestScoreData3.classList.add('best_game-text')
    bestScoreBack.classList.add('button-back')
    bestScoreHeader.innerHTML = "Рекорды"
    bestScoreBack.innerHTML = "Назад"
    fragment.appendChild(bestScoreWrapper)
    bestScoreWrapper.appendChild(bestScoreHeader)
    bestScoreWrapper.appendChild(bestScoreData)
    bestScoreWrapper.appendChild(bestScoreBack)
    bestScoreData.appendChild(bestScoreData1)
    bestScoreData.appendChild(bestScoreData2)
    bestScoreData.appendChild(bestScoreData3)

    bestScoreBack.addEventListener('click', () => {
        bestScoreWrapper.classList.remove('active')
        mainMenu.classList.add('active')
        if (gameSaveFlag) {
            saveGame.classList.add('active')
        }
    })
    return fragment
}

function wonAlert() {
    field.appendChild(menuOverlay)
    saveGame.classList.remove('active')
    stopTimer()
    popupWonWrapper.classList.add('active')
    wonSpanResultSize.innerHTML = `Размер ${currentFieldSize}x${currentFieldSize}`
    wonSpanResultTime.innerHTML = `Время ${addZero(timeCount.min)}:${addZero(timeCount.sec)}`
    wonSpanResultMove.innerHTML = `Ходов ${movesCount}`
    gameSaveFlag = false
    bestScoresRecord()
}

function bestScoresRecord() {
    if (localStorage.score !== null && localStorage.score !== '' && localStorage.score !== undefined) {
        bestScoresCount = JSON.parse(localStorage.score)
    }
    if (bestScoresCount.length < 11) {
        bestScoresCount.push({
            moves: movesCount,
            time: `${addZero(timeCount.min)}:${addZero(timeCount.sec)}`,
            size: `${currentFieldSize}x${currentFieldSize}`
        })
    } else {
        const lastBest = bestScoresCount.length - 1
        if (movesCount < bestScoresCount[lastBest].moves) {
            bestScoresCount[lastBest].moves = movesCount
            bestScoresCount[lastBest].time = `${addZero(timeCount.min)}:${addZero(timeCount.sec)}`
            bestScoresCount[lastBest].size = `${currentFieldSize}x${currentFieldSize}`
        }
    }
    bestScoresCount.sort(function(a, b) {
        return a.moves - b.moves
    })
    localStorage.score = JSON.stringify(bestScoresCount)
}

function bestScoreView() {
    if (localStorage.score !== null && localStorage.score !== '' && localStorage.score !== undefined) {
        bestScoresCount = JSON.parse(localStorage.score)
    }

    bestScoreData1.innerHTML = bestScoresCount[0].moves + '<br>'
    bestScoreData2.innerHTML = bestScoresCount[0].time + '<br>'
    bestScoreData3.innerHTML = bestScoresCount[0].size + '<br>'

    for (let i = 1; i < bestScoresCount.length; i++) {
        bestScoreData1.innerHTML += `<br>${bestScoresCount[i].moves}`
        bestScoreData2.innerHTML += `<br>${bestScoresCount[i].time}`
        bestScoreData3.innerHTML += `<br>${bestScoresCount[i].size}`
    }
}

function dragDrop(index) {
    const cell = cells[index]
    cell.element.setAttribute('draggable', true)
    document.addEventListener("dragstart", function(event) {
        event.target.style.opacity = 0
    }, false)
    document.addEventListener("dragend", function(event) {
        event.target.style.opacity = ""
        cell.element.style.transition = ""
    }, false)
    document.addEventListener("dragover", function(event) {
        event.preventDefault()
    }, false)

    document.addEventListener("dragenter", function(event) {
        if (event.target.className === "empty") {
            event.target.style.background = "rgb(200, 200, 225)"
        }
    }, false)
    document.addEventListener("dragleave", function(event) {
        if (event.target.className == "empty") {
            event.target.style.background = ""
        }
    }, false)
    document.addEventListener("drop", function(event) {
        event.preventDefault()
        if (event.target.className === "empty" && cell.element.hasAttribute('draggable')) {
            move(index)
            event.target.style.background = ""
            cell.element.style.transition = "none"
        }
    }, false)
}

function startTimer() {
    timeCount.sec += 1
    if (timeCount.sec === 60) {
        timeCount.sec = 0
        timeCount.min += 1
    }
    timeValue.innerHTML = `${addZero(timeCount.min)}:${addZero(timeCount.sec)}`
}

function stopTimer() {
    window.clearInterval(timerId)
}

function clearTimer() {
    timeCount.sec = 0
    timeCount.min = 0
    timeValue.innerHTML = `${addZero(timeCount.min)}:${addZero(timeCount.sec)}`
}

function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n
}

function clearCell() {
    const cellContainer = document.querySelector(".field")
    while (cellContainer.firstChild) {
        cellContainer.removeChild(cellContainer.firstChild)
    }
}

function haveSolution() {
    let count = 0
    for (let i = 0; i < numbers.length; i++) {
        const elemNumber = i
        let j = i
        if (numbers[elemNumber] === 0 && currentFieldSize % 2 === 0) {
            const rowZero = (elemNumber - elemNumber % currentFieldSize) / currentFieldSize
            count += rowZero + 1
        } else {
            while (j < numbers.length) {
                if (numbers[elemNumber] > numbers[j] && numbers[j] !== 0) {
                    count += 1
                }
                j++
            }
        }
    }
    return count % 2 === 0
}

const MuteOnOff = document.createElement('button')
const soundElement = document.createElement('div')
const imageAsBg = document.createElement('button')
soundElement.classList.add('audio', 'hidden')
soundElement.innerHTML = `<audio class="audio_file" src="assets/sounds/sound.mp3"></audio>`

function muteToggle() {
    MuteOnOff.classList.toggle('mute_on')
    MuteOnOff.innerHTML = MuteOnOff.classList.contains('mute_on') ? `<span>Звук: вкл</span>` : `<span>Звук: выкл</span>`
}

function playAudio() {
    const audio = document.querySelector('audio')
    if (audio) {
        audio.currentTime = 0
        audio.play()
    }
}

initGame()
gameSaveFromLS()
