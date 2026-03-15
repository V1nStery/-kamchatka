const quizes = document.querySelectorAll(".quiz-block, .quiz-modal");
if (quizes.length >= 1) {
  quizes.forEach((quiz) => {
    const line = quiz.querySelector(".line");
    const progressText = quiz.querySelector(".progress-text");
    const steps = quiz.querySelectorAll(".step");
    const btnNext = quiz.querySelectorAll(".next-step");
    const btnPrev = quiz.querySelectorAll(".prev-step");
    const variants = quiz.querySelectorAll(".variant");

    const quizParent = quiz.closest('.quiz')
    const title = quiz.querySelector(".quiz-block__title");
    const wrapper = quizParent?.querySelector(".quiz__inner");
    const additionalBlock = quizParent?.querySelector(".quiz__right");
    const subtitle = quiz.querySelector(".quiz-block__subtitle");
    const progressBar = quiz.querySelector(".progress-bar");

    // Добавляем проверки
    if (!steps.length || !line) return; // Если нет основных элементов, выходим

    const newTitle = "Вы стали шаг ближе к своей идеальной бане!";
    const newSubtitle = `
        Осталось совсем немного — просто оставьте свои контактные<br> данные, и мы предоставим вам подробную информацию<br> по подходящим вариантам и поможем с выбором
        `;
    const lineShow = 100 / steps.length;

    let count = 0;

    variants.forEach((btn) =>
      btn.addEventListener("change", function (btn) {
        if (steps[count].classList.contains("several")) return;
        nextStep();
      })
    );
    btnNext.forEach((btn) => btn.addEventListener("click", nextStep));
    btnPrev.forEach((btn) => btn.addEventListener("click", prevStep));

    function showFinishBlock() {
      quiz.classList.add('end')
      if (progressText) progressText.style.display = "none";
    }

    function nextStep() {
      const modalFooterText = steps[count].querySelector(".quiz-needs-select");

      if (count == steps.length - 2) {
        showFinishBlock();
      }

      if (validateInputs(steps, count)) {
        changeStep(steps, count, "increase");
        
        // Защищенные вызовы
        if (progressText) changeProgressText(progressText, "increase");
        changeLine(line, "increase");
        
        if (modalFooterText) modalFooterText.style.display = "none";
        count++;
        if(count === 1){
          ym(93990908, "reachGoal", "kviz1");
        }
        if(count === 2){
          ym(93990908, "reachGoal", "kviz2");
        }
        if(count === 3){
          ym(93990908, "reachGoal", "kviz3");
        }
        if(count === 4){
          ym(93990908, "reachGoal", "kviz4");
        }
      } else {
        if (modalFooterText) modalFooterText.style.display = "block";
      }
    }

    function prevStep() {
      const modalFooterText = steps[count].querySelector(".quiz-needs-select");

      if (modalFooterText) modalFooterText.style.display = "none";

      reversalInputs(steps, count);
      changeStep(steps, count, "decrease");
      
      // Защищенные вызовы
      if (progressText) changeProgressText(progressText, "decrease");
      changeLine(line, "decrease");
      
      count--;
    }

    // Остальные функции остаются без изменений
    function changeStep(steps, index, value) {
      if (value == "increase") {
        if (steps[index].classList.contains("active")) {
          steps[index].classList.remove("active");
          if (index != steps.length - 1)
            steps[index + 1].classList.add("active");
        }
      }

      if (value == "decrease") {
        if (steps[index].classList.contains("active")) {
          steps[index].classList.remove("active");
          if (index != 0) steps[index - 1].classList.add("active");
        }
      }
    }

    function changeProgressText(progText, value) {
      // Добавляем проверку внутри функции
      if (!progText) return;
      
      const num = progText.querySelector(".current-step");
      const text = progText.querySelector(".rp-rule__span");
      const firstWord = progText.querySelector(".progress-text__first-word");

      // Добавляем проверки элементов
      if (!num || !text || !firstWord) return;

      let numInt = Number(num.textContent);
      if (value == "increase") {
        num.textContent = numInt - 1;
        numInt = Number(num.textContent);
      }
      if (value == "decrease") {
        num.textContent = numInt + 1;
        numInt = Number(num.textContent);
      }
      if (numInt == -1)
        progText.innerHTML = `
              <div class="progress-text__inner">
                  <span>Последний шаг</span>
              </div>
              `;
      if (numInt == 1) {
        firstWord.textContent = "Остался";
        text.textContent = "вопрос";
      }
      if (numInt >= 2 && numInt <= 4) text.textContent = "вопроса";
      if (numInt == 5) text.textContent = "вопросов";
    }

    function changeLine(line, value) {
      if (!line) return;
      
      const s = line.dataset.left;
      if (value == "increase") {
        line.style.left = "-" + (parseInt(s) - lineShow) + "%";
        line.dataset.left = parseInt(s) - lineShow;
      }
      if (value == "decrease") {
        line.style.left = "-" + (parseInt(s) + lineShow) + "%";
        line.dataset.left = parseInt(s) + lineShow;
      }
    }

    function validateInputs(steps, index) {
      const inputs = [
        ...steps[index].querySelectorAll(
          "input[type='radio'], select, input[type='text']"
        ),
      ];
      console.log(inputs);
      const assessment = steps[index].querySelector(".assessment__comment");
      const checkInp = inputs.some(function (input) {
        if (input.tagName === "SELECT" && input.value != "Выбрать отрасль") {
          return true;
        }

        if (input.getAttribute("type") == "text" && input.value != "") {
          return true;
        }
        if (input.checked) {
          return true;
        }
        return false;
      });

      return assessment || checkInp;
    }

    function reversalInputs(steps, index) {
      const inputs = [
        ...steps[index].querySelectorAll(
          "input[type='radio'], input[type='text']"
        ),
      ];
      if (
        steps[index - 1]?.querySelectorAll(
          "input[type='radio'], input[type='text']"
        )
      ) {
        inputs.push(
          ...steps[index - 1].querySelectorAll(
            "input[type='radio'], input[type='text']"
          )
        );
      }

      inputs?.forEach((input) => {
        if (input.type === "text") input.value = "";
        if (input.checked) input.checked = false;
        input.target?.parentNode.classList.remove("active");
      });
    }
  });
}