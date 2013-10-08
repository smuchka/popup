$(document).ready(function(){
    $('span.btn').PopupPL({
        debug: true,
        idWND: "requestFriendWND",
        reload: true,
        // confirm: true, 
        // { escbtn: false }
        location : { 
            // position: "default", // 
            position: "centerscreen",
            // parentDependence: $("div.block"),
            // proportions: { width: 500, height: 500 },
            offset: { left: 1, top: 0, right: 0, bottom: 0 },
            quarters: [4,3,1,2]
        },
        create: {
            fn_getContent: function(){ return "<div style=' '>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/>РомаРомаРомаРомаРома<br/></div>"; },
            fn_getBtnOk:  function(){ return '<a><div id="ok" class="toAdd"><span>Добавить</span></div></a>'; },
            fn_getBtnCancle: function(){ return '<a><div id="cancle" class="notToAdd"><span>Не сейчас</span></div></a>'; },
            data: { info: function(){ return true; } }        
        }, /* Формирование контента */
        events: {
            fn_ok: function() { console.log("ok"); } ,
            fn_cancle: function() { console.log("cancle"); }
        }, /* Обработчики событий кнопочек */
        handler: {
            aftershow: function(args) { console.log("show " + args.id); },
            afterclose: function(args) { console.log("close " + args.id); }
        } /* Обработчики событий окна */
    });
});