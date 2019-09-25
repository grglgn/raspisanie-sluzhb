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
$('#myToolbar').w2toolbar({
        name : 'myToolbar',
        items: [
            { type: 'check',  id: 'item1', caption: 'Check', img: 'icon-add', checked: true },
            { type: 'break' },
            { type: 'menu',   id: 'item2', caption: 'Drop Down', img: 'icon-folder',
                items: [
                    { text: 'Item 1', img: 'icon-page' },
                    { text: 'Item 2', img: 'icon-page' },
                    { text: 'Item 3', img: 'icon-page' }
                ]
            },
            { type: 'break' },
            { type: 'radio',  id: 'item3',  group: '1', caption: 'Radio 1', img: 'icon-page' },
            { type: 'radio',  id: 'item4',  group: '1', caption: 'Radio 2', img: 'icon-page' },
            { type: 'spacer' },
            { type: 'button',  id: 'item5',  caption: 'Item 5', img: 'icon-save' }
        ]
    });
$("#loadBtn").on("click", function(){

  //elo.msg('My buData:<br>'+buDataToArr(buData).toString());
  var recs = buDataToArr(buData);
  //recs.forEach(d => alert(d.dateStr));
  $('#tableCnt').w2grid({
          name: 'tableCnt',
          records: recs,
          columns: [
              { field: 'dateStr', caption: 'Дата', size: '10%' ,attr: "align=left"},
              { field: 'weekDay', caption: 'День', size: '10%',attr: "align=left" },
              { field: 'sluzhbi', caption: 'Службы', size: '40%',attr: "align=left" ,
                render: function (record, index, col_index) {
                                  //var html = this.getCellValue(index, col_index+1);
                       return '<div class="slu-cnt" id="slu-cnt-'+index+'-'+col_index+
                       '"><a href="javascript:void(0)">Изменить</a></div><div>8-30 Литургия <br> 11-00 Крещение</div>';
                              }},
              { field: 'dsc', caption: 'Описание', size: '40%',attr: "align=left" }
          ]
      });

});

//$("#startDtInp" ).datepicker.formatDate( "dd-mm-yy", new Date());
//$("#endDtInp" ).datepicker.formatDate( "dd-mm-yy", new Date());
});

function buDataToArr(buDt){
    var arr = [];
    for (d in buDt){
       var dayDt = buDt[d];
       var dArr = d.split('-');
       dayDt['dateArr'] = dArr;
       dayDt['dateStr'] = dArr[2]+'-'+dArr[1]+'-'+dArr[0];
       dayDt['sluzhbi']='';
       arr[arr.length]=dayDt;
    }
    var arrS = arr.sort(function(a,b){
        var ada = a['dateArr'];
        var bda = b['dateArr'];
        var difY = parseInt(ada[0]) - parseInt(bda[0]);
        if (difY != 0) return difY;

        var difM = parseInt(ada[1]) - parseInt(bda[1]);
        if (difM != 0) return difM;

        var difD = parseInt(ada[2]) - parseInt(bda[2]);
        if (difD != 0) return difD;

        return 0;
    });
    for (var i=0;i<arr.length;i++){
        arr[i]['recid'] = i+1;
    }
    return arr;
}

