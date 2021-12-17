// 1. Написать игру по добыче криптомонет на чистом js. В самом начале монету можно добыть только по нажатию на клавишу D(d). Далее монету можно отправить в стейкинг на определенное количество времени 30дн/60дн/90дн, после чего застейканные монеты будут "добывать" новые монеты (процент от x) по формуле: (десятичный логарифм от x) * (коэффициент периода 20/35/50). Пусть 1 день в игре равен 1 секунде. После истечения периода стейкинга монеты возвращаются в кошелек вместе с добычей. Отправлять в стейкинг можно неограниченное количество раз одновременно. Учтите, что каждые 100 дней монеты в кошельке сгорают на процент, равный натуральному логарифму от вашего кол-ва монет в кошельке. HTML-разметку и стили можно менять как угодно, но основные контролы должны оставаться (сумма в кошельке, input select btn для стейкинга, таблица с информацией). Округляем суммы до 4 знака после запятой. input принимает только числа, при вводе числа больше чем сумма в кошельке - выводим ошибку в любом удобном вам формате.
// Используйте самописный локальный state. 
// 2. Теперь пусть в вашем конфиге (config - объект, где будут храниться коэффициенты и настройки игры) 1день будет равен 0,4 секунды.
// Решаем у себя в IDE и выкладываем на github.


const config = {
    day: 0.4 * 1000,
    coefficient: {
      30: 20,
      60: 35,
      90: 50,
    },
  };

let button = document.querySelector('button');
let amount = document.querySelector('.amount');
let table = document.querySelector('table');
let globalSum = 0;
let idString = 0;

setInterval(function() {
    let globalSum = +document.querySelector('.amount').innerHTML;
    if (globalSum == 0) {
        amount.innerHTML = 0;
    }
    else {
        amount.innerHTML = `${(+(globalSum - Math.log(globalSum))).toFixed(4)}`;
    }
}, config.day * 100);


document.onkeypress = function(e) {
    globalSum = +document.querySelector('.amount').innerText;
    if (e.key !== 'd') {
        return
    }
    amount.innerHTML = `${++globalSum}`;
}

button.onclick = function() {
    let inputValue = +document.querySelector('input').value;

    if (inputValue == 0 || inputValue < 0 || inputValue > globalSum) {
        alert('Error');
    }
    else if (inputValue <= globalSum) {
        let periodValue = document.querySelector('select').value;
        
        table.insertAdjacentHTML('beforeend',
            `
             <tr class="srting" id="str${++idString}">
                 <td class="sum">${inputValue}</td>
                 <td class="period">${periodValue}</td>
                 <td class="time-left">${periodValue}</td>
                 <td id="" class="production">0</td>
             </tr>
            `
        );
        
        amount.innerHTML = `${(globalSum - inputValue).toFixed(4)}`
        
        let sum = +document.querySelector(`#str${idString} .sum`).innerText;
        let production = +document.querySelector(`#str${idString} .production`).innerText; 
        let productionTD = document.querySelector(`#str${idString} .production`);
        let timeLeftTD = document.querySelector(`#str${idString} .time-left`)
        let timeCoeff = +document.querySelector(`#str${idString} .period`).innerText;
        let interval = setInterval(() => {

            productionTD.innerHTML = production;
            timeLeftTD.innerHTML = `${periodValue}`;
            
            if (periodValue == 0) {
                globalSum = +document.querySelector('.amount').innerText;
                balance = +((globalSum + production + sum).toFixed(4))
                amount.innerHTML = `${balance}`;
                clearInterval(interval)
                return 
            }
            periodValue -= 1;
            production = +(((Math.log10(sum) * config.coefficient[timeCoeff])/100).toFixed(4));
        }, config.day, timeCoeff)

       
    }
    document.querySelector('input').value = 0;
}
