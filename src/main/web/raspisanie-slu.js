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
//$("#loadBtn").button();

elo.bsData = prepareBuData(buData); //buData must be defined in one of included js files

$("#loadBtn").on("click", function(){

  //elo.msg('My buData:<br>'+buDataToArr(buData).toString());

  //recs.forEach(d => alert(d.dateStr));
  $('#tableCnt').w2grid({
          name: 'tableCnt',
          records: elo.bsData,
          columns: [
              { field: 'dateStr', caption: 'Д', size: '40px' , min:40},
              { field: 'weekDay', caption: 'ДH', size: '40px', min:40 },
/*
              { field: 'prazdn', caption: '', size: '20px', resizable: false,
                                  editable: { type: 'check', style: 'text-align: center' }},
*/
              { field: 'sluzhbi', caption: 'Службы', size: '40%',attr: "align=left" ,
                render: function (record, index, col_index) {
                                  //var html = this.getCellValue(index, col_index+1);
                       return constrSluHtml(index);

/*
                       return '<div class="slu-cnt" id="slu-cnt-'+index+'-'+col_index+
                       '"><button>Изменить</button></div><div>8-30 Литургия <br> 11-00 Крещение</div>';
*/
//                       '"><a href="javascript:void(0)">Изменить</a></div><div>8-30 Литургия <br> 11-00 Крещение</div>';
                              }},

              /*{ field: 'sluzhbi', caption: '', size: '30px', resizable: false,
                       render: function (record, index, col_index) {
                           return '<button class="chSluBtn" onclick="elo.editSlu('+index+')" title="Изменить состав служб"> .... </button>';
                       }},*/


              { field: 'dsc', caption: 'Описание', size: '45%',attr: "align=left"}
          ],
           onDblClick:function(event){
              var record = this.get(event.recid);
              elo.msg('event.column:'+event.column+'  '+record.dsc);
          }
      });

});

function g(){ return w2ui['tableCnt'];}

function constrSluHtml(ind){
    //var rec = g().get(i);
    var rec = elo.bsData;
    var arr = rec.slu;
    if (arr && arr.length){
        var b='';
        for (var i in arr){
            var sl = arr[i];
            b+='<div';
            if (sl.isPrazdn) b+=' class="prazdn"';
            b+='>';
            b+=w2utils.encodeTags(sl.time + ' ' + sl.title);
            b+='</div>';
        }
        return b;
    } else {
        return 'нет служб';
    }


}

/*
$(".chSluBtn").on("click", function(ev){
   elo.msg('Btn:'+this);
});
*/

$("#processBtn").on("click", function(event){
    var arr = g().getSelection();
    if (arr && arr.length){
       var rec = g().get(arr[0]);
       elo.msg('rec:'+rec.recid+' prazdn:'+rec.prazdn+" date:"+rec.dateStr);
    }
    else elo.msg('Nothing selected');

});

elo.editSlu = function(ind){
   var rec = g().get(ind+1);
   elo.msg('dsc:'+rec.dsc);
}

function prepareBuData(buDt){
    var arr = [];
    for (d in buDt){
       var dayDt = buDt[d];
       var dArr = d.split('-');
       dayDt['dateStr'] = dArr[2]+'.'+dArr[1];//+'-'+dArr[0];
       for (var i in dArr) dArr[i] = parseInt(dArr[i]);//conv string arr to num arr
       dayDt['dateArr'] = dArr;
       dayDt['sluzhbi']='';
       //todo remove
       dayDt['slu']=[{time:'8-30', title:'Литургия', isPrazdn:true},
                      {time:'17-00', title:'Вечерня. Утреня'}];

       var wd = dayDt['weekDay']
       if (dayDt['weekDay'].indexOf('Неделя') == 0){
           dayDt['dsc'] = wd +'. ' + dayDt['dsc'];
           dayDt['weekDay'] = 'Вc';
           dayDt['prazdn'] = true;
       }
       fmtWeekDay(dayDt);

       if (dayDt['prazdn'] == undefined) dayDt['prazdn'] = false;
       arr[arr.length]=dayDt;
       if (dayDt['prazdn'] == true){
           dayDt['w2ui']= { "style": "color: red" };
       } else {
         delete dayDt['w2ui'];
       }

    }
    var arrS = arr.sort(sortDateArr);
    for (var i=0;i<arr.length;i++){
        arr[i]['recid'] = i+1;
    }
    return arr;
}

function fmtWeekDay(dd){
    var wd = dd['weekDay'];
    if (wd == 'Понедельник') dd['weekDay'] = 'Пн';
    if (wd == 'Вторник') dd['weekDay'] = 'Вт';
    if (wd == 'Среда') dd['weekDay'] = 'Ср';
    if (wd == 'Четверг') dd['weekDay'] = 'Чт';
    if (wd == 'Пятница') dd['weekDay'] = 'Пт';
    if (wd == 'Суббота') dd['weekDay'] = 'Сб';

}

function sortDateArr(a,b){
    var ada = a['dateArr'];
    var bda = b['dateArr'];
    var difY = ada[0] - bda[0];
    if (difY != 0) return difY;
    var difM = ada[1] - bda[1];
    if (difM != 0) return difM;
    var difD = ada[2] - bda[2];
    if (difD != 0) return difD;
    return 0;
}

});