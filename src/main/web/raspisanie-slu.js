$(function (){
$('#startDtInp').w2field('date', {format:'dd.mm.yyyy'});
$('#endDtInp').w2field('date', {format:'dd.mm.yyyy'});
$("#processBtn").hide();

elo.bsData = prepareBuData(buData); //buData must be defined in one of included js files

function filterGridData(){
if (true) return elo.bsData;
  var startDtV = $('#startDtInp').val();//datepicker("getDate");
  var endDtV = $('#endDtInp').val();//datepicker("getDate");
  //elo.msg('startDtV: '+startDtV);
  var dataForGrid = [];
  var startDtArr = elo.toNumberArr(startDtV.split('.')).reverse();
  var endDtArr = elo.toNumberArr(endDtV.split('.')).reverse();
  for (var i in elo.bsData){
      var dd = elo.bsData[i];
      var dif = compareDateArrays(dd.dateArr, startDtArr);
      if (compareDateArrays(dd.dateArr, startDtArr) >= 0 &&
          compareDateArrays(dd.dateArr, endDtArr) <= 0){
              dataForGrid[dataForGrid.length] = dd;
      }
  }
  return dataForGrid;
}


var drawGrid = function(){

  var dataForGrid = filterGridData();

  if (g()) {
      g().destroy();
  }

  $('#tableCnt').w2grid({
          name: 'tableCnt',
          records: dataForGrid,
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
              //elo.msg('event.column:'+event.column+'  '+w2utils.decodeTags(record.dsc));
              showEditWindow(record);


          }
      });
      $("#processBtn").show();
}

$("#loadBtn").on("click", drawGrid);

var slu_times = ['8-00','8-30', '9-00', '11-00', '12-00', '16-00', '17-00', '18-00'];
var slu_names = ['Часы. Исповедь. Литургия', 'Вечерня. Утреня.', 'Всенощное бдение', 'Вечерня. Утреня с полиелеем', 'Утреня. Часы. Изобразительны. Вечерня с Литургией преждеосвященных Даров', 'Часы. Изобразительны. Вечерня с Литургией преждеосвященных Даров.','Царские Часы', 'Крещение', 'Венчание'];
var slu_names_arr = [];
var slu_names_map = {};

function adslu(key, stit){
   slu_names_arr[slu_names_arr.length] = stit;
   slu_names_map[key]=stit;
}
adslu('chasi','Часы');
adslu('tschasi','Царские Часы');

                 'Вечерня. Утреня с полиелеем', 'Утреня. Часы. Изобразительны. Вечерня с Литургией преждеосвященных Даров', 'Часы. Изобразительны. Вечерня с Литургией преждеосвященных Даров.'

adslu('lit','Литургия');
adslu('litVV','Литургия свт.Василия Великого');
adslu('litIZ','Литургия свт.Иоанна Златоустаго');
adslu('vb','Всенощное бдение');
adslu('vvech','Великая вечерня');
adslu('vech','Вечерня');
adslu('polutr','Полиелейная утреня');
adslu('utr','Утреня');
adslu('kresh','Крещение');
adslu('isp','Исповедь');
adslu('izo','Изобразительны');
adslu('vench','Венчание');

function showEditWindow(rec){
   $('#popup1').w2popup({

   /*    onOpen: function(){

       },*/
       title: 'Cлужбы на дату: <strong>'+rec['dateStr']+'</strong>'
   });
   $('#sluAddBtn').off();
   $('#sluAddBtn').on('click', function(event){
      editWin_addSlu(rec);
   });
   $('#sluTime').w2field('list', { items: slu_times });
   $('#sluName').w2field('list', { items: slu_names });

//   $('#sluWinTitle').val(rec['dateStr']);
}

function editWin_addSlu(rec){
    //elo.msg(JSON.stringify(rec));
    //var rec = getCurRecord();
    var count = elo.rec.recid
    var divid = 'adSl_'+rec.recid;
    var timeInp = divid+'_t';
    var nameInp = divid+'_n';
    $('#addedSluCnt').append(
        '<div id="'+divid+'"><input type="text" class="sluTime" id="'+timeInp+'"/>'+
             '<input type="text" id="'+nameInp+'" class="sluName"/></div>');
    //$('.sluTime > div > input').val('jjj');
    //$('#'+divid+' > div > input.sluTime').val($('#sluTime').val());
    $('#'+timeInp).val($('#sluTime').val());
    $('#'+nameInp).val($('#sluName').val());

}

function g(){ return w2ui['tableCnt'];}

function getCurRecord(){
   var sel = g().getSelection();
   if (sel.length) {
       return g().get(sel[0]);
   } else {
       return null;
   }
}

function constrSluHtml(ind){
    //var rec = g().get(i);
    var rec = elo.bsData[ind];
    var arr = rec.slu;
    if (arr && arr.length){
        var b='';
        for (var i in arr){
            var sl = arr[i];
            b+='<div class="slu-cnt';
            if (sl.isPrazdn) b+=' prazdn';
            b+='">';
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
    //todo

});

elo.editSlu = function(ind){
   var rec = g().get(ind+1);
   elo.msg('dsc:'+rec.dsc);
}

function prepareBuData(buDt, startDt, endDt){
    var arr = [];
    for (d in buDt){
       var dayDt = buDt[d];
       var dArr = d.split('-');
       dayDt['dateStr'] = dArr[2]+'.'+dArr[1];//+'-'+dArr[0];
       elo.toNumberArr(dArr);
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
    var arrS = arr.sort(sortDateArrFn);
    for (var i=0;i<arr.length;i++){
        arr[i]['recid'] = i;
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

function sortDateArrFn(a,b){
    var ada = a['dateArr'];
    var bda = b['dateArr'];
    return compareDateArrays(ada,bda);
}

function compareDateArrays(ada,bda){
    var difY = ada[0] - bda[0];
    if (difY != 0) return difY;
    var difM = ada[1] - bda[1];
    if (difM != 0) return difM;
    var difD = ada[2] - bda[2];
    if (difD != 0) return difD;
    return 0;
}

});