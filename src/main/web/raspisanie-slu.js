$(function (){
// $("#startDtInp").append(newCalendar("startDt"));
// $("#endDtSpan").append(newCalendar("endDt"));
var clConf = {
dateFormat: 'dd-mm-yy',
monthNames:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
monthNamesShort:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
dayNamesMin:["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
dayNames:["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
changeYear:true,
changeMonth:true

};
//$.datepicker.setDefaults( $.datepicker.regional[ "ru" ] );
$("#startDtInp" ).datepicker(clConf);
$("#endDtInp" ).datepicker(clConf);
$("#loadBtn").button();

//$("#startDtInp" ).datepicker.formatDate( "dd-mm-yy", new Date());
//$("#endDtInp" ).datepicker.formatDate( "dd-mm-yy", new Date());
});

function newCalendar(id){
    var cl  = $("<select id='clD-"+id+"' class='clDay'></select><select id='clM-"+id+"' class='clMont'></select><select id='clY-"+id+"' class='clYear'></select>");
    return cl;
}