document.addEventListener("DOMContentLoaded", function () {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  if (phoneInputs && phoneInputs.length) {
    const getInputNumbersValue = function (input) {
      return input.value?.replace(/\D/g, "");
    };

    const formatPhoneNumber = function (input, inputNumbersValue) {
      let formattedInputValue = "";
      const pattern = input.dataset.phonePattern || "+7(___) ___-__-__";
      const clearVal = input.dataset.phoneClear !== "false";

      if (!inputNumbersValue) {
        return clearVal ? "" : pattern.replace(/\D/g, "");
      }

      if (["7", "8", "9"].includes(inputNumbersValue[0])) {
        // Russian phone number handling
        if (inputNumbersValue[0] === "9" || inputNumbersValue[0] === "8") {
          inputNumbersValue = "7" + inputNumbersValue.slice(1);
        }
        formattedInputValue = "+7";

        if (inputNumbersValue.length > 1) {
          formattedInputValue += " (" + inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
          formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
          formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
          formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
        }
      } else {
        // Fallback to pattern-based formatting
        let i = 0;
        const def = pattern.replace(/\D/g, "");
        let val = inputNumbersValue;
        if (def.length >= val.length) val = def;
        formattedInputValue = pattern.replace(/./g, function (a) {
          return /[_\d]/.test(a) && i < val.length
            ? val.charAt(i++)
            : i >= val.length
            ? ""
            : a;
        });
      }

      return formattedInputValue;
    };

    const adjustCursorPosition = function (
      input,
      inputNumbersValue,
      selectionStart
    ) {
      try{
        if (input.value.length !== selectionStart) {
          let digitCountBefore = getInputNumbersValue(
            input.value.substring(0, selectionStart)
          ).length;
          let newPosition = 0;
          let digitsPassed = 0;
          const formattedValue = input.value;
  
          for (let i = 0; i < formattedValue.length; i++) {
            if (/\d/.test(formattedValue[i])) {
              digitsPassed++;
              if (digitsPassed === digitCountBefore) {
                newPosition = i + 1;
                break;
              }
            } else {
              newPosition = i + 1;
            }
          }
          input.setSelectionRange(newPosition, newPosition);
        }
      }catch{}
    };

    const onPhoneInput = function (e) {
      const input = e.target;
      let inputNumbersValue = getInputNumbersValue(input);
      const selectionStart = input.selectionStart;

      if (e.data && /\D/g.test(e.data)) {
        input.value = inputNumbersValue;
        return;
      }

      input.value = formatPhoneNumber(input, inputNumbersValue);
      adjustCursorPosition(input, inputNumbersValue, selectionStart);
    };

    const onPhoneBlur = function (e) {
      const input = e.target;
      const inputNumbersValue = getInputNumbersValue(input);
      const clearVal = input.dataset.phoneClear !== "false";
      const pattern = input.dataset.phonePattern || "+7(___) ___-__-__";

      if (
        clearVal &&
        inputNumbersValue.length < pattern.match(/([\_\d])/g).length
      ) {
        input.value = "";
      }
    };

    const onPhoneKeyUp = function (e) {
      const input = e.target;
      if (e.keyCode === 8 && getInputNumbersValue(input).length === 1) {
        input.value = "";
      }
      if (input.selectionStart <= 3) {
        input.setSelectionRange(4, 4);
      }
    };

    const onPhonePaste = function (e) {
      const input = e.target;
      const pasted = e.clipboardData || window.clipboardData;
      if (pasted) {
        const pastedText = pasted.getData("Text");
        if (!/\D/g.test(pastedText)) {
          input.value = formatPhoneNumber(input, pastedText.replace(/\D/g, ""));
        }
      }
    };

    const onPhoneClick = function (e) {
      const input = e.target;
      if (input.selectionStart <= 3) {
        input.setSelectionRange(4, 4);
      }
    };

    phoneInputs.forEach((input) => {
      input.setAttribute("maxlength", "18");
      input.setAttribute("minlength", "18");
      input.addEventListener("input", onPhoneInput);
      input.addEventListener("blur", onPhoneBlur);
      input.addEventListener("focus", onPhoneClick);
      input.addEventListener("keyup", onPhoneKeyUp);
      input.addEventListener("paste", onPhonePaste);
      input.addEventListener("click", onPhoneClick);
    });
  }
});
