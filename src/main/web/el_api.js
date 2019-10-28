var elo = {};

elo.parseDate = function(str, mask){
    if (mask == "dd-mm-yyyy"){
        var maskArr = mask.split('-');

    } else {
        return new Date(str);
    }
}

elo.msg = function(str){
      w2popup.open({
          title: 'Инфо',
          body: '<div class="w2ui-centered elomsg">'+w2utils.encodeTags(str)+'</div>'
      });
};

elo.toNumberArr = function(arr){
    for (var i in arr) arr[i] = parseInt(arr[i]);
    return arr;
}




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