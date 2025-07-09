const calculator = document.querySelector('.calculator');
const display = calculator.querySelector('.calculator-display');
const keys = calculator.querySelector('.calculator-keys');

let firstValue = '';
let operator = '';
let secondValue = '';
let previousKeyType = '';

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        const displayedNum = display.value;

        if (!action) {
            // It's a number key
            if (displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate') {
                display.value = keyContent;
            } else {
                display.value = displayedNum + keyContent;
            }
            previousKeyType = 'number';
        } else if (
            action === 'add' ||
            action === 'subtract' ||
            action === 'multiply' ||
            action === 'divide'
        ) {
            // It's an operator key
            if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
                const calcValue = calculate(firstValue, operator, displayedNum);
                display.value = calcValue;
                firstValue = calcValue;
            } else {
                firstValue = displayedNum;
            }
            operator = action;
            previousKeyType = 'operator';
        } else if (action === 'decimal') {
            // It's the decimal key
            if (!displayedNum.includes('.')) {
                display.value = displayedNum + '.';
            } else if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
                display.value = '0.';
            }
            previousKeyType = 'decimal';
        } else if (action === 'clear') {
            // It's the AC key
            firstValue = '';
            operator = '';
            secondValue = '';
            display.value = '0';
            previousKeyType = 'clear';
        } else if (action === 'calculate') {
            // It's the equal key
            if (firstValue) {
                secondValue = displayedNum;
                if (previousKeyType === 'calculate') {
                    firstValue = displayedNum;
                    secondValue = display.dataset.previousValue || displayedNum;
                }
                display.value = calculate(firstValue, operator, secondValue);
                display.dataset.previousValue = secondValue; // Store for repeated equals
            }
            previousKeyType = 'calculate';
        }
    }
});

function calculate(n1, operator, n2) {
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);
    let result = 0;

    if (operator === 'add') {
        result = num1 + num2;
    } else if (operator === 'subtract') {
        result = num1 - num2;
    } else if (operator === 'multiply') {
        result = num1 * num2;
    } else if (operator === 'divide') {
        if (num2 === 0) {
            return 'Error'; // Handle division by zero
        }
        result = num1 / num2;
    }
    // Limit decimal places to avoid floating point issues, e.g., 0.1 + 0.2 = 0.30000000000000004
    return parseFloat(result.toFixed(10)).toString();
}