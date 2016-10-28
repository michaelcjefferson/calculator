// Leftovers: negative functionality - doesn't work on ans/result of equals, seems clunky when used before any number is input
// Ans and exp functionality - can't use exp after pressing ans
$('document').ready(function() {
  var ans, lastPressed;
  var input = [];
  var display = '0';
  var active = false;
  var expActive = false;
  var reDigit = /[0-9\.]/;
  var reOp = /[\/\*\-\+]/;
  
  function findNum(input) {
    console.log('Finding number');
    var index = 0;
    for (var i = 0; i < input.length; i++) {
      if (!/\d/.test(input[i])) {
        index = i + 1;
        console.log(index);
      }
    }
    return index;
  }
  
  function rounder(number) {
    return Math.round((number + 0.000001) * 1000) / 1000;
  }

  $('.display').html(display);

  $('button').click(function() {
    console.log('Active:', active, 'display:', display, 'input:', input, 'ans:', ans, 'lastPressed:', lastPressed);
    // All-Clear button
    if (this.value === 'ac') {
      if (expActive) {
        expActive = false;
      }
      input = [];
      display = '0';
      $('.display').html(display);
      lastPressed = this.value;
      active = false;
      return;
    }

    // Equals button
    if (this.value === '=') {
      if (lastPressed === '=' || (expActive && !(/\d/.test(lastPressed)))) {
        return;
      }
      if (expActive) {
        input[input.length-1] += ')';
        expActive = false;
      }
      display = rounder(eval(input.join('')));
      $('.display').html(display);
      ans = display;
      input = [];
      lastPressed = this.value;
      return;
    }

    // Negative button
    if (this.value === 'neg') {
      if (active && (input[0] === '-')) {
        input.shift();
        display = display.slice(1);
        $('.display').html(display);
        lastPressed = this.value;
        return;
      } else if (active) {
        input.unshift('-');
        display = '-' + display;
        $('.display').html(display);
        lastPressed = this.value;
        return;
      }
    }

    // Exponential button
    if (this.value === 'exp') {
      if (!(/[\d=]/.test(lastPressed))) {
        return;
      }
      if (lastPressed === '=') {
        input = [ans];
      }
      var indexToChange = findNum(input);
      input[indexToChange] = 'Math.pow(' + input[indexToChange];
      input[input.length-1] += ', ';
      display += '^';
      $('.display').html(display);
      lastPressed = this.value;
      expActive = true;
      return;
    }

    // Answer button
    if (this.value === 'ans') {
      if (expActive) {
        expActive = false;
      }
      newAns = ans.toString();
      display = newAns;
      $('.display').html(display);
      input = [newAns];
      active = true;
      lastPressed = this.value;
      return;
    }

    // All numerals and the decimal
    if (reDigit.test(this.value)) {
      if (!active) {
        active = true;
        display = '';
      }
      if (lastPressed === '=') {
        display = '';
        input = [];
      }
      input.push(this.value);
      display += this.value;
      $('.display').html(display);
      lastPressed = this.value;
      return;
    }

    // All operators
    if (reOp.test(this.value)) {
      // Make sure that the most recent input wasn't another operator
      if (reOp.test(input[input.length - 1])) {
        return;
      }
      if (active) {
        // If an operator is pressed after equals, operate on the most recent evaluation
        if (lastPressed === '=') {
          input = [ans];
        }
        if (expActive) {
          if (!(/\d/.test(lastPressed))) {
            return;
          }
          input[input.length-1] += ')';
          expActive = false;
        }
        input.push(this.value);
        display += (' ' + this.value + ' ');
        $('.display').html(display);
        lastPressed = this.value;
        return;
      }
    }
  });

  // console.log(eval('Math.pow(-2, 3)'));
});