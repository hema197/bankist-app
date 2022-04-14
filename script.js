'use strict';

//Data
const account1 = {
    owner : 'Hema Sinha',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    pin: 2222,
    movementsDates: [
        '2021-12-04T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-07-26T17:01:17.194Z',
        '2020-07-28T23:36:17.929Z',
        '2020-08-01T10:51:36.790Z',
      ],
    currency: 'INR',
    locale: 'en-US', // de-DE
};

const account2 = {
    owner: 'Shriya Sinha',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    pin: 2345,
    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
      ],
    currency: 'INR',
    locale: 'en-US',    
};

const account3 = {
    owner:'Ritu Singh',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    pin: 2389,
    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-07-26T17:01:17.194Z',
        '2020-07-28T23:36:17.929Z',
        '2020-08-01T10:51:36.790Z',
      ],
    currency: 'INR',
    locale: 'en-US', // de-DE
};

const account4 = {
    owner: 'Ankita Rajput',
    movements: [430, 1000, 700, 50, 90],
    pin: 2390,
    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
      ],
    currency: 'INR',
    locale: 'en-US',  
};

const accounts =[account1, account2, account3, account4];
computeUsername(accounts);

const options = {
    hour: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    minute: 'numeric',
    weekday: 'long'
}
const now = new Date();
//ELements
const appDiv = document.querySelector('.app');
const movementsDiv = document.querySelector('.movements');

const welcomeLabel = document.querySelector('.welcome');
const dateLabel = document.querySelector('.date');
const balanceLabel = document.querySelector('.balance__value');
const sumInLabel = document.querySelector('.summary__value--in');
const sumOutLabel = document.querySelector('.summary__value--out');
const timerLabel = document.querySelector('.timer');

const loginUsername = document.querySelector('.login__input--user');
const loginPin = document.querySelector('.login__input--pin');
const closeUsername = document.querySelector('.form__input--user');
const closePin = document.querySelector('.form__input--pin');
const transferAmount = document.querySelector('.form__input--amount');
const transferTo = document.querySelector('.form__input--to');
const loanAmount = document.querySelector('.form__input--loan-amount');

const loginButton = document.querySelector('.login__btn');
const sortButton = document.querySelector('.btn--sort');
const closeButton = document.querySelector('.form__btn--close');
const loanButton = document.querySelector('.form__btn--loan');
const transferButton = document.querySelector('.form__btn--transfer');



//Functions

const showMovements = function(account, sort= false){
    movementsDiv.innerHTML = '';
    const movs = sort ? account.movements.slice().sort((a,b) => a-b) : account.movements; 
    movs.forEach((mov, index) => {
        const transferType = mov>0 ? 'deposit' :'withdrawal';
        const date = new Date(account.movementsDates[index]);
        const displayDate = formatDate(date, account.locale);
        const formattedMov = new Intl.NumberFormat(account.locale, {
            style: 'currency',
            currency: account.currency
        }).format(mov);
        const transferRowTemplate  = ` 
        <div class="movements__row">
            <div class="movements__type movements__type--${transferType}">${index + 1} ${transferType}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formattedMov}</div>
        </div>`
        movementsDiv.insertAdjacentHTML('afterbegin', transferRowTemplate);       
    }); 
}

function computeUsername(accounts){
    accounts.forEach(acc => {
        acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('');
    })   
}

const calcSummary = function(acc){
    const deposits = acc.movements.filter(mov => mov>0);
    const withdrawals = acc.movements.filter(mov => mov<0);
    const inAmount = deposits.reduce((sum , mov) => sum + mov, 0);
    const outAmount = withdrawals.reduce((sum, mov) => sum + mov, 0);
    sumInLabel.textContent = `${currencyFormatter(acc.locale, acc.currency, inAmount)}`;
    sumOutLabel.textContent = `${currencyFormatter(acc.locale, acc.currency, outAmount)}`;
}

const currencyFormatter = (locale, currency, value) => {
    const formattedValue = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(value);
    return formattedValue;
}

const displayBalance = function(acc){
    acc.balance = acc.movements.reduce((bal, mov) => 
        bal + mov
    , 0)
    const formattedBal = currencyFormatter(acc.locale, acc.currency, acc.balance)
    balanceLabel.textContent = `${formattedBal}`   
}

const updateUI = function(account){
    displayBalance(account);
    calcSummary(account);
    showMovements(account);
}

function formatDate(date, locale){
const calcDaysPassed = (date1, date2) => 
    Math.round(Math.abs(date2 - date1)/(1000 * 60*60*24));


const daysPassed = calcDaysPassed(new Date(), date);
if(daysPassed === 0){
    return 'Today';
}
if(daysPassed === 1){
    return 'Yesterday';
}
if(daysPassed <=7){
    return (`${daysPassed} days ago`);
}
return new Intl.DateTimeFormat(locale).format(date);
}

const logoutTimer = function(){
    let time = 100;
    const tick = function(){
        const min = String(Math.trunc(time/60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        timerLabel.textContent = `${min}:${sec}`;
        if(time === 0){
            clearInterval(timer);
            appDiv.style.opacity = 0;
            welcomeLabel = 'Log in to get started!'
        }
        time--;
    }
    
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
}

//Event Listeners

let currentAccount = accounts[0], timer;
appDiv.style.opacity = 100;
updateUI(currentAccount);
dateLabel.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);
  welcomeLabel.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}!`
  timer = logoutTimer();


loginButton.addEventListener('click', function(e){
    e.preventDefault();
    currentAccount = accounts.find(acc => 
        acc.username === loginUsername.value
    )
    if(currentAccount?.pin === +loginPin.value){
        welcomeLabel.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}!`;
        appDiv.style.opacity = 100;
        loginUsername.value = loginPin.value = '';
        loginPin.blur();
        updateUI(currentAccount);
        if(timer) {
            clearInterval(timer);
        }
        timer = logoutTimer();
    }
});

transferButton.addEventListener('click', function(e){
    e.preventDefault();
    const amount = Number(transferAmount.value); 
    const receiverAcc = accounts.find( acc => acc.username === transferTo.value);
    transferAmount.value = transferTo.value = '';
    if(amount > 0  && currentAccount.balance>= amount && receiverAcc &&  currentAccount.username !== receiverAcc?.username){
      currentAccount.movements.push(-amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());
      receiverAcc.movements.push(amount);
      updateUI(currentAccount);
      clearInterval(timer);
      timer = logoutTimer();
    }
})

closeButton.addEventListener('click', function(e){
    e.preventDefault();
   if(currentAccount.username === closeUsername?.value && currentAccount.pin === Number(closePin?.value)){
       const index = accounts.findIndex( acc => {
           acc.username === currentAccount.username;
       })
       console.log(index);
       closePin.value = closeUsername.value = '';
       appDiv.style.opacity = 0;
       accounts.splice(index, 1);
   }    
})

loanButton.addEventListener('click', function(e){
    e.preventDefault();
    const requestAmount = Math.floor(Number(loanAmount.value));
    if(requestAmount > 0 && currentAccount.movements.some((mov) => 
         mov >= 0.1 * requestAmount
    )){
        setTimeount(function(){
        currentAccount.movements.push(requestAmount);
        currentAccount.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount);
        loanAmount.value = '';
        }, 3000);
    }
    clearInterval(timer);
    timer = logoutTimer();
})

let sorted = false;
sortButton.addEventListener('click', function(){
   showMovements(currentAccount.movements, !sorted);
   sorted = !sorted;
})