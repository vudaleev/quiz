// Все варианты ответа
const option1 = document.querySelector('.option1'),
      option2 = document.querySelector('.option2'),
      option3 = document.querySelector('.option3'),
      option4 = document.querySelector('.option4');

const optionElements = document.querySelectorAll('.option');          // Все наши варианты ответа в массиве
const question = document.getElementById('question');                 // сам вопрос

const numberOfQuestion = document.getElementById('number-of-question'),          // номер вопроса
      numberOfAllQuestions = document.getElementById('number-of-all-questions'); // количество всех вопросов

let indexOfQuestion,   // индекс текущего вопроса
    indexOfPage = 0;   // индекс страницы

const answersTracker = document.getElementById('answers-tracker');   // обёртка трекера
const btnNext = document.getElementById('btn-next');                 // кнопка далее

let score = 0;  // итоговый результат викторины

const correctAnswer = document.getElementById('correct-answer'),                     // количество правильных ответов
      numberOfAllQuestions2 = document.getElementById('number-of-all-questions-2'),  // колличество всех вопросов в модальном окне
      btnTryAgain = document.getElementById('btn-try-again');                        // кнопка начасть с начала

const questions = [
    {
        question: 'Какое из перечисленных ниже слов не является зарезервированным словом в JavaScript ?',
        options: [
            'default',
            'throw',
            'finally',
            'undefined', 
        ],
        rightAnswer: 4
    },
    {
        question: 'Является ли элемент «else» обязательным в конструкции условия?',
        options: [
            'Да',
            'Нет',
            'Зависит от версии JS',
            'В разных браузерах по-разному', 
        ],
        rightAnswer: 2
    },
    {
        question: 'С каких из указанных знаков не может начинаться название переменной?',
        options: [
            '2',
            'A',
            '$',
            '_', 
        ],
        rightAnswer: 1
    },
    {
        question: 'Каким методом можно получить данные, введенные пользователем?',
        options: [
            'alret()',
            'confirm()',
            'promt()',
            'message()', 
        ],
        rightAnswer: 3
    },
    {
        question: 'Какой из указанных методов добавляет элемент в конец массива?',
        options: [
            'pop()',
            'push()',
            'shift()',
            'unshift()', 
        ],
        rightAnswer: 2
    },
];

numberOfAllQuestions.innerHTML = questions.length;             // выводим колличество вопросов в htmml

const load = () => {                                           // загружаем вопросы
    question.innerHTML = questions[indexOfQuestion].question;  // сам вопрос

    // мапим ответы
    option1.innerHTML = questions[indexOfQuestion].options[0];
    option2.innerHTML = questions[indexOfQuestion].options[1];
    option3.innerHTML = questions[indexOfQuestion].options[2];
    option4.innerHTML = questions[indexOfQuestion].options[3];

    numberOfQuestion.innerHTML = indexOfPage + 1;   // установка номера текущей страницы
    indexOfPage++;                                  // увеличение индекса страницы
};

let completedAnswers = [];                          // массив для уже заданых вопросов

const randomQuestion = () => {
    let randomNumber = Math.floor(Math.random() * questions.length);
    let hitDuplicate = false;                       // якорь длля проверки одинаковых вопросов

    if(indexOfPage == questions.length) {
        quizOver()
    } else {
        if(completedAnswers.length > 0) {           // если в уже заданных вопросах чтото-то есть
            completedAnswers.forEach(item => {
                if(item == randomNumber) {          // и этот вопрос равен рандомному числу
                    hitDuplicate = true;            // меняем якорь
                }
            });
            if(hitDuplicate) {                      // если якорь true - запускаем функцию заново
                randomQuestion();
            } else {                                // есои нет - присваем индексу вопроса рандомное число  и вызываем функцию подгрузки
                indexOfQuestion = randomNumber;
                load();
            }
        }
        if(completedAnswers.length == 0) {           
            indexOfQuestion = randomNumber;
            load();
        }
    }
    completedAnswers.push(indexOfQuestion);                               // заполняем массив
};

const checkAnswer = (el) => {                                             // функция проверки ответов
    if(el.target.dataset.id == questions[indexOfQuestion].rightAnswer) {  // если data ответа равна номеру ответа из объкта вопроса в массиве опросов
        el.target.classList.add('correct');
        updateAnswerTracker('correct')                                                    
        score++                                                           
    } else {
        el.target.classList.add('wrong');
        updateAnswerTracker('wrong')
    }
    disabledOptions();                                                    // блокируем выбор ответов
};

const disabledOptions = () => {                                           // показываем правильный ответ и блокируем выбор всех ответов         
    optionElements.forEach(item => {
        item.classList.add('disabled');                                   // блокируем все ответы
        if(item.dataset.id == questions[indexOfQuestion].rightAnswer) {   // если ответ правильный - добавляем класс
            item.classList.add('correct');
        }
    }) 
};
 
const enableOptions = () => {                                              // удаляем все классы
    optionElements.forEach(item => {
        item.classList.remove('disabled', 'correct', 'wrong');
    })
};

const answerTracker = () => {
    questions.forEach(() => {                  
        const div = document.createElement('div');                       // создаём div в трекере
        answersTracker.appendChild(div);                                 // добавляем div
    })
};

const updateAnswerTracker = (status) => {                                // заекрашиваем трекер
    answersTracker.children[indexOfPage - 1].classList.add(`${status}`)  // обращаемся div трекера по индексу страницы и добавляем статус
};

const validate = () => {                                                 // проверка выбора ответа
    if(!optionElements[0].classList.contains('disabled')) {              // если у элемента нет класс disabled, то есть варианты не выбраны
        alert('Выберите один из вариантов ответа')
    } else {
        randomQuestion();
        enableOptions();
    }
};

const quizOver = () => {                                                 // функция окончания игры
    document.querySelector('.quiz-over-modal').classList.add('active');
    correctAnswer.innerHTML = score;
    numberOfAllQuestions2.innerHTML = questions.length;
};

const tryAgain = () => {           
    window.location.reload();                                            // перезагружаем страницу
};

btnTryAgain.addEventListener('click', tryAgain);

btnNext.addEventListener('click', () => {        
    validate();
});

window.addEventListener('load', () => {                                   // вызываем функцию load только после загрузки html
    randomQuestion();
    answerTracker();
})


for(option of optionElements) {                                           // перебераем каждый option в массиве, для получения именно html элемента потребуется использовать target
    option.addEventListener('click', e => checkAnswer(e));                // вызываем функцию проверки ответа и предаём ей наш ответ(e)
}