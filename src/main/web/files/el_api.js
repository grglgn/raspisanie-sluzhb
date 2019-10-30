var elo = {};

elo.parseDate = function(str, mask){
    if (mask == "dd-mm-yyyy"){
        var maskArr = mask.split('-');

    } else {
        return new Date(str);
    }
};

elo.msg = function(str){
      w2popup.open({
          title: 'Инфо',
          body: '<div class="w2ui-centered elomsg">'+w2utils.encodeTags(str)+'</div>'
      });
};

elo.toNumberArr = function(arr){
    for (var i in arr) arr[i] = parseInt(arr[i]);
    return arr;
};

elo.confirm = function(msgStr, fnYes, fnNo){
    w2confirm({msg:msgStr,
               title:'Подтверждение',
               btn_yes:{text:'Да'}, btn_no:{text:'Нет'}})
            .yes(fnYes).no(fnNo);
};

elo.select = function(el){
     var target = el;
     var rng, sel;
     if (document.createRange) {
       rng = document.createRange();
       rng.selectNode(target)
       sel = window.getSelection();
       sel.removeAllRanges();
       sel.addRange(rng);
     } else {
       var rng = document.body.createTextRange();
       rng.moveToElementText(target);
       rng.select();
     }

 };

 var elo__copyErrMsg = "Не удалось скопировать в буфер обмена. Скопируйте с помощью мыши или клавиш 'ctrl-c'";

 elo.copyContent = function(el){
     elo.select(el);
     try{
         var res = document.execCommand("copy");
         if (!res) throw new Error();
         else {
             w2alert('Скопировано в буфер');
         }
     }catch(e){
         elo.w2alert(elo__copyErrMsg);
     }
 };



/*{
dateFormat: 'dd-mm-yy',
monthNames:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
monthNamesShort:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
dayNamesMin:["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
dayNames:["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
changeYear:true,
changeMonth:true }*/

elo.datepickerConf ={
	closeText: "Закрыть",
	prevText: "&#x3C;Пред",
	nextText: "След&#x3E;",
	currentText: "Сегодня",
	monthNames: [ "Январь","Февраль","Март","Апрель","Май","Июнь",
	"Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь" ],
	monthNamesShort: [ "Янв","Фев","Мар","Апр","Май","Июн",
	"Июл","Авг","Сен","Окт","Ноя","Дек" ],
	dayNames: [ "воскресенье","понедельник","вторник","среда","четверг","пятница","суббота" ],
	dayNamesShort: [ "вск","пнд","втр","срд","чтв","птн","сбт" ],
	dayNamesMin: [ "Вс","Пн","Вт","Ср","Чт","Пт","Сб" ],
	weekHeader: "Нед",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ""
};



//$.datepicker.setDefaults(elo.datepickerConf);