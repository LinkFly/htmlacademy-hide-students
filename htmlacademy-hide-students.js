/**
 * Created by User on 01.09.2016.
 */
(function() {
  var selStudentsList = '.list-group';
  var clsStudents = 'list-group-item';
  var selStudents = '.' + clsStudents;
  var clsHideBtn = clsStudents + '__hide-button';
  var selHideBtn = '.' + clsHideBtn;
  var clsShowStudents = 'list-group-show-students';
  var selShowStudents = '.' + clsShowStudents;
  var txtShowStudents = 'Показать скрытых студентов';
  var hideBtnStyle = "cursor: pointer; width: 20px; height: 20px; position: absolute; visibility: hidden; z-index: 1;" +
    "background-size: cover; background-image: url('https://image.freepik.com/free-icon/_318-47846.jpg')";
  var elShowStudentsStyles = 'cursor: pointer; ';
  var studentHoverStyles = {
    color: '#555',
    textDecoration: 'none',
    backgroundColor: '#f5f5f5'
  };

// Internal variables
  var arStudentObjects = [];
/////////
  
  // Utils
  function hideElt(elt) {
    elt.style.display = 'none';
  }
  /**@todo заменить все скрытия (и показ) элементов утилитами */
  
  /**
   * Добавление кнопок скрытия студентов
   * @param students
   */
  function addHideButtons(students) {
    var createHideButton = function() {
      var hideBtn = document.createElement('a');
      hideBtn.style = hideBtnStyle;
      hideBtn.classList.add(clsHideBtn);
      return hideBtn;
    };
  
    students.forEach(function(student) {
      var hideBtn = createHideButton(student);
      //student.parentElement.insertBefore(hideBtn, student);
      student.appendChild(hideBtn);
      hideBtn.addEventListener('click', function(ev) {
        hideStudent(student);
        ev.preventDefault();
      });
    });
  }
  
  /**
   * Настройка появления и исчезнования кнопок скрытия
   * @param students
   */
  function appearHideButton(students) {
    students.forEach(function(student) {
      var hideBtn = student.querySelector(selHideBtn);
      var cbEnter = function() {
        //console.log('enter');
        hideBtn.style.visibility = 'visible';
        student.removeEventListener('mouseenter', cbEnter);
        student.addEventListener('mouseleave', cbLeave);
        hideBtn.addEventListener('mouseenter', cbHideBtnEnter);
      };
      var cbLeave = function() {
        //console.log('leave');
        hideBtn.style.visibility = 'hidden';
        student.removeEventListener('mouseleave', cbLeave);
        student.addEventListener('mouseenter', cbEnter);
      };
      var cbHideBtnEnter = function() {
        //console.log('hidebtn enter');
        hideBtn.style.visibility = 'visible';
        hideBtn.removeEventListener('mouseenter', cbHideBtnLeave);
        hideBtn.addEventListener('mouseleave', cbHideBtnLeave);
        student.removeEventListener('mouseenter', cbEnter);
      };
      var cbHideBtnLeave = function() {
        //console.log('hidebtn leave');
        hideBtn.style.visibility = 'hidden';
        hideBtn.addEventListener('mouseenter', cbHideBtnEnter);
        student.addEventListener('mouseenter', cbEnter);
        var event = new Event("mouseenter");
        student.dispatchEvent(event);
      };
      student.addEventListener('mouseenter', cbEnter);
    });
    document.querySelectorAll(selHideBtn).forEach(function(hideBtn) {
      var oldCol, oldTextDecor, oldBgCol;
      hideBtn.addEventListener('mouseenter', function() {
        var style = hideBtn.style;
        oldCol = style.color;
        oldTextDecor = style.textDecoration;
        oldBgCol = style.backgroundColor;
        style.color = studentHoverStyles.color;
        style.textDecoration = studentHoverStyles.textDecoration;
        style.backgroundColor = studentHoverStyles.backgroundColor;
      });
      hideBtn.addEventListener('mouseleave', function() {
        var style = hideBtn.style;
        style.color = oldCol;
        style.textDecoration = oldTextDecor;
        style.backgroundColor = oldBgCol;
      });
    });
  }
  
  /**
   * Добавления ссылки при клике на которую показываются все студенты
   */
  function addShowStudentsElement() {
    var elShowHidingStudents = document.createElement('a');
    elShowHidingStudents.classList.add(clsShowStudents);
    elShowHidingStudents.textContent = txtShowStudents;
    elShowHidingStudents.style = elShowStudentsStyles;
    elShowHidingStudents.style.display = 'none';
    document.querySelector(selStudentsList).appendChild(elShowHidingStudents);
  }
  
  /**
   * Получение элемента, представляющего ссылку для показа студентов
   * @returns {Element}
   */
  function getShowStudentsElt() {
    return document.querySelector(selShowStudents);
  }
  
  /**
   * Кэллбэк для клика по ссылки показа студентов
   */
  function cbShowHidingStudents() {
    getShowStudentsElt().removeEventListener('click', cbShowHidingStudents);
    showStudents();
  }
  
  ////////// Main logic ////////
  /**
   * Ф-ия скрытия студента
   * @param student
   */
  function hideStudent(student) {
    arStudentObjects.push({index: null, student: student, display: student.style.display});
    var elShowHidingStudents = getShowStudentsElt();
    student.style.display = 'none';
    if (elShowHidingStudents.style.display === 'none') {
      elShowHidingStudents.addEventListener('click', cbShowHidingStudents);
      elShowHidingStudents.style.display = 'block';
    }
  }
  
  /** Показ всех студентов */
  function showStudents() {
    function showStudent(studentObj) {
      var student = studentObj.student;
      student.style.display = studentObj.display;
    }
    for(var i = 0; i < arStudentObjects.length; i++) {
      showStudent(arStudentObjects[i]);
    }
    arStudentObjects.forEach(showStudent);
    arStudentObjects = [];
    hideElt(getShowStudentsElt());
  }
  //////////////////////////////////


  /** Старт установки элементов и настройки обработчиков */
  var students = document.querySelectorAll(selStudents);
  addHideButtons(students);
  appearHideButton(students);
  addShowStudentsElement();
})();
