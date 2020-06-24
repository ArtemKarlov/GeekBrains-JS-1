let userAnswer;
let logAnswer = {};
let i = 1;

askQuestion('a');
switch(userAnswer) {
    case 1:
        logAnswer['answer' + i++] = works.a1;
        askQuestion('b');
        switch(userAnswer) {
            case 1:
                logAnswer['answer' + i++] = works.b1;
                askQuestion('d');
                break;
            case 2:
                logAnswer['answer' + i++] = works.b2;
                askQuestion('d');
                break;
            case -1: 
                break;
            default:
                alert('Ошибка');
        }
        break;
    case 2:
        logAnswer['answer' + i++] = works.a2;
        askQuestion('c');
        switch(userAnswer) {
            case 1:
                logAnswer['answer' + i++] = works.c1;
                askQuestion('d');
                break;
            case 2:
                logAnswer['answer' + i++] = works.c2;
                askQuestion('d');
                break;
            case -1: 
                break;
            default:
                alert('Ошибка');
        }
        break;
    case -1: 
        break;
    default:
        alert('Ошибка');
}
alert('Спасибо за игру');
let logItem = +prompt("Ответ под каким номером Вы хотите посмотреть?");
alert(logAnswer['answer' + logItem]);

console.log(logAnswer);

// //------------------------------------------

function askQuestion(questItem) {
    let isOkAnswer;
    do {
        isOkAnswer = false;
        userAnswer = +prompt(works[questItem + '00'] + works[questItem + '1'] + works[questItem + '2'] + '-1 - Выход из игры');
        if (userAnswer == -1) {
            break;
        } else {
            isOkAnswer = isAnswer(works[questItem + '0'], userAnswer);
        }
    } while (!isOkAnswer);
}


function isAnswer(q, event) {
    if (Number.isNaN(event) || !Number.isFinite(event)) {
        alert('Вы ввели недопустимый символ');
        return false;
    }
    else if (event < 1 || event > q) {
        alert('Ваше число выходит из допустимого диапозона');
        return false;
    }
	return true;
}
