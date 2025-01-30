
function requestSite(tp = "keno"){
    let ssit = getCookie("sit"); let ssid = getCookie("sid");

    let co = getCookie("co");let c = getCookie("c");let a = getCookie("a");let o = getCookie("o");

    var urill = "https://retail.playman.bet/api/?o="+o+"&a="+a+"&c="+c+"&co="+co+"&sit="+ssit+"&sid="+ssid+"&unix="+new Date().getTime()+"&game=";
    return urill.concat(tp+"&");
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {

  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  location.replace("?logout=true");
}

function checkCookie(k) {
  let user = getCookie(k);
  if (user != "") {
    return true;
  } else {
    return false;
  }
} 
var games = {
    spin: {
        active: false,
        currentId: 1120,
        result: {
            gameId: ["result"],
            gameId2: ["result"]
        }
    },
    keno: {
        active: false,
        currentId: 1120,
        result: {
            gameId: ["result"],
            gameId2: ["result"]
        }
    }
}

var report_data = null;
document.getElementsByClassName("tablink")[0].click();    
function openCity(cityName) {
    if(cityName == "yesterday"){
        $("#yesterday").show();
        $("#today").hide();
        $("#cashierOpt2").css("background-color","white");
        $("#cashierOpt1").css("background-color","");

    }
    if(cityName == "today"){
        $("#yesterday").hide();
        $("#today").show();
        $("#cashierOpt1").css("background-color","white");
        $("#cashierOpt2").css("background-color","");
    }
}

function refreshCashier() {
    refresh_report();
    $('#refreshCashier').html('<i style="font-size: 16px; padding: 0px;" class="bi p-1 bi-arrow-clockwise"></i>Refreshing...');
    
    setTimeout(() => {
        $('#refreshCashier').html('<i style="font-size: 16px; padding: 0px;" class="bi p-1 bi-arrow-clockwise"></i>Refresh');
    
    }, 1000);
}

$(function() {
    $('#cashier_cash_check').click(refresh_report);
});

function aaTime(offset){
    //console.log(requestSite());
var b=new Date()
var utc=b.getTime()+(b.getTimezoneOffset()*60000);
var nd=new Date(utc+(3600000*offset));
return nd;

}
//get specific country time
var aa = aaTime('+3');



function refresh_report() {

    $('#report1001').text("Loading...");
    $('#report1002').text("Loading...");
    $('#report1003').text("Loading...");
    $('#report1004').text("Loading...");
    $('#report1005').html("<strong>Loading...</strong>");

    $('#report2001').text("Loading...");
    $('#report2002').text("Loading...");
    $('#report2003').text("Loading...");
    $('#report2004').text("Loading...");
    $('#report2005').html("<strong>Loading...</strong>");
    $('#id01').show();

    $.get(requestSite() + 'type=report&cashier_report=true&time='+ new Date().getTime(), function(data){
        //console.log(data);
        if (data.err == "true") {
            if(data.errText=="logout"){
                  location.replace(".?logout=true");
                  console.log("Logged out! please sign in again.");
            }
            notify("warning", data.errText);
        }
        //data = JSON.parse(data);
        else {
            report_data = data;


            $('#report1001').text("Br " + thousands_separators(data["today"]["bets"]["amount"]));
            $('#report1002').text("Br " + thousands_separators(data["today"]["redeemed"]["amount"]));
            $('#report1003').text("Br " + thousands_separators(data["today"]["canceled"]["amount"]));
            $('#report1004').text("Br " + thousands_separators(data["today"]["deposited"]["amount"]));
            $('#report1005').html("<strong>Net: " + thousands_separators(data["today"]["bets"]["amount"] - data["today"]["redeemed"]["amount"] - data["today"]["canceled"]["amount"] + data["today"]["deposited"]["amount"]) + "</strong>");

            $('#report2001').text("Br " + thousands_separators(data["yesterday"]["bets"]["amount"]));
            $('#report2002').text("Br " + thousands_separators(data["yesterday"]["redeemed"]["amount"]));
            $('#report2003').text("Br " + thousands_separators(data["yesterday"]["canceled"]["amount"]));
            $('#report2004').text("Br " + thousands_separators(data["yesterday"]["deposited"]["amount"]));
            $('#report2005').html("<strong>Net: " + thousands_separators(data["yesterday"]["bets"]["amount"] - data["yesterday"]["redeemed"]["amount"] - data["yesterday"]["canceled"]["amount"] + data["yesterday"]["deposited"]["amount"]) + "</strong>");

        }
    
    }).fail(function() {
        $('#id01').hide();
        notify("error", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
    });



}

function print_report() {
    var idresult = document.getElementById("yesterday").style.display;
    var day = "today";
    if (idresult == "block") {
        day = "yesterday";
    }
    $.get(requestSite() + 'type=printReport&day=' + day+'&time='+ new Date().getTime() , function(data){
        if(data.errText=="logout"){
                          location.replace(".?logout=true");
                          console.log("please logout and sign in again.");
                    }
        $("#kenoSlipTime").html(aaTime(+3));
        //console.log(data.agent + ' -> ' + data.cashier);
        $("#kenoSlipId").html(data.agent + ' -> ' + data.cashier);
        $("#dateKenoSlipy").html(data.date);
        $("#betCountKenoSlipy").html(thousands_separators(data.betCount));
        $("#payinKenoSlipy").html("Br " + thousands_separators(data.payin));
        $("#payoutKenoSlipy").html("Br " + thousands_separators(data.payout));
       // $("#canceledKenoSlipy").html(thousands_separators(data.canceledBet));
        $("#canceledBetKenoSlipy").html("Br " + thousands_separators(data.canceled));
        $("#netKenoSlipy").html("Br " + thousands_separators(data.net));
        printJS({
            printable:'reportPrintHere', 
            type:'html', 
            css:'./css/ticket.css'
            });
    }).fail(function() {
       notify("warning", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።")
    });

    
    //window.open(requestSite() + 'type=printReport&day=' + day, "report", 'width=400,height=500,scrollbars=yes');
}

function print_report2() {
    var specdate = "today";
    var zenit = document.getElementById("yesterday").style.display;
    if (zenit == "block") {
        specdate = "yesterday";
    }
    popupWindow = 3;
}

function notify(type, content) {
    $("#notify_" + type + "_text").html(content);
    $("#notify_" + type).show();
    setTimeout(() => {
        $("#notify_" + type).hide();
    }, 4000);
}

function thousands_separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

function cashier_deposite() {
    $('#id01').hide();
    notify("warning", "ይህን አገልግሎት ለጊዜው ማግኘት አይችሉም።");
}
var printresvar;


function game_result() {
    var idresult = $("#inputgameid2").val();
    var idresult2 = $("#inputgameid3").val();
    if (!isNaN(idresult) && idresult.length == 4) {
        $.ajax(
            requestSite() + 'type=game_result&game_id=' + idresult +'&time='+ new Date().getTime()+'&day='+idresult2, {
                success: function(data) {
                    if (data.err == "true") {
                        if(data.errText=="logout"){
                          location.replace(".?logout=true");
                          console.log("please logout and sign in again.");
                    }
                        notify("warning", data.errText);
                    } else {
                        printresvar = data;
                        //console.log(printresvar);
                        //data = JSON.parse(data);
                        if(data[0] == "keno"){
                            $("#resultCard").html('<div class="card-header">Keno Result : ' + data[21] + ' </div><div class="card-body KenoPanel"><div class="ballsResult"><span>' + data[1] + '</span> </div><div class="ballsResult"><span>' + data[2] + '</span> </div><div class="ballsResult"><span>' + data[3] + '</span> </div><div class="ballsResult"><span>' + data[4] + '</span> </div><div class="ballsResult"><span>' + data[5] + '</span> </div><div class="ballsResult"><span>' + data[6] + '</span> </div><div class="ballsResult"><span>' + data[7] + '</span> </div><div class="ballsResult"><span>' + data[8] + '</span> </div><div class="ballsResult"><span>' + data[9] + '</span> </div><div class="ballsResult"><span>' + data[10] + '</span> </div><div class="ballsResult"><span>' + data[11] + '</span> </div><div class="ballsResult"><span>' + data[12] + '</span> </div><div class="ballsResult"><span>' + data[13] + '</span> </div><div class="ballsResult"><span>' + data[14] + '</span> </div><div class="ballsResult"><span>' + data[15] + '</span> </div><div class="ballsResult"><span>' + data[16] + '</span> </div><div class="ballsResult"><span>' + data[17] + '</span> </div><div class="ballsResult"><span>' + data[18] + '</span> </div><div class="ballsResult"><span>' + data[19] + '</span> </div><div class="ballsResult"><span>' + data[20] + '</span> </div></div><div class="d-grid gap-2 d-md-flex justify-content-md-end"><button onclick="print_result()" type="button" style=" margin: 5px 2px; border: none; background-color: #8730adc0; color: rgb(255, 255, 255); padding:0.2vw 0.9vw 0.2vw 0.4vw" class="btn btn-success btn-sm button"><i style="font-size: 16px; padding: 0px;" class="bi p-1 bi-printer"></i></i>Print</button></div>');
                        }
                        if(data[0] == "spin"){
                            $("#resultCard").html('<div class="card-header">Keno Result : ' + data[21] + ' </div><div class="card-body KenoPanel"><div class="ballsResult"><span>' + data[1] + '</span> </div></div><div class="d-grid gap-2 d-md-flex justify-content-md-end"><button onclick="print_result(\'spin\')" type="button" style=" margin: 5px 2px; border: none; background-color: #8730adc0; color: rgb(255, 255, 255); padding:0.2vw 0.9vw 0.2vw 0.4vw" class="btn btn-success btn-sm button"><i style="font-size: 16px; padding: 0px;" class="bi p-1 bi-printer"></i></i>Print</button></div>');
                        }
                    }
                },
                error: function() {
                    notify("error", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
                    $('#game_result_open').hide()
                }
            }
        );
    } else {
        notify("warning", "የማይታወቅ የጨዋታ መለያ ቁጥር! እባክዎ ቁጥሩ በትትክል ያስገቡ።");
    }


}

function print_result2(typeg = "keno") {
    var idresult = document.getElementById("yesterday").style.display;
    var day = "today";
    if (idresult == "block") {
        day = "yesterday";
    }

    var res = "";
   
   if(typeg == "keno"){
        for (let index = 1; index < 21; index++) {
                if (index == 1) {
                    res = res.concat(printresvar[index]);
                } else {
                    res = res.concat(", " + printresvar[index]);
                }
            }
            var dividiv = '<div style="margin: 20px 20px; margin-top: 9px;  height: 300px;font-family: Arial, Helvetica, sans-serif;"><div style="width: 200px; position: relative;"><div style="width: 220px;"> <center><div class="divTable gapy"><strong> GAME RESULT</strong></div><div class="divTable"><span style="margin-top: 2px; font-family: monospace; font-size: 10px;">game id : <span id="kenoSlipId">#' + printresvar[21] + '</span> </span></div><div style="width: 100%; height:15px"></div><div class="divTable"><div class="_1"><span style="font-size:13px"></span></div><hr style="margin-top: 0px;">' + res + '</div><hr style="margin-top: 5px;"><span  style="margin-top: 2px; font-family: monospace; font-size: 10px;" id="kenoSlipTime">' + new Date() + '</span></center></div></div> </div>';
    }
    if(typeg == "spin"){
        
                res = res.concat(printresvar[1]);
                var dividiv = '<div style="margin: 20px 20px; margin-top: 9px;  height: 300px;font-family: Arial, Helvetica, sans-serif;"><div style="width: 200px; position: relative;"><div style="width: 220px;"> <center><div class="divTable gapy"><strong> GAME RESULT</strong></div><div class="divTable"><span style="margin-top: 2px; font-family: monospace; font-size: 10px;">game id : <span id="kenoSlipId">#' + printresvar[21] + '</span> </span></div><div style="width: 100%; height:15px"></div><div class="divTable"><div class="_1"><span style="font-size:13px"></span></div><hr style="margin-top: 0px;">' + res + '</div><hr style="margin-top: 5px;"><span  style="margin-top: 2px; font-family: monospace; font-size: 10px;" id="kenoSlipTime">' + new Date() + '</span></center></div></div> </div>';
   
        }
    $("#gameresultprint").html(dividiv);

    printJS({
        printable: 'gameresultprint',
        type: 'html',
        css: './css/ticket.css'
    });
}

function request(url) {

    $.ajax(url, {
        success: function(data) {
            if (data.err == true) {
                if(data.errText=="logout"){
                          location.replace("./?logout=true");
                          console.log("please logout and sign in again.");
                    }
                notify("error", data.txt);
                return "error";
            }
            //data = JSON.parse(data);
            return data;
        },
        error: function() {
            notify("error", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
            return "false";
        }
    });
}

$(document).ready(function() {
    $("#switchToSpin").click(function() {
        $("#kenoPanel").hide();
        $("#spinPanel").show();
    });



    $("#switchToKeno").click(function() {
        $("#kenoPanel").show();
        $("#spinPanel").hide();
    });
    //$("#kenoPanel").hide();
    //$("#spinPanel").show();


    $(".strictTouch").click(function() {
        $("#" + this.id).addClass('disable');
        setTimeout(() => {
            $("#" + this.id).removeClass('disable');
        }, 1000);
    });
});

var barcode = '';
var payInfo;

$("#scanedCodePrintLater").click(function() {
    if (!payInfo == null) {
        if (payInfo.status == "redeem") {
            //pay latter
        }
        if (payInfo.status == "cancel") {
            //re-print
        }
    }
});

function visit(id) {
    document.getElementById(id).style.display = "block";
}

function hidit(id) {
    document.getElementById(id).style.display = "none";
}

$("#scanedCodeCanceleeeeelDeem").click(function() {
    //visit("#spinner-border-sm-redeem-cancel");
    if (payInfo != null) {
        if (payInfo.status == "redeem") {
            //redeem          
            $.get(requestSite() + 'type=redeem&code=' + payInfo.code +'&time='+ new Date().getTime(), function(data) {
                if (data.err == "true") {
                    if(data.errText=="logout"){
                          location.replace("./?logout=true");
                          console.log("please logout and sign in again.");
                    }
                    payInfo = {};
                    $("#pleaseScanTickeDiv").show();
                    $("#endalebeqaId").hide();
                    $('#myModalTicket').hide();
                    notify("warning", data.errText);
                } else if (data.err == "false") {
                    if(document.getElementById("redemption_receipt").checked  == true){
                        payLaterRed(payInfo.code, payInfo.won);
                    }
                  
                
                    $("#pleaseScanTickeDiv").show();
                    $("#endalebeqaId").hide();
                    $('#myModalTicket').hide();
                    
                    notify("success", "በዚህ የቲኬት ቁጥር " + thousands_separators(data.amount) + "ብር በቀን " + data.on + " በ " + data.by + " ተቀናሽ ተደርግዋል።");
                } else {
                    $("#pleaseScanTickeDiv").hide();
                    notify("warning", "በማይታወቅ ችግር ምክኒያት መረጃውን ማግኘት አልተቻለም።");
                }

            }).fail(function() {
                $("#pleaseScanTickeDiv").hide();
                notify("warning", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
            });
        }
        if (payInfo.status == "active") {
            //cancel
            $.get(requestSite() + 'type=cancel&code=' + payInfo.code, function(data) {
                if (data.err == "true") {
                    if(data.errText=="logout"){
                          location.replace("./?logout=true");
                          console.log("please logout and sign in again.");
                    }
                    payInfo = {};
                    $("#pleaseScanTickeDiv").show();
                    $("#endalebeqaId").hide();
                    $('#myModalTicket').hide();
                    notify("warning", data.errText);
                } else if (data.err == "false") {
                    $("#pleaseScanTickeDiv").show();
                    $("#endalebeqaId").hide();
                    $('#myModalTicket').hide();
                    notify("info", "የቲኬት ቁጥር " + data.code + " በተሳካ ሁኔታ ተሰርዟል።");
                } else {
                    $("#pleaseScanTickeDiv").hide();
                    notify("warning", "በማይታወቅ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
                }
            }).fail(function() {
                $("#pleaseScanTickeDiv").hide();
                notify("warning", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
            });
        }
    }
});

var interval;


$("#scanedCodeClose").click(function() {
    $('#myModalTicket').hide();
    barcode = '';
    payInfo = null;
    $("#pleaseScanTickeDiv").show();
    $("#endalebeqaId").hide();
});

$("#scanedCodePrintLater").click(function() {
    if (payInfo.status == 'redeem') {
        payLater(payInfo.code, payInfo.won);
    } else {
        alert("እንደገና ፕሪንት ማድረግ ለጊዜው አይቻልም። እባክዎ Copy የሚለውን ምርጫ ይጠቀሙ።");
    }
});
var readingbarcode = false;
$(document).keydown(function(evt) {
    let myModalTicketDisplay = document.getElementById('myModalTicket').style.display;
    let pleaseScanTickeDiv = document.getElementById('pleaseScanTickeDiv').style.display;
    if (myModalTicketDisplay == "block" && pleaseScanTickeDiv == "") {
        if (interval) {
            clearInterval(interval);
        }
        if (evt.code == 'Enter') {
            if (barcode) { 
                handleBarcodehelper(barcode);
            }
            barcode = '';
            return;
        }
        if (evt.key != 'Shift') {
            barcode += evt.key;
            //console.log(barcode);
        }
        if (!readingbarcode) {
            readingbarcode = true;
            setTimeout( () => {
                barcode = "";
                readingbarcode = false;
            }, 2000);
        }
    }
});
function payLaterRed(code, amount) {
    $("#payLaterTime212").html(new Date());
    $("#payLaterAmount212").html(thousands_separators(amount));
    JsBarcode("#payLaterCode212", code, {
        width: 1.2,
        height: 40,
        fontSize: 13,
        textMargin: 1,
        margin: 0,
        text: code.split('').join(' ')
    });

    printJS({
        printable: 'printLaterPrint212',
        type: 'html',
        css: './css/ticket.css'
    })
}
function handleBarcodehelper(scanned_barcode) {
    if(Number.isInteger(parseInt(scanned_barcode))==true && scanned_barcode.length >= 15){
        handleBarcode(scanned_barcode);
    }
 
    else{
        document.getElementById("kkiop12332").style.backgroundColor = "red";
        setTimeout(() => {
            document.getElementById("kkiop12332").style.backgroundColor = "white";
        }, 200);
        //console.log(scanned_barcode.length);
        $("#kkiop12332").val("");

    }
}
function handleBarcode(scanned_barcode) {
    barcode = '';
    $("#pleaseScanBarCode").hide();
    $("#pleaseScanBarCodeSpinner").show();
    $.get(requestSite() + 'type=scanned_barcode&code=' + scanned_barcode +'&time='+ new Date().getTime(), function(data) {
        if (data.err == "true") {
            if(data.errText=="logout"){
                          location.replace("./?logout=true");
                          console.log("please logout and sign in again.");
                    }
            $("#pleaseScanBarCode").show();
            $("#pleaseScanBarCodeSpinner").hide();
            notify("warning", data.errText);
        } else {
            $("#pleaseScanBarCode").show();
            $("#pleaseScanBarCodeSpinner").hide();

            if (data.status == "active") {
                payInfo = data;

                $("#pleaseScanTickeDiv").hide();


                $("#scanedTicketStatus").removeClass("modal-titli");
                $("#scanedTicketStatus").addClass("modal-title");

                $("#scanedTicketStatus").html("ACTIVE TICKET");
                $("#scanedCodeStake").html(payInfo.user.stake);
                //$("#scanedCodeSelection").html("WIN(" + payInfo.user.selection.length + ") : " + payInfo.user.selection.join(" - "));

                $("#scanedCodeCancelDeem").removeClass("btn-successi");
                $("#scanedCodeCancelDeem").addClass("btn-danger");
                $("#scanedCodeCancelDeem").html(" <span id='spinner-border-sm-redeem-cancel' style='display:none' class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Cancel ticket");
                $("#scanedCodePrintLater").html("Re-print");
                $("#endalebeqaId").show();

            }
            if (data.status == "redeem") {
                payInfo = data;
                $("#pleaseScanTickeDiv").hide();

                $("#scanedTicketStatus").removeClass("modal-title");
                $("#scanedTicketStatus").addClass("modal-titli");

                $("#scanedTicketStatus").html("WON " + thousands_separators(data.won) + "Br");
                $("#scanedCodeStake").html(payInfo.user.stake);
                //$("#scanedCodeSelection").html("WIN(" + payInfo.user.selection.length + ") : " + payInfo.user.selection.join(" - "));

                $("#scanedCodeCancelDeem").removeClass("btn-danger");
                $("#scanedCodeCancelDeem").addClass("btn-successi");
                $("#scanedCodeCancelDeem").html(" <span id='spinner-border-sm-redeem-cancel' style='display:none' class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Redeem ticket");
                $("#scanedCodePrintLater").html("Pay-later");
                $("#endalebeqaId").show();

            }
            if (data.status == "redeemed") {
                $('#myModalTicket').hide();
                if (data.type == "now") {
                    notify("success", "በዚህ የቲኬት ቁጥር " + thousands_separators(data.amount) + "ብር በቀን " + data.on + " በ " + data.by + " ተቀናሽ ተደርግዋል።.");
                }
                if (data.type == "before") {
                    notify("warning", "በዚህ የቲኬት ቁጥር " + thousands_separators(data.amount) + "ብር በቀን " + data.on + " በ " + data.by + " ተቀናሽ ተደርግዋል።.");
                }
            }
            if (data.status == "canceled") {
                $('#myModalTicket').hide();
                notify("warning", "ቲኬቱ በተሳካ ሁኔታ ተሰርዝዋል።");

            }
            if (data.status == "unknown") {
                $('#myModalTicket').hide();
                notify("warning", "ያልታወቀ የቲኬት ቁጥር። እባክዎ ቲኬቱን እንደገና scan ያድርጉ።");
            }
        }


    }).fail(function() {
        $("#pleaseScanBarCode").show();
        $("#pleaseScanBarCodeSpinner").hide();
        $('#myModalTicket').hide();
        notify("error", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
    });
}

function payLater(code, amount) {
    $("#payLaterTime").html(new Date());
    $("#payLaterAmount").html(thousands_separators(amount));
    JsBarcode("#payLaterCode", code, {
        width: 1.2,
        height: 40,
        fontSize: 13,
        textMargin: 1,
        margin: 0,
        text: code.split('').join(' ')
    });

    printJS({
        printable: 'printLaterPrint',
        type: 'html',
        css: './css/ticket.css'
    })
}

/*set selection(selectionIn) {
        console.log('setting..');
        this.selectionI = selectionIn;
      },

    get selection() {
        console.log('getting..');
        return this.selectionIn;
      },

    set stake(stakeIn) {
        console.log('setting..');
        this.stakeI = stakeIn;
      },

    get stake() {
        console.log('getting..');
        return this.stakeI;
      }*/
var kenoSelected = {
    selectionI: {},
    stakeI: 10,
};

function hi(j) {
    var keysC = Object.keys(kenoSelected.selectionI);
    if (kenoSelected.selectionI[j] == true) {

        $("#" + j).removeClass("selectedKeno");

        delete kenoSelected.selectionI[j];
        var keys = Object.keys(kenoSelected.selectionI);


        // document.getElementById('kenoSelected').innerText = '';


        kenoOdds();
    } else if (kenoSelected.selectionI['heads'] == true) {
        alert('First of, clear or place the bet on the slip.');
    } else if (kenoSelected.selectionI['tails'] == true) {
        alert('First of, clear or place the bet on the slip.');
    } else if (kenoSelected.selectionI['evens'] == true) {
        alert('First of, clear or place the bet on the slip.');
    } else {
        if (j == 'heads') {
            if (keysC.length == 0) {
                $("#" + j).addClass("selectedKeno");
                kenoSelected.selectionI[j] = true;
                var keys = Object.keys(kenoSelected.selectionI);

                //var val = keys.join('-');

                //document.getElementById('kenoSelected').innerText = val;

                kenoOdds();
            } else {
                alert('First of, clear or place the bet on the slip.');
            }
        } else if (j == 'tails') {
            if (keysC.length == 0) {
                $("#" + j).addClass("selectedKeno");
                kenoSelected.selectionI[j] = true;
                var keys = Object.keys(kenoSelected.selectionI);

                //var val = keys.join('-');
                //document.getElementById('kenoSelected').innerText = val;

                kenoOdds();
            } else {
                alert('First of, clear or place the bet on the slip.');
            }
        } else if (j == 'evens') {
            if (keysC.length == 0) {
                $("#" + j).addClass("selectedKeno");
                kenoSelected.selectionI[j] = true;
                var keys = Object.keys(kenoSelected.selectionI);

                //var val = keys.join('-');
                //document.getElementById('kenoSelected').innerText = val;

                kenoOdds();
            } else {
                alert('First of, clear or place the bet on the slip.');
            }
        } else if (keysC.length < 10 && typeof kenoSelected.selectionI.heads == 'undefined' && typeof kenoSelected.selectionI.tails == 'undefined' && typeof kenoSelected.selectionI.evens == 'undefined') {
            $("#" + j).addClass("selectedKeno");
            kenoSelected.selectionI[j] = true;
            var keys = Object.keys(kenoSelected.selectionI);


            //document.getElementById('kenoSelected').innerText = val;

            kenoOdds();
        } else if (keysC.length == 10) {
            notify("warning", "ከፍተኛው የውርርድ ምርጫ ላይ ደርሷል! ለመጨመር ቀድመው ከመረጧቸው ቁጥሮች መቀነስ ይኖርቦታል።");
        } else {
            alert('ይህን ለማድረግ አስቀድሞ የመረጡትን ውርርድ ማጥፋት አልያም መመደብ ይኖርቦታል።።');
        }

    }



}

function turnodds(u = 'kiron'){
    if(u == 'mohio'){
        let odds = {
                1: 4,
                2: 15,
                3: 50,
                4: 100,
                5: 300,
                6: 500,
                7: 1000,
                8: 2000,
                9: 4200,
                10: 5000,
                'heads': 2,
                'tails': 2,
                'evens': 4
            };
            return odds;
    }
   
    let odds = {
            1: 4,
            2: 15,
            3: 35,
            4: 100,
            5: 300,
            6: 1800,
            7: 2150,
            8: 3000,
            9: 4200,
            10: 5000,
            'heads': 2,
            'tails': 2,
            'evens': 4
        };
        return odds;
}

function kenoOdds() {
    const odds = turnodds('promo4');

    var keys = Object.keys(kenoSelected.selectionI);

    if (keys.length == 0) {
        valyval = 0;
        $("#SmartPlayKenoAddToSlipDiv").hide();
        $("#SmartPlayKenoTutorialPanel").show();
        $("#stakeKenoIn").val(10);
    }
    if (keys.length > 0) {
        $("#SmartPlayKenoAddToSlipDiv").show();
        $("#SmartPlayKenoTutorialPanel").hide();

        $("#ExtraDescriptionSelection").text(keys.join('-'));

        if (keys.length == 1) {
            if (Object.keys(kenoSelected.selectionI)[0] == 'heads' || Object.keys(kenoSelected.selectionI)[0] == 'tails' || Object.keys(kenoSelected.selectionI)[0] == 'evens') {
                $("#ExtraDescriptionOdd").text(odds[Object.keys(kenoSelected.selectionI)[0]]);
                $("#kenoToWin").text("Br " + thousands_separators(odds[Object.keys(kenoSelected.selectionI)[0]] * $("#stakeKenoIn").val()));
                $("#placeSingleKenoBetAmount").text("Br " + $("#stakeKenoIn").val());
            } else {
                $("#ExtraDescriptionOdd").text(odds[keys.length]);
                $("#kenoToWin").text("Br " + thousands_separators(odds[keys.length] * $("#stakeKenoIn").val()));
                $("#placeSingleKenoBetAmount").text("Br " + $("#stakeKenoIn").val());
            }
        } else {
            $("#ExtraDescriptionOdd").text(odds[keys.length]);
            $("#kenoToWin").text("Br " + thousands_separators(odds[keys.length] * $("#stakeKenoIn").val()));
            $("#placeSingleKenoBetAmount").text("Br " + $("#stakeKenoIn").val());
        }

        $("#ExtraDescriptionWinLen").text(keys.length);


    }

}

valyval = 0;
var tricket = 0;

function onDenominationClick(val) {
    if (valyval == 0) {

        if ((parseInt(val) + parseInt($("#stakeKenoIn").val())) < 10 || (parseInt(val) + parseInt($("#stakeKenoIn").val())) > 1000) {
            notify("warning", "ከፍተኛው ወይም ዝቅተኛው የመወራረጃ የገንዘብ መጠን ላይ ደርሷል!");

            $("#stakeKenoIn").css("background-color", "red");

            if (val < 10) {
                $("#stakeKenoIn").val(10)
                kenoOdds();
            }
            if (val > 1000) {
                $("#stakeKenoIn").val(1000)
                kenoOdds();
            }
            setTimeout(() => {
                $("#stakeKenoIn").css("background-color", "white");
            }, 200);
        } else {
            $("#stakeKenoIn").val(val)
            kenoSelected.stakeI = val;
            kenoOdds();
            valyval = 1;
        }
    } else {
        var inol = parseInt(val) + parseInt($("#stakeKenoIn").val());
        if (inol >= 10 && inol <= 1000) {
            $("#stakeKenoIn").val(inol);
            kenoSelected.stakeI = inol;
            kenoOdds();
        } else {
            notify("warning", "ከፍተኛው ወይም ዝቅተኛው የመወራረጃ የገንዘብ መጠን ላይ ደርሷል!");

            $("#stakeKenoIn").css("background-color", "red");

            if (inol < 10) {
                $("#stakeKenoIn").val(10)
                kenoOdds();
            }
            if (inol > 1000) {
                $("#stakeKenoIn").val(1000)
                kenoOdds();
            }
            setTimeout(() => {
                $("#stakeKenoIn").css("background-color", "white");
            }, 200);
        }
    }
}

function clearKenoThings() {

    valyval = 0;
    kenoSelected.stakeI = 10;
    kenoSelected.selectionI = {};

    for (let index = 0; index < 81; index++) {
        $("#" + index).removeClass("selectedKeno");
    }
    $("#heads").removeClass("selectedKeno");
    $("#tails").removeClass("selectedKeno");
    $("#evens").removeClass("selectedKeno");
    
    kenoOdds();
}

var kenoSelectedMulti = {};
var addedKeno = 0;



function addSingleBetToSlip() {
    hidit("printJsFormKeno");
    $("#kenoPlaceBetAmount").html(parseInt($("#kenoPlaceBetAmount").html()) + parseInt(kenoSelected.stakeI));
    addedKeno = parseInt(addedKeno) + 1;
    $("#cancelAndReprintKeno").hide();
    $("#placeAndClearKeno").show();
    const odds = {
        1: 3.8,
        2: 15,
        3: 35,
        4: 100,
        5: 300,
        6: 1800,
        7: 2150,
        8: 3000,
        9: 4200,
        10: 5000,
        'heads': 2,
        'tails': 2,
        'evens': 4
    };

    var keys = Object.keys(kenoSelected.selectionI);

    if (keys.length == 1) {
        if (Object.keys(kenoSelected.selectionI)[0] == 'heads' || Object.keys(kenoSelected.selectionI)[0] == 'tails' || Object.keys(kenoSelected.selectionI)[0] == 'evens') {
            var uiy = odds[Object.keys(kenoSelected.selectionI)[0]];
        } else {
            var uiy = odds[keys.length];
        }
    } else {
        var uiy = odds[keys.length];
    }

    var helloMyBrother = '<div style="width: 90%;margin:auto;  margin-top: 12px;  " id="helloMyBrotherGo' + Object.keys(kenoSelectedMulti).length + '">        <div class="PlacedBet pb-1 ExpandAnimation" style="background-color: rgb(235, 235, 235) !important; ">            <div class="BetDetails">                <div class="SmartPlayKenoIcon">                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.86 49.81" data-svg-id="SmartPlayKenoSVG" class="icon" alt="SmartPlayKeno" src="/Content/Images/Icons/SmartPlayKenoIcon.svg">                        <path class="cls-1" d="M.55,19.86A.7.7,0,0,1,.61,20a13.67,13.67,0,0,0,1,3,3.32,3.32,0,0,0,.37.62q.33.46.69.91a8.14,8.14,0,0,0,1.93,1.79,13,13,0,0,0,1.7,1,1.75,1.75,0,0,1,.56.4A2.18,2.18,0,0,0,8,28.33a.4.4,0,0,0,.18,0,9.24,9.24,0,0,1,3.07-.23,7.46,7.46,0,0,1,2.94.8,1.91,1.91,0,0,0,1.35.1c.08,0,.17-.13.21-.22.35-.76.69-1.52,1-2.28a.79.79,0,0,1,.18-.24A16.73,16.73,0,0,0,15.55,30l-.48-.23,0,0a1.18,1.18,0,0,0,.23.22.4.4,0,0,1,.19.51,15.52,15.52,0,0,0,.73,8.91c.35.84.78,1.64,1.17,2.45.05.11.09.2,0,.32a9.38,9.38,0,0,1-2.67,2.36,8.69,8.69,0,0,1-13-8.76,8.8,8.8,0,0,1,2.82-5.39c.3-.28.29-.28,0-.61a18.26,18.26,0,0,1-2.1-3.2A16.94,16.94,0,0,1,.62,20.95c0-.3-.08-.6-.12-.9a1.41,1.41,0,0,1,0-.17Zm10.52,11a1.08,1.08,0,0,0-.11-.18c-.34-.34-.67-.71-1-1a1.33,1.33,0,0,0-1.54-.19l-.15.05a6.64,6.64,0,0,0-3,2.23c-.15.2-.12.22.09.33q.78.4,1.53.83c.27.15.29.17.51-.06a6.85,6.85,0,0,1,3.51-1.9A1.28,1.28,0,0,0,11.06,30.83ZM8.7,32.45a.81.81,0,0,0-.82.78.66.66,0,0,0,.68.64.79.79,0,0,0,.81-.78A.62.62,0,0,0,8.7,32.45Z"></path>                        <path class="cls-1" d="M20.6,45.71l.28.14A8,8,0,0,0,24.81,47a10.77,10.77,0,0,0,3.39-.44c.14,0,.31,0,.46,0a7.56,7.56,0,0,0,1.25-.42c.72-.36,1.43-.75,2.11-1.17a17.59,17.59,0,0,0,1.78-1.25c.6-.48,1.16-1,1.72-1.56a16.27,16.27,0,0,0,1.22-1.24c.44-.51.83-1.06,1.22-1.61s.58-.86.84-1.31a2.06,2.06,0,0,0,.1-.44c.07-.21.14-.42.23-.62.15-.36.34-.71.46-1.08s.17-.81.28-1.21.24-.7.37-1,.23-.52.34-.78.14-.27.2-.41h.08a1.27,1.27,0,0,1,.15.3,8.06,8.06,0,0,1,.1.81c0,.44.16.55.59.49A8.91,8.91,0,0,1,44,33.95c.3,0,.37,0,.38-.34a12.87,12.87,0,0,0-.8-4.51,14.81,14.81,0,0,0-2-3.83,1.63,1.63,0,0,1-.39-.74l.15,0,.23,0c0-.08,0-.18,0-.24-.34-.55-.7-1.09-1.05-1.64l-.15-.21,0,0a2.83,2.83,0,0,0,.28.21,6.54,6.54,0,0,1,2,2.06A15.39,15.39,0,0,1,44.8,29a14.39,14.39,0,0,1,.72,4.22,19.6,19.6,0,0,1-.11,2.62,15.42,15.42,0,0,1-1.31,4.6,15.58,15.58,0,0,1-3.56,4.95,15.25,15.25,0,0,1-5.25,3.19,14.72,14.72,0,0,1-4.15.85,14.28,14.28,0,0,1-4-.34,14.78,14.78,0,0,1-4.87-2.07c-.54-.36-1-.78-1.56-1.17a.86.86,0,0,1-.11-.12Z"></path>                        <path class="cls-1" d="M12.34,13.71c.17.32.33.58.45.85A3.89,3.89,0,0,1,13,16.81a7.72,7.72,0,0,1-1.6,3.13,5.89,5.89,0,0,1-1.25,1.3,2.44,2.44,0,0,1-2.37.49,5.39,5.39,0,0,1-2-1.27,27.36,27.36,0,0,1-2-2A6.93,6.93,0,0,1,3,17.13a4.67,4.67,0,0,1-.6-1.47,4.14,4.14,0,0,1,.31-2.29,9.29,9.29,0,0,1,1.6-2.6,2.8,2.8,0,0,1,2.19-1.1c.14,0,.24,0,.15-.2a1.78,1.78,0,0,1,.13-1.92,9.84,9.84,0,0,1,2.1-2.44,3.74,3.74,0,0,1,2.46-1,3.9,3.9,0,0,1,.82.13,13.33,13.33,0,0,1,1.41.38,17.84,17.84,0,0,1,1.76.73,11.05,11.05,0,0,1,1.36.79,10.53,10.53,0,0,1,1.27,1,2,2,0,0,1,.19,2.64c-.15.23-2.23,3.55-3.71,3.78a3.26,3.26,0,0,1-1.65.13A3.27,3.27,0,0,0,12.34,13.71Zm-2.18,1.2a2.13,2.13,0,0,0-.23-.74A9,9,0,0,0,8.72,13a6.44,6.44,0,0,0-1.86-1.21.72.72,0,0,0-.85.12,6.34,6.34,0,0,0-1.56,2.36,1.3,1.3,0,0,0,.18,1.23,4,4,0,0,0,.63.77c.56.53,1.12,1.07,1.73,1.55a.92.92,0,0,0,1.1.14,4.14,4.14,0,0,0,1.12-1.12A9,9,0,0,0,10,15.43,3.94,3.94,0,0,0,10.16,14.91Zm4.52-6.5A1.08,1.08,0,0,0,14.5,8a2.76,2.76,0,0,0-.67-.53c-.71-.37-1.44-.72-2.18-1a1.29,1.29,0,0,0-1-.12,2.83,2.83,0,0,0-.82.54,5.86,5.86,0,0,0-.72.88,6.73,6.73,0,0,0-.51.85.62.62,0,0,0,.17.8c.17.16.36.29.54.44a8.08,8.08,0,0,0,2.47,1.45,1,1,0,0,0,1.07-.21,13.18,13.18,0,0,0,1.3-1.36A2.35,2.35,0,0,0,14.68,8.41Z"></path>                        <path class="cls-1" d="M29.59,31.48H26.07c-.3,0-.34,0-.32-.34s0-.57.06-.86a6.28,6.28,0,0,1,.11-1A6.68,6.68,0,0,1,27.1,27,33.21,33.21,0,0,1,30,23.55c.53-.55,1.08-1.07,1.61-1.61a.67.67,0,0,1,.56-.22l3.15.22a.37.37,0,0,1,.36.38c.12,1.08.27,2.15.37,3.23s.16,2.3.23,3.46c0,.21.1.29.3.29l.88,0c.27,0,.39.12.4.38q.05.79.09,1.58c0,.27-.08.36-.36.35l-1,0c-.19,0-.26.07-.26.26q0,1.21,0,2.42c0,.39-.07.46-.46.45l-2.07,0c-.37,0-.42,0-.42-.41,0-.81,0-1.61,0-2.42,0-.34,0-.36-.36-.36H29.59Zm3.61-8.1-.1-.06a1,1,0,0,1-.11.18c-.58.65-1.18,1.29-1.76,2-1,1.15-2,2.31-2.95,3.47a.73.73,0,0,0-.08.25.8.8,0,0,0,.23.07c.3,0,.6,0,.91,0l3.7,0c.34,0,.36,0,.35-.36q-.08-2.58-.16-5.16C33.23,23.58,33.21,23.48,33.2,23.38Z"></path>                        <path class="cls-1" d="M23.28,22.74a6.21,6.21,0,0,0-2,.36,6.09,6.09,0,0,0-2.55,1.63,3.23,3.23,0,0,0-.43.48,14.42,14.42,0,0,0-.75,1.42A12.36,12.36,0,0,0,17,28.12a13,13,0,0,0-.3,1.36c-.12.63-.25,1.26-.3,1.89a6.49,6.49,0,0,0,.09,2.13,1.32,1.32,0,0,0,.65.91,4.1,4.1,0,0,0,1.84.4,7.47,7.47,0,0,0,2.87-.33,2.54,2.54,0,0,0,1.32-.9A3.47,3.47,0,0,0,23.82,32c.07-.47.17-2.44.16-2.95a3.74,3.74,0,0,0-.17-1.49c-.5-1.09-2.77-.82-2.83-.81a3.79,3.79,0,0,0-2.7,1.31.42.42,0,0,1,0-.11c.17-.63.32-1.28.53-1.9A1.84,1.84,0,0,1,19.55,25a5.4,5.4,0,0,1,2.08-.8c.5-.07.68.09.68.59a1.15,1.15,0,0,1,0,.21c0,.2,0,.24.23.21L24.16,25a.26.26,0,0,0,.17-.16,7.29,7.29,0,0,0,.07-1A1,1,0,0,0,23.28,22.74Zm-4.66,6.35a3.79,3.79,0,0,1,.7-.24c.62-.16,2-.44,2.37-.13s.15,1,.13,1.16c-.09.53-.18,1.07-.29,1.6a1.08,1.08,0,0,1-.78,1,6.14,6.14,0,0,1-2.42.17c-.23,0-.46-.13-.49-.39a10,10,0,0,1-.08-1.13,3.69,3.69,0,0,1,.07-.65A1.59,1.59,0,0,1,18.62,29.08Z"></path>                        <path class="cls-1" d="M34.65,11.29A17.94,17.94,0,0,1,36,19.35a.67.67,0,0,1-.15,0l-1.18-.42c-.13,0-.16-.09-.15-.26a12.36,12.36,0,0,0-.11-1.71c0-.32-.34-.5-.59-.69s-.24-.25-.15-.55.18-.81.26-1.22c0-.08,0-.15.06-.23s.15.11.18.18c.21.63.42,1.26.62,1.89.06.18.09.36.14.54S35,17,35,17s.09-.09.09-.15c0-.46.12-.92.12-1.39a11.54,11.54,0,0,0-.34-2.93c-.09-.35-.2-.7-.29-1.05a1.58,1.58,0,0,1,0-.19Z"></path>                        <path class="cls-1" d="M31,18.22a15.33,15.33,0,0,0-9.9,3.19L21,21.33l.18-.1a15.63,15.63,0,0,1,3.49-2c.52-.2,1-.41,1.57-.56a11.19,11.19,0,0,1,1.49-.34c.69-.11,1.39-.17,2.09-.25a6.84,6.84,0,0,1,.69-.07,2.42,2.42,0,0,1,.46.08Z"></path>                        <path class="cls-1" d="M30.49,5.34l1,1C31.28,6.34,30.48,5.6,30.49,5.34Z"></path>                        <path class="cls-1" d="M15.58,35.76a.33.33,0,0,1,0-.2l-.77-.14a5.36,5.36,0,0,1,.1.69l.69.11A1.12,1.12,0,0,1,15.58,35.76Z"></path>                        <path class="cls-1" d="M35,11.12A18.21,18.21,0,1,0,4.87,30.59a3.15,3.15,0,0,1,.53-.4,17.55,17.55,0,1,1,30.35-12q0,.72-.06,1.42.3.11.59.25h0l0,0q.08-.84.08-1.68A18.09,18.09,0,0,0,35,11.12Z"></path>                        <path class="cls-1" d="M17.76,42q-.16-.22-.31-.46A8.48,8.48,0,0,1,1.77,37.1,8.4,8.4,0,0,1,4.9,30.57a3.15,3.15,0,0,1,.49-.37,8.49,8.49,0,0,1,10.35.5.36.36,0,0,1,0-.2,2.37,2.37,0,0,0,.11-.41.33.33,0,0,1,0-.09,9.07,9.07,0,1,0,1.92,12.11Z"></path>                        <path class="cls-1" d="M41.3,22.56a15.26,15.26,0,0,0-22,0,16.27,16.27,0,0,0,0,22.58,15.26,15.26,0,0,0,22,0,16.27,16.27,0,0,0,0-22.58Zm-11,26.6A15.05,15.05,0,0,1,15.6,36.31a.65.65,0,0,1,0-.33,15.76,15.76,0,0,1,.19-5.34.36.36,0,0,1,0-.08,15,15,0,0,1,14.55-12A15.13,15.13,0,0,1,45.2,33.84,15.13,15.13,0,0,1,30.31,49.16Z"></path>                    </svg>                </div>                <h3 style="padding: 5px; font-size: 13px;">                   <strong> Win [ <span> ' + Object.keys(kenoSelected.selectionI).length + ' </span> ]</strong>                </h3>                <h3><span class="ExtraDescription"> ' + Object.keys(kenoSelected.selectionI).join('-') + ' </span>                    <span class="Bet nohover">' + uiy + '</span></h3>            </div>                      <div class="ToWinAmount"> <span style="margin-right:20px">Stake: <b> <span>Br ' + thousands_separators(kenoSelected.stakeI) + '</span></b></span><span> To Win:<b> <span>Br ' + thousands_separators(uiy * $("#stakeKenoIn").val()) + '</span><b/></span></div><div class="Remove" onclick="removeBetFromSlip(' + Object.keys(kenoSelectedMulti).length + ');">                <i class="bi bi-x-lg"></i>            </div>        </div>    </div>';

    $("#helloMyBrother").prepend(helloMyBrother);
    kenoSelectedMulti[Object.keys(kenoSelectedMulti).length] = kenoSelected;
    kenoSelected = {
        selectionI: {},
        stakeI: 10,
    };
    for (let index = 0; index < 81; index++) {
        $("#" + index).removeClass("selectedKeno");
    }
    $("#heads").removeClass("selectedKeno");
    $("#tails").removeClass("selectedKeno");
    $("#evens").removeClass("selectedKeno");

    kenoOdds();
}

function removeBetFromSlip(params) {


    $("#kenoPlaceBetAmount").html(parseInt($("#kenoPlaceBetAmount").html()) - parseInt(kenoSelectedMulti[params]["stakeI"]));
    addedKeno = parseInt(addedKeno) - 1;
    if (addedKeno == 0) {
        $("#placeAndClearKeno").hide();
        $("#printJsFormKeno").show();
        if (tricket == 1) {
            $("#cancelAndReprintKeno").show();
        }

    }
    kenoSelectedMulti[params] = "";
    document.getElementById("helloMyBrotherGo" + params).style.display = "none";


}

function clearKenoThingsMaster() {
    addedKeno = 0;
    kenoSelectedMulti = {};
    $("#kenoPlaceBetAmount").html(0);
    $("#helloMyBrother").html("");
    $("#placeAndClearKeno").hide();
    visit("printJsFormKeno");
    if (tricket == 1) {
        visit("cancelAndReprintKeno");
    }
}

/*       
    $.get(requestSite()+'type=redeem&code='+payInfo.code , function(data){

    }).fail(function() {
       
    });
*/
var lastTicketFullData = null;
var lastTicketFullDataType = null;

function tikhis(data){
    if (localStorage.bets) {
       
        localStorage.clickcount = Number(localStorage.clickcount) + 1;
    } else {
        localStorage.clickcount = 1;
    }
    document.getElementById("result").innerHTML = "You have clicked the button " +
    localStorage.clickcount + " time(s)."; 
}


function kenoBetGodhii(input) {
    if (input == 'single') {
        $("#AddToSlipDivLoader").show();
        var kenoSelectedSend = {
            0: {
                selectionI: kenoSelected.selectionI,
                stakeI: kenoSelected.stakeI
            }
        };

        $.get(requestSite() + 'type=kenoBet&user=' + JSON.stringify(kenoSelectedSend) + '&action=multiple&time='+ new Date().getTime(), function(data) {
            if (data.err == 'true') {
                if(data.errText=="logout"){
                          location.replace("./?logout=true");
                          console.log("please logout and sign in again.");
                    }

                $("#AddToSlipDivLoader").hide();
                notify("error", data.errText);
            } else if (data.err == 'false') {
                
                
                tricket = 1;
                $("#AddToSlipDivLoader").hide();
                kenoSelected = {
                    selectionI: {},
                    stakeI: 10,
                };
                for (let index = 0; index < 81; index++) {
                    $("#" + index).removeClass("selectedKeno");
                }
                $("#heads").removeClass("selectedKeno");
                $("#tails").removeClass("selectedKeno");
                $("#evens").removeClass("selectedKeno");

                kenoOdds();

                notify("success", "በተሳካ ሁነታ ተወራርደዋል");
                kenoPrintGodhii(data);

                lastTicketFullData = data;
                lastTicketFullDataType = 'single';
                kenoTicketDisplay(lastTicketFullData, 'single');

                if (addedKeno > 0) {
                    $("#helloMyBrother").hide();
                    $("#placeAndClearKeno").hide();
                    visit("printJsFormKeno");
                    visit("cancelAndReprintKeno");

                    setTimeout(() => {
                        $("#helloMyBrother").show();
                        $("#placeAndClearKeno").show();
                        hidit("printJsFormKeno");
                        hidit("cancelAndReprintKeno");
                    }, 2000);

                } else {
                    visit("cancelAndReprintKeno");
                }


            } else {
                $("#AddToSlipDivLoader").hide();
                notify("error", "በማይታወቅ ምክኒያት መረጃውን ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።");
            }

        }).fail(function() {
            $("#AddToSlipDivLoader").hide();
            notify("error", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
        });




    } else if (input == 'multiple') {
        $("#kenoTicketLoader").show();
        //clearKenoThingsMaster();
        $.get(requestSite() + 'type=kenoBet&user=' + JSON.stringify(kenoSelectedMulti) + '&action=' + input+'&time='+ new Date().getTime(), function(data) {
            if (data.err == 'true') {
                if(data.errText=="logout"){
                          location.replace("./?logout=true");
                          console.log("please logout and sign in again.");
                    }
                $("#AddToSlipDivLoader").hide();
                notify("error", data.errText);
            } else if (data.err == 'false') {
                $("#kenoPlaceBetAmount").html(0);
                $("#AddToSlipDivLoader").hide();
                $("#helloMyBrother").html("");
                $("#placeAndClearKeno").hide();
                visit("printJsFormKeno");
                visit("cancelAndReprintKeno");
                $("#kenoTicketLoader").hide();

                lastTicketFullData = data;
                lastTicketFullDataType = 'multiple';

                notify("success", "በተሳካ ሁነታ ትወራርደዋል።");
                kenoPrintGodhii(data);
                kenoTicketDisplay(data, 'multiple');

                addedKeno = 0;
                kenoSelectedMulti = {};
            } else {
                $("#kenoTicketLoader").hide();
                notify("error", "በማይታወቅ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
            }
        }).fail(function() {
            $("#kenoTicketLoader").hide();
            notify("error", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
        });
    }
}


function kenoPrintGodhii(input, type = "normal", game_type = "keno") {
    if(game_type == "keno"){$("#TPTgameId").html("# " + input.id);
    $("#TPTdate").html(input.on);
    $("#TPTidd").html(input.code.slice(6));
    $("#TPTcashier").html(input.by);
    $("#TPTagent").html(input.agent);
    //var seleA = '<div><b><span>Win('+input.win+')</span></b><span  class="floatRight"><B>Br '+ input.stake +'</b></span></div><div>'+ input.gameStartsOn +'</div><div><span  class="floatLeft">'+ input.selection.join(',') +'  '+input.odd +'.00</span></div> <br><br>';
    // $("#TPTselection").html(seleA +' '+ seleA);

    $("#TPTselection").html();




    var asfMain = "";
    for (let index = 0; index < input.user.length; index++) {
        const element = input.user[index];
        var asf = '<div><b><span>Win(' + element.selection.length + ')</span></b><span  class="floatRight"><B>Br ' + parseInt(element.stake).toFixed(2) + '</b></span></div><div>' + input.gameStartsOn + '</div><div><span  class="floatLeft">' + element.selection.join(',') + '  ' + element.odd + '.00</span></div> <br><br>';
        asfMain += asf;
    }

    $("#TPTselection").html(asfMain);


    $("#TPTstake").html("Br " + thousands_separators(input.TotalStake.toFixed(2)));
    $("#TPTwinMin").html("Br " + thousands_separators(input.toWinMin));
    $("#TPTwinMax").html("Br " + thousands_separators(input.toWinMax));

    var codycode = '*' + input.code + '*';
    JsBarcode("#TPTgameIdbarcode", input.code, {
        width: 1.2,
        height: 40,
        fontSize: 9,
        textMargin: 0,
        margin: 0,
        text: codycode.split('').join('')
    });

    $("#TPTstandards").html(input.company + " standard shop terms & condition apply.");
    if(type == 'reprint'){
        //$("#TPTreprinted").show();
       // $("#TPTcopied").hide();
        //console.log(1)
    }
    else if(type == 'copy'){
        //$("#TPTreprinted").hide();
        //$("#TPTcopied").show();
        //console.log(2)
    }
    else{
        $("#TPTreprinted").hide();
        $("#TPTcopied").hide();
        console.log(3)
    }
    
    printJS({
        printable: 'mainDivTik',
        type: 'html',
        css: './css/ticket.css'
    });}
    else if(game_type == "spin"){
        $("#TPTgameId").html("# " + input.id);
        $("#TPTdate").html(input.on);
        $("#TPTcashier").html(input.by);
        $("#TPTagent").html(input.agent);
        //var seleA = '<div><b><span>Win('+input.win+')</span></b><span  class="floatRight"><B>Br '+ input.stake +'</b></span></div><div>'+ input.gameStartsOn +'</div><div><span  class="floatLeft">'+ input.selection.join(',') +'  '+input.odd +'.00</span></div> <br><br>';
        // $("#TPTselection").html(seleA +' '+ seleA);

        $("#TPTselection").html();




        var asfMain = "";
        for (let index = 0; index < input.user.length; index++) {
            const element = input.user[index];
            var asf = '<div><b><span>' + element.win_type + '</span></b><span  class="floatRight"><B>Br ' + element.stake + '</b></span></div><div>' + input.gameStartsOn + '</div><div><span  class="floatLeft">' + element.val + '  ' + element.odd + '.00</span></div> <br><br>';
            asfMain += asf;
        }

        $("#TPTselection").html(asfMain);


        $("#TPTstake").html("Br " + thousands_separators(input.TotalStake));
        $("#TPTwinMin").html("Br " + thousands_separators(input.toWinMin));
        $("#TPTwinMax").html("Br " + thousands_separators(input.toWinMax));

        var codycode = '*' + input.code + '*';
        JsBarcode("#TPTgameIdbarcode", input.code, {
            width: 1.2,
            height: 40,
            fontSize: 9,
            textMargin: 0,
            margin: 0,
            text: codycode.split('').join('')
        });

        $("#TPTstandards").html(input.company + " standard shop terms & condition apply.");
        if(type == 'reprint'){
            $("#TPTreprinted").show();
            $("#TPTcopied").hide();
            
        }
        else if(type == 'copy'){
            $("#TPTreprinted").hide();
            $("#TPTcopied").show();
           
        }
        else{
            $("#TPTreprinted").hide();
            $("#TPTcopied").hide();
            
        }
        
        printJS({
            printable: 'mainDivTik',
            type: 'html',
            css: './css/ticket.css'
        });
    }

}


var ttyu = {};

function kenoTicketDisplay2(input, lastTicketFullDataType) {

    if (true) {
        $("#TBSkenoId").html("# " + input.id);
        $("#TBSkenoDate").html(input.on);
        $("#TBSkenoCashier").html(input.by);
        $("#TBSkenoAgent").html(input.agent);
        var asfMain = "";
        for (let index = 0; index < input.user.length; index++) {
            const element = input.user[index];
            var asf = ' <div class="ticketWin"><div class="sel">' + element.selection.join(',') + ' x' + element.odd + '</div><div class="odd">Br ' + element.stake + '</div></div>';
            asfMain += asf;
        }

        $("#TBSkenoSelection").html(asfMain + '<br><div class="ticketWin"><div class="sel">Total Stake</div><div class="odd"><b>Br ' + input.TotalStake + '</b></div></div>');
        $("#TBSkenoToWinTotalMin").html("Br " + thousands_separators(input.toWinMin));
        $("#TBSkenoToWinTotalMax").html("Br " + thousands_separators(input.toWinMax));

        var codycode = '*' + input.code + '*';
        JsBarcode("#TBSkenoBarcode", input.code, {
            width: 1.2,
            height: 40,
            fontSize: 9,
            textMargin: 0,
            margin: 0,
            text: codycode.split('').join('')
        });

        $("#TBSkenoCompany").html(input.company + " standard shop terms & condition apply.");
    }
}

function reprint(input) {
    if (input == 'keno') {
        if (lastTicketFullData == null) {
            notify("warning", "እስካሁን ምንም ትኬት አልተሰጠም።");
        } else {
            kenoPrintGodhii(lastTicketFullData, "reprint");
        }
    } 
    if (input == 'spin') {
        if (lastTicketFullData_spin == null) {
            notify("warning", "እስካሁን ምንም ትኬት አልተሰጠም።");
        } else {
             kenoPrintGodhii(lastTicketFullData_spin, "reprint", "spin");
        }
    }
}



function cancelTicket(input) {
    if (input == 'keno') {
        
        if (lastTicketFullData == null) {
             
            notify("warning", "እስካሁን ምንም ትኬት አልተሰጠም።");
        } else {
            $.get(requestSite() + 'type=cancel&code=' + lastTicketFullData.code +'&time='+ new Date().getTime(), function(data) {
                if (data.err == "true") {
                   
                    if(data.errText=="logout"){
                          location.replace("./?logout=true");
                          console.log("please logout and sign in again.");
                    }
                    notify("error", data.errText);
                } else if (data.err == "false") {
                    
                    tricket = 0;
                    $("#cancelAndReprintKeno").hide();
                    $("#placeAndClearKeno").hide();
                    zeroTicketDispy();
                    notify("info", "ቲኬቱ በተሳካ ሁኔታ ተሰርዟል!");

                } else {
                    
                    $("#AddToSlipDivLoader").hide();
                    notify("error", "በማይታወቅ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
                }

            }).fail(function() {
                   
                    notify("error", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
            });
        }
    }
}
zeroTicketDispy();

function zeroTicketDispy() {
    lastTicketFullData = null;
    $("#TBSkenoId").html("# -");
    $("#TBSkenoDate").html("-");
    $("#TBSkenoCashier").html("-");
    $("#TBSkenoAgent").html("-");
    $("#TBSkenoWin").html("-");



    $("#TBSkenoSelection").html('<div><b><span>Win(-)</span></b><span  class="floatRight"><B>Br 00.00</b></span></div><div>- --/--/-- --:-- #-</div><div><span  class="floatLeft">-  x00.00</span></div> <br><br>');
    $("#TBSkenoSelection").html(' <div class="ticketWin"><div class="sel">-  x00.00 </div><div class="odd">Br 00.00</div></div>');
    $("#TBSkenoStakeTotal").html("Br " + thousands_separators("-"));
    $("#TBSkenoToWinTotalMin").html("Br " + thousands_separators("-"));
    $("#TBSkenoToWinTotalMax").html("Br " + thousands_separators("-"));

    var codycode = '*123456789*';
    JsBarcode("#TBSkenoBarcode", "123456789", {
        width: 1.2,
        height: 40,
        fontSize: 9,
        textMargin: 0,
        margin: 0,
        text: codycode.split('').join('')
    });

    $("#TBSkenoCompany").html("standard shop terms & condition apply.");
    $("#cancelAndReprintKeno").hide();
    $("#placeAndClearKeno").hide();
}



$('#test-link').click(function(e) {
    e.preventDefault(); 
    
    var userResult = function(result) {
        if (result === 1) {
            location.replace("./?logout=true");
                          console.log("please logout and sign in again.");
        } else {
            //$('#test-text').text('The user did not confirm!');
        }
    }
    
    toggleModal('Are you sure you want to logout?', userResult);
});

function toggleModal(text, callback) {
     
    $wrapper = $('<div id="modal-wrapper"></div>').appendTo('body');
    
    $modal = $('<div id="modal-confirmation"><div id="modal-header"><h3><i class="fa fa-home"></i> Log out</h3><span data-confirm=0 class="modal-action" id="modal-close"><i class="fa fa-times" aria-hidden="true"></i></span></div><div id="modal-content"><p>' + text + '</p></div><div id="modal-buttons"><button class="modal-action" data-confirm=0 id="modal-button-no">No</button><button class="modal-action" data-confirm=1 id="modal-button-yes">Yes</button></div></div>').appendTo($wrapper);
    
    setTimeout(function() {
        $wrapper.addClass('active');
    }, 100);
    
    $wrapper.find('.modal-action').click(function() {
        var result = $(this).data('confirm');
        $wrapper.removeClass('active').delay(500).queue(function() {
           $wrapper.remove();
           callback(result);
        });
    });

}


$("#scanTicketStart").click(function() {

        $("#kkiop12332").val("");
        $('#myModalTicket').show();
        barcode = '';
    
});

function scanthetik(game="keno") {
    $("#kkiop12332").val("");
   $('#myModalTicket').show();
   barcode = '';

   $("#copythetick").removeClass("iamactive");
   $("#scanthetick").addClass("iamactive");
    $("#pleaseScanTickeDiv").show();
    $("#pleaseScanBarCodeSpinnercopy").hide();
    $("#pleaseScanTickeDivcopy").hide();
    $("#copyprinttablediv").hide();

}

var copyTicket221;
function copythetiket(game="keno") {
    $("#copythetick").addClass("iamactive");
    $("#scanthetick").removeClass("iamactive");
   
     $("#pleaseScanTickeDiv").hide();

     $("#pleaseScanBarCodeSpinnercopy").show();
     $("#pleaseScanTickeDivcopy").show();

     $.get(requestSite()+'type=get_ticket_history&time='+ new Date().getTime() , function(data){
        copyTicket221 = data;
        $("#pleaseScanBarCodeSpinnercopy").hide();
        $("#copyprinttablediv").show();
        var copyconcat;
        for(file in data){
            var low_level = String(data[file].code);
            var gamy_id_here = low_level[2].concat(low_level[3]).concat(low_level[4]).concat(low_level[5]);
             if(gamy_id_here < 1361){
                var copyconcat =  copyconcat + '<tr><td data-label="Account">#'+data[file].code+'</td><td data-label="Account">Keno</td><td data-label="Account">#'+data[file].id+'</td><td data-label="Due Date">'+data[file].on+'</td> <td data-label="Amount">Br '+data[file].stake+'</td><td data-label="Period"><i style="font-size: 18px; padding: 0px; color: #ff6a00;" onclick="kenoPrintGodhiicopy('+file+')" class="bi p-1 bi-printer"></i></td></tr>';
            }
            if(gamy_id_here > 1999){
                var copyconcat =  copyconcat + '<tr><td data-label="Account">#'+data[file].code+'</td><td data-label="Account">Spin</td><td data-label="Account">#'+data[file].id+'</td><td data-label="Due Date">'+data[file].on+'</td> <td data-label="Amount">Br '+data[file].stake+'</td><td data-label="Period"><i style="font-size: 18px; padding: 0px; color: #ff6a00;" onclick="spinPrintGodhiicopy('+file+')" class="bi p-1 bi-printer"></i></td></tr>';
            }
        }
        $("#copyprinttable").html(copyconcat);

    }).fail(function() {
        closethetik();
        notify("error", "No internet connection!");
    });
}

function kenoPrintGodhiicopy(params) {
    kenoPrintGodhii(copyTicket221[params] , 'copy');
}
function spinPrintGodhiicopy(params) {
    kenoPrintGodhii(copyTicket221[params],"copy", "spin");
}

function closethetik() {
    $("#kkiop12332").val("");
    $('#myModalTicket').show();
    barcode = '';
    $("#copythetick").removeClass("iamactive");
   $("#scanthetick").addClass("iamactive");

     $("#pleaseScanTickeDiv").show();
     $("#pleaseScanBarCodeSpinnercopy").hide();
     $("#pleaseScanTickeDivcopy").hide();
     $("#copyprinttablediv").hide();
     $('#myModalTicket').toggle();

}



//SPIN JS


for (let index = 0; index < 37; index++) {
   
        $(".SW-"+index).hover(function(){
        $(".SW-DATA-"+index).css("display", "block");
        },
        function(){
            $(".SW-DATA-"+index).css("display", "none");
        
        }); 
}

for (let index = 0; index < 37; index++) {
   
    $(".hov"+index).hover(function(){
        $(".SW-"+index).addClass("selected_spin");
    },
    function(){
        $(".SW-"+index).removeClass("selected_spin");
    
    }); 
}

for (let index = 0; index < 37; index++) {
    $(".SW-"+index+" h3").click(function(){
        spin_select(index);
    }); 
}


$("#second12Nums").hover(function(){
    for (let index = 13; index < 25; index++) {
     
      $(".SW-"+index).addClass("hover");
    }
}, function(){
for (let index = 13; index < 25; index++) {
      $(".SW-"+index).removeClass("hover");
    }
});


$("#third12Nums").hover(function(){
    for (let index = 25; index < 37; index++) {
     
      $(".SW-"+index).addClass("hover");
    }
}, function(){
for (let index = 25; index < 37; index++) {
      $(".SW-"+index).removeClass("hover");
    }
});


$("#first18").hover(function(){
                            
    for (let index = 1; index < 19; index++) {
        
      $(".SW-"+index).addClass("hover");
      
    }
}, function(){
  
for (let index = 1; index < 19; index++) {
 
      $(".SW-"+index).removeClass("hover");
      
    }
});

$("#second18").hover(function(){
                            
    for (let index = 19; index < 37; index++) {
        
      $(".SW-"+index).addClass("hover");
      
    }
}, function(){
  
for (let index = 19; index < 37; index++) {
 
      $(".SW-"+index).removeClass("hover");
      
    }
});


                        
$("#orange").hover(function(){ 
    $(".SW-32").addClass("hover");
    $(".SW-15").addClass("hover");
    $(".SW-19").addClass("hover");
    $(".SW-4").addClass("hover");
    $(".SW-21").addClass("hover");
    $(".SW-2").addClass("hover");

}, function(){
    $(".SW-32").removeClass("hover");
    $(".SW-15").removeClass("hover");
    $(".SW-19").removeClass("hover");
    $(".SW-4").removeClass("hover");
    $(".SW-21").removeClass("hover");
    $(".SW-2").removeClass("hover");

});
$("#blue").hover(function(){ 
    $(".SW-25").addClass("hover");
    $(".SW-17").addClass("hover");
    $(".SW-34").addClass("hover");
    $(".SW-6").addClass("hover");
    $(".SW-27").addClass("hover");
    $(".SW-13").addClass("hover");

}, function(){
$(".SW-25").removeClass("hover");
$(".SW-17").removeClass("hover");
$(".SW-34").removeClass("hover");
$(".SW-6").removeClass("hover");
$(".SW-27").removeClass("hover");
$(".SW-13").removeClass("hover");

});
$("#pink").hover(function(){ 
$(".SW-36").addClass("hover");
$(".SW-11").addClass("hover");
$(".SW-30").addClass("hover");
$(".SW-8").addClass("hover");
$(".SW-23").addClass("hover");
$(".SW-10").addClass("hover");

}, function(){
$(".SW-36").removeClass("hover");
$(".SW-11").removeClass("hover");
$(".SW-30").removeClass("hover");
$(".SW-8").removeClass("hover");
$(".SW-23").removeClass("hover");
$(".SW-10").removeClass("hover");

});
$("#green").hover(function(){ 
    $(".SW-5").addClass("hover");
    $(".SW-24").addClass("hover");
    $(".SW-16").addClass("hover");
    $(".SW-33").addClass("hover");
    $(".SW-1").addClass("hover");
    $(".SW-20").addClass("hover");

}, function(){
$(".SW-5").removeClass("hover");
$(".SW-24").removeClass("hover");
$(".SW-16").removeClass("hover");
$(".SW-33").removeClass("hover");
$(".SW-1").removeClass("hover");
$(".SW-20").removeClass("hover");

});

$("#yellow").hover(function(){ 
    $(".SW-14").addClass("hover");
    $(".SW-31").addClass("hover");
    $(".SW-9").addClass("hover");
    $(".SW-22").addClass("hover");
    $(".SW-18").addClass("hover");
    $(".SW-29").addClass("hover");

}, function(){
$(".SW-14").removeClass("hover");
$(".SW-31").removeClass("hover");
$(".SW-9").removeClass("hover");
$(".SW-22").removeClass("hover");
$(".SW-18").removeClass("hover");
$(".SW-29").removeClass("hover");

});
$("#white").hover(function(){ 
    $(".SW-7").addClass("hover");
    $(".SW-28").addClass("hover");
    $(".SW-12").addClass("hover");
    $(".SW-35").addClass("hover");
    $(".SW-3").addClass("hover");
    $(".SW-26").addClass("hover");

}, function(){
$(".SW-7").removeClass("hover");
$(".SW-28").removeClass("hover");
$(".SW-12").removeClass("hover");
$(".SW-35").removeClass("hover");
$(".SW-3").removeClass("hover");
$(".SW-26").removeClass("hover");

});
$("#twoToOneA").hover(function(){
  for (let index = 1; index < 13; index++) {
      let a = index * 3;
    $(".SW-"+a).addClass("hover");
  }
}, function(){
for (let index = 1; index < 13; index++) {
    let a = index * 3;
    $(".SW-"+a).removeClass("hover");
  }
});
$("#twoToOneB").hover(function(){
let a = 2;
  for (let index = -1; index < 36; index++) {
      
    $(".SW-"+a).addClass("hover");
    a += 3;
  }
}, function(){
let a = 2;
for (let index = 1; index < 13; index++) {

    $(".SW-"+a).removeClass("hover");
    a += 3;
  }
});
$("#twoToOneC").hover(function(){
let a = 1;
  for (let index = -1; index < 36; index++) {
      
    $(".SW-"+a).addClass("hover");
    a += 3;
  }
}, function(){
let a = 1;
for (let index = 1; index < 13; index++) {

    $(".SW-"+a).removeClass("hover");
    a += 3;
  }
});

$(".ColourA").click(function(){
    spin_select([32,15,19,4,21,2], "color");
}); 
$(".ColourB").click(function(){
    spin_select([25,17,34,6,27,13], "color");
});
$(".ColourC").click(function(){
    spin_select([36,11,30,8,23,10], "color");
});
$(".ColourD").click(function(){
    spin_select([5,24,16,33,1,20], "color");
});
$(".ColourE").click(function(){
    spin_select([14,31,9,22,18,29], "color");
});
$(".ColourF").click(function(){
    spin_select([7,28,12,35,3,26], "color");
});

var spin_selected_now = {};

function close_spin_select_bet() {
    $("#spin_select_bet_modal").hide();
    
    $("#ExtraDescriptionWinLen_spin").html("Win");
    $("#ExtraDescriptionOdd_spin").html(0);
    $("#ExtraDescriptionSelection_spin").html("-");
    $("#kenoToWin_spin").html("Br 00.00");
    $("#stakeKenoIn_spin").val(10);
    spin_selected_now = {};
}

function spin_select_bet(input_val) {
    spin_selected_now = input_val;
    $("#spin_select_bet_modal").show();

    $("#ExtraDescriptionWinLen_spin").html(input_val.win_type);
    $("#ExtraDescriptionOdd_spin").html("X"+input_val.odd);
    $("#ExtraDescriptionSelection_spin").html(input_val.val);
    $("#stakeKenoIn_spin").val(10);
    $("#kenoToWin_spin").html("Br "+input_val.win);

    //#ExtraDescriptionWinLen_spin : win[]
    //#ExtraDescriptionOdd_spin odd
    //#ExtraDescriptionSelection_spin :selection
    //#kenoToWin_spin : towin  Br 00.00
    //#

}

function spin_select(val, type="int") {
    
    var arr_in = [];
    arr_in.stake = 10;
    if (type=="int") {
        
        arr_in.val = val;
        arr_in.odd = 36;
        arr_in.win = 360;
        arr_in.win_type = "Win";
        arr_in.kind = "int";
        spin_select_bet(arr_in);
    }
    if (type=="color") {
        
        val.sort(function(a, b){return a - b});
        arr_in.val = val.join("/");
        arr_in.odd = 6;
        arr_in.win = 60;
        arr_in.win_type = "Selector(Colour)";
        arr_in.kind = "selector_colour";
        spin_select_bet(arr_in);
       
    }
    if (type=="dozen") {
        let selection_dozen_spin;
        
        if (val == "first_line") {
            
            arr_in.val = "col3";
            arr_in.odd = 3;
            arr_in.win = 30;
            arr_in.win_type = "Column";
            arr_in.kind = "line";
            spin_select_bet(arr_in);
        }
        if (val == "second_line") {
            
            arr_in.val = "col2";
            arr_in.odd = 3;
            arr_in.win = 30;
            arr_in.win_type = "Column";
            arr_in.kind = "line";
            spin_select_bet(arr_in);
        }
        if (val == "third_line") {
            
            arr_in.val = "col1";
            arr_in.odd = 3;
            arr_in.win = 30;
            arr_in.win_type = "Column";
            arr_in.kind = "line";
            spin_select_bet(arr_in);
        }
        
        if (val == "first_12") {
            
            arr_in.val = "1st 12";
            arr_in.odd = 3;
            arr_in.win = 30;
            arr_in.win_type = "Dozens";
            arr_in.kind = "dozens";
            spin_select_bet(arr_in);
        }
        if (val == "second_12") {
            
            arr_in.val = "2nd 12";
            arr_in.odd = 3;
            arr_in.win = 30;
            arr_in.win_type = "Dozens";
            arr_in.kind = "dozens";
            spin_select_bet(arr_in);
        }
        if (val == "third_12") {
            
            arr_in.val = "3rd 12";
            arr_in.odd = 3;
            arr_in.win = 30;
            arr_in.win_type = "Dozens";
            arr_in.kind = "dozens";
            spin_select_bet(arr_in);
        }
        
        if (val == "first_18") {
            
            arr_in.val = "1-18";
            arr_in.odd = 2;
            arr_in.win = 20;
            arr_in.win_type = "High/Low";
            arr_in.kind = "high_low";
            spin_select_bet(arr_in);
        }
        if (val == "second_18") {
            
            arr_in.val = "19-36";
            arr_in.odd = 2;
            arr_in.win = 20;
            arr_in.win_type = "High/Low";
            arr_in.kind = "high_low";
            spin_select_bet(arr_in);
        }

        if (val == "odd") {
            
            arr_in.val = "Odd";
            arr_in.odd = 2;
            arr_in.win = 20;
            arr_in.win_type = "Odd/Even";
            arr_in.kind = "odd_even";
            spin_select_bet(arr_in);
        }
        if (val == "even") {
            
            arr_in.val = "Even";
            arr_in.odd = 2;
            arr_in.win = 20;
            arr_in.win_type = "Odd/Even";
            arr_in.kind = "odd_even";
            spin_select_bet(arr_in);
        }
        if (val == "red") {
            
            arr_in.val = "red";
            arr_in.odd = 2;
            arr_in.win = 20;
            arr_in.win_type = "Color";
            arr_in.kind = "red_black";
            spin_select_bet(arr_in);
        }
        if (val == "black") {
            
            arr_in.val = "black";
            arr_in.odd = 2;
            arr_in.win = 20;
            arr_in.win_type = "Color";
            arr_in.kind = "red_black";
            spin_select_bet(arr_in);
        }
        //first_line, second_line, third_line
        //first_12, second_12, third_12
        //first_18, second 18
        //odd, even
        //red, black
    }
    
    if (type=="toolpit") {

        
        val.sort(function(a, b){return a - b});
        arr_in.val = val.join("/");
        
        if(val.length == 2){
            arr_in.odd = 18;
            arr_in.win = 180;
            arr_in.win_type = "Split";
        
        } 
        if(val.length == 3){
            arr_in.odd = 12;
            arr_in.win = 120;
            arr_in.win_type = "3 Line";
        }
        if(val.length == 4){
            arr_in.odd = 9;
            arr_in.win = 90;
            arr_in.win_type = "Corner";
        
        }
        if(val.length == 6){
            arr_in.odd = 6;
            arr_in.win = 60;
            arr_in.win_type = "Six";
        }
        
        arr_in.kind = "toolpit";
        spin_select_bet(arr_in);
        
    }

}
function onDenominationClickspin(amount_add_sub) {
    if (spin_selected_now != {}) {
        if($("#stakeKenoIn_spin").val() == 10){
            if(amount_add_sub <= 10){
                spin_selected_now.stake = parseInt(spin_selected_now.stake) + parseInt(amount_add_sub);
                spin_selected_now.win = parseInt(spin_selected_now.stake) * parseInt(spin_selected_now.odd);
            }
            else{
                spin_selected_now.stake =  parseInt(amount_add_sub);
                spin_selected_now.win = parseInt(spin_selected_now.stake) * parseInt(spin_selected_now.odd);
            }
        }
        else{
            spin_selected_now.stake = parseInt(spin_selected_now.stake) + parseInt(amount_add_sub);
            spin_selected_now.win = parseInt(spin_selected_now.stake) * parseInt(spin_selected_now.odd);
        }
        $("#kenoToWin_spin").html(spin_selected_now.win);
        $("#stakeKenoIn_spin").val(spin_selected_now.stake);
        $("#placeSingleKenoBetAmount_spin").html("Br "+ spin_selected_now.stake);
    }
}

var spin_betslip_count = 0;
var spin_bet_slips = {};
var tricket_spin  = 0;


function removeBetFromSlipspin(params) {
    
    $("#kenoPlaceBetAmount_spin").html(parseInt($("#kenoPlaceBetAmount_spin").html()) - parseInt(spin_bet_slips[params]["stake"]));
    spin_betslip_count = parseInt(spin_betslip_count) - 1;
    if (spin_betslip_count == 0) {
        $("#placeAndClearKeno_spin").hide();
        $("#printJsFormKeno_spin").show();

        if (tricket_spin == 1) {
            $("#cancelAndReprintKeno_spin").show();
        }

    }
    spin_bet_slips[params] = "";
    document.getElementById("helloMyBrotherGospin" + params).style.display = "none";
}

function addSingleBetToSlip_spin() {
    hidit("cancelAndReprintKeno_spin");
    hidit("printJsFormKeno_spin");
    visit("placeAndClearKeno_spin");
visit("placeAndClearKeno_spin");
    let spin_selec = spin_selected_now.val;
    if (Array.isArray(spin_selected_now.val)) {
        spin_selec = spin_selected_now.val.join("/");
    }
    $("#kenoPlaceBetAmount_spin").html((parseInt(spin_selected_now.stake) + parseInt($("#kenoPlaceBetAmount_spin").html())));

    

    var helloMyBrother = '<div style="width: 90%;margin:auto;  margin-top: 12px;  " id="helloMyBrotherGospin' + Object.keys(spin_bet_slips).length + '">        <div class="PlacedBet pb-1 ExpandAnimation" style="background-color: rgb(235, 235, 235) !important; ">            <div class="BetDetails">                <div class="SmartPlayKenoIcon">                   <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve" data-svg-id="SpinAndWinSVG" class="icon" alt="SpinAndWin" src="/Content/Images/Icons/SpinAndWinIcon.svg"><g><path d="M24.5,0C11,0.3-0.3,11.4,0,25.7C0.3,39.1,11.4,50.2,25.4,50C39.2,49.7,49.9,38.6,50,25C49.9,10.9,38.4-0.2,24.5,0zM25,45.6C13.6,45.6,4.4,36.4,4.4,25C4.5,13.5,13.7,4.4,25,4.4C36.7,4.4,45.6,14,45.6,25C45.6,36.1,36.6,45.6,25,45.6z"></path><path d="M38.2,25.4c0.2-7.6-5.9-13.5-13.1-13.5c-7.3,0-13.2,5.9-13.2,13.2c0,7.3,5.8,13.1,13.1,13.2C32,38.2,38,32.6,38.2,25.4zM25,33.8c-4.9,0-8.8-3.9-8.8-8.8c0-4.9,3.9-8.8,8.8-8.9c4.8,0,8.8,4,8.8,8.7C33.8,29.9,30,33.8,25,33.8z"></path><path d="M13.8,33.8c-1.4,1.1-2.8,2.2-4.3,3.3c0.7,0.8,1.4,1.5,2.2,2.3c1.3-1.4,2.4-2.7,3.7-4C14.8,34.9,14.3,34.3,13.8,33.8z"></path><path d="M17.2,13.1c-1-1.5-2-3-3-4.5c-0.9,0.7-1.7,1.3-2.5,2c1.3,1.4,2.5,2.7,3.7,4C16,14,16.5,13.6,17.2,13.1z"></path><path d="M13.7,16.3c-1.4-1.1-2.8-2.2-4.3-3.3c-0.6,0.9-1.2,1.8-1.7,2.7c1.6,0.9,3.2,1.7,4.7,2.6C12.9,17.5,13.3,16.9,13.7,16.3z"></path><path d="M21.5,11.2C21,9.4,20.6,7.7,20.1,6c-1,0.3-2,0.7-3,1c0.7,1.7,1.5,3.3,2.2,5C20.1,11.7,20.8,11.4,21.5,11.2z"></path><path d="M11.5,29.7c-1.7,0.6-3.4,1.1-5.1,1.7c0.4,1,0.9,1.9,1.3,2.9c1.6-0.9,3.2-1.7,4.8-2.6C12.1,31.1,11.8,30.4,11.5,29.7z"></path><path d="M14.3,41.5c1,0.5,1.9,1,2.8,1.5c0.7-1.7,1.5-3.3,2.2-4.9c-0.7-0.4-1.4-0.7-2-1.1C16.3,38.4,15.3,39.9,14.3,41.5z"></path><path d="M26.2,39.2c0.1,1.8,0.3,3.5,0.4,5.4c1.1-0.2,2.1-0.4,3.1-0.5c-0.5-1.8-0.9-3.5-1.3-5.2C27.7,39,27,39.1,26.2,39.2z"></path><path d="M37.5,31.7c1.6,0.8,3.1,1.7,4.7,2.6c0.4-1,0.9-1.9,1.3-2.9c-1.7-0.6-3.4-1.2-5.1-1.7C38.1,30.4,37.9,31,37.5,31.7z"></path><path d="M34.6,14.5c1.2-1.3,2.4-2.6,3.7-4c-0.8-0.7-1.7-1.3-2.5-2c-1,1.6-2,3-3,4.5C33.4,13.6,34,14,34.6,14.5z"></path><path d="M37.5,18.2c1.6-0.9,3.1-1.7,4.7-2.6c-0.6-0.9-1.2-1.8-1.8-2.7c-1.5,1.1-2.9,2.2-4.3,3.3C36.7,16.9,37.1,17.5,37.5,18.2z"></path><path d="M34.7,35.5c1.2,1.3,2.4,2.6,3.7,4c0.7-0.8,1.4-1.6,2.2-2.3c-1.5-1.1-2.8-2.2-4.3-3.3C35.7,34.3,35.2,34.9,34.7,35.5z"></path><path d="M30.8,38c0.7,1.6,1.4,3.3,2.2,4.9c1-0.5,1.9-1,2.8-1.5c-1-1.6-2-3-3-4.5C32.1,37.3,31.4,37.7,30.8,38z"></path><path d="M32.9,7c-1-0.4-2-0.7-3-1c-0.4,1.8-0.9,3.5-1.3,5.2c0.8,0.3,1.5,0.5,2.2,0.7C31.4,10.3,32.1,8.7,32.9,7z"></path><path d="M26.1,10.8c0.1-1.8,0.3-3.5,0.4-5.3c-1.1,0-2.1,0-3.2,0c0.1,1.8,0.3,3.6,0.4,5.3C24.6,10.8,25.3,10.8,26.1,10.8z"></path><path d="M39,22.6c1.8-0.3,3.5-0.6,5.3-0.9c-0.3-1-0.5-2-0.8-3.1c-1.8,0.6-3.4,1.2-5.1,1.8C38.7,21.2,38.9,21.9,39,22.6z"></path><path d="M20.2,44c1.1,0.2,2.1,0.3,3.1,0.5c0.2-1.9,0.3-3.6,0.4-5.4c-0.8-0.1-1.5-0.2-2.3-0.4C21.1,40.5,20.7,42.2,20.2,44z"></path><path d="M11.5,20.4c-1.7-0.6-3.4-1.1-5.1-1.7c-0.3,1-0.5,2-0.8,3.1c1.8,0.3,3.6,0.6,5.3,0.9C11.1,21.9,11.3,21.2,11.5,20.4z"></path><path d="M10.7,25.1c-1.8,0-3.6,0-5.4,0c0.1,1.1,0.2,2.1,0.3,3.1c1.8-0.3,3.6-0.6,5.3-0.9C10.8,26.5,10.8,25.8,10.7,25.1z"></path><path d="M39.2,25.1c-0.1,0.8-0.1,1.5-0.2,2.2c1.7,0.3,3.5,0.6,5.3,0.9c0.1-1,0.2-2.1,0.3-3.1C42.8,25.1,41,25.1,39.2,25.1z"></path><path d="M9.7,34.3c0,0.5,0.4,0.9,0.9,0.9c0.5,0,0.9-0.4,0.9-0.9c0-0.5-0.4-0.9-0.9-0.9C10.1,33.4,9.7,33.8,9.7,34.3z"></path><path d="M29.5,25.9c-0.3,0.2-1.7-0.2-1.8-0.4c0-0.1-0.1-0.2,0-0.3c0.1-1.1-0.4-1.9-1.3-2.5c0.1-0.4,0.3-0.7,0.4-1c0.1-0.4,0.3-0.6,0.7-0.7c0.6-0.2,0.9-0.9,0.6-1.6c-0.3-0.6-1-0.9-1.6-0.6c-0.6,0.3-0.9,1-0.6,1.6c0.2,0.4,0.2,0.7,0,1.1c-0.1,0.2-0.2,0.4-0.2,0.6c-0.1,0.3-0.2,0.4-0.5,0.3c-0.8-0.1-1.5,0.2-2,0.8c-0.4,0.5-0.7,0.5-1.1,0.3c-0.1,0-0.2-0.1-0.3-0.1c-0.4-0.1-0.7-0.3-0.8-0.7c-0.2-0.6-1-0.8-1.6-0.6c-0.6,0.3-0.9,1-0.6,1.6c0.3,0.6,1,0.9,1.6,0.6c0.4-0.3,0.7-0.2,1.1,0c0.2,0.1,0.4,0.2,0.6,0.2c0.3,0.1,0.4,0.2,0.3,0.5c-0.1,0.8,0.2,1.6,0.9,2.1c0.4,0.3,0.4,0.6,0.2,1c-0.1,0.1-0.1,0.2-0.1,0.3c-0.1,0.4-0.3,0.7-0.7,0.8c-0.6,0.2-0.8,1-0.6,1.6c0.3,0.6,1,0.9,1.6,0.6c0.6-0.3,0.9-1.1,0.5-1.6c-0.3-0.4-0.2-0.7-0.1-1c0.1-0.2,0.2-0.5,0.3-0.7c0.1-0.3,0.2-0.3,0.5-0.3c0.7,0.1,1.5-0.1,1.9-0.7c0.5-0.6,0.9-0.6,1.5-0.3c0.1,0,0.1,0,0.2,0.1c0.3,0.1,0.5,0.2,0.6,0.6c0.1,0.3,0.4,0.6,0.7,0.7c0.5,0.2,1.1,0,1.4-0.5c0.3-0.5,0.2-1.1-0.2-1.5C30.6,25.6,30,25.6,29.5,25.9zM25,24.1c-0.5,0.1-0.8,0.4-0.9,0.9c0,0.3-0.2,0.5-0.5,0.4c-0.2-0.1-0.4-0.3-0.4-0.5c0-0.8,0.8-1.5,1.7-1.5c0.1,0.1,0.3,0.2,0.3,0.3C25.4,23.8,25.1,24.1,25,24.1z"></path></g></svg>              </div>                <h3 style="padding: 5px; font-size: 16px; font-weght: bold">                   <strong>' + spin_selected_now.win_type + '</strong>                </h3>                <h3 style="padding: 5px; font-size: 12px;"><span class="ExtraDescription"> ' + spin_selec + ' </span>                    <span class="Bet nohover">' + spin_selected_now.odd + '</span></h3>            </div>                      <div class="ToWinAmount"> <span style="margin-right:20px">Stake: <b> <span>Br ' + thousands_separators(spin_selected_now.stake) + '</span></b></span><span> To Win:<b> <span>Br ' + thousands_separators(spin_selected_now.odd * spin_selected_now.stake) + '</span><b/></span></div><div class="Remove" onclick="removeBetFromSlipspin(' + Object.keys(spin_bet_slips).length + ');">                <i class="bi bi-x-lg"></i>            </div>        </div>    </div>';

    $("#helloMyBrother_spin").prepend(helloMyBrother);
    $("#helloMyBrother_spin").show();
    spin_bet_slips[Object.keys(spin_bet_slips).length] = {...spin_selected_now};
    spin_selected_now = {};
    spin_betslip_count = spin_betslip_count+1;
    close_spin_select_bet();
}


function clearKenoThingsMaster_spin() {


    $("#kenoPlaceBetAmount_spin").html(0);
    spin_betslip_count = 0;
    //spin_selected_now = {};
    spin_bet_slips={};
        $("#placeAndClearKeno_spin").hide();
        $("#printJsFormKeno_spin").show();
        $("#helloMyBrother_spin").html("");

        if (tricket_spin == 1) {
            $("#cancelAndReprintKeno_spin").show();
        }
}
var lastTicketFullData_spin = null;
var lastTicketFullDataType_spin = null;

function kenoBetGodhii_spin(spec="single") {
    var userdata = {};
    var thespinreq = "";
    if(spec == "single"){
       
        userdata = {...spin_selected_now};
        thespinreq = requestSite("spin") + 'type=spin_bet&timeunix='+new Date().getTime()+"&data=["+JSON.stringify(userdata) +"]";
        $("#kenoTicketLoader_spin_single").show();

    }

    if(spec == "multiple"){
        userdata = spin_bet_slips;
         thespinreq = requestSite("spin") + 'type=spin_bet&timeunix='+new Date().getTime()+"&data="+JSON.stringify(userdata);
         $("#kenoTicketLoader_spin").show();
    }
            //cancel
    $.get(thespinreq, function(data) {
        if (data.err == "true") {
            if(data.errText=="logout"){
                    location.replace("./?logout=true");
                    console.log("please logout and sign in again.");
            }
             else{
                notify("warning", data.errText); 
                $("#kenoTicketLoader_spin_single").hide();
                 $("#kenoTicketLoader_spin").hide();
            }
            
        } else if (data.err == "false") {
            tricket_spin = 1;
            if(spec == "single"){
                $("#kenoTicketLoader_spin_single").hide();
                spin_selected_now = {};

                notify("success", "Bet placed successfuly!");
                kenoPrintGodhii(data,"normal", "spin");

                lastTicketFullData_spin = data;
                lastTicketFullDataType_spin = 'single';
                spinTicketDisplay(data, 'single');

               
                    $("#helloMyBrother_spin").hide();
                    $("#placeAndClearKeno_spin").hide();
                    visit("printJsFormKeno_spin");
                    visit("cancelAndReprintKeno_spin");

                

                    var spin_betslip_count = 0;
                    var spin_bet_slips = {};
                close_spin_select_bet();
            }

                if(spec == "multiple"){
                    $("#kenoTicketLoader_spin").hide();
                    
                    notify("success", "Bet placed successfuly!");
                    clearKenoThingsMaster_spin();
                    kenoPrintGodhii(data,"normal", "spin");
                    lastTicketFullData_spin = data;
                    lastTicketFullDataType_spin = 'multiple';
                    spinTicketDisplay(data, 'multiple');

                    if (spin_betslip_count > 0) {
                        $("#helloMyBrother_spin").hide();
                        $("#placeAndClearKeno_spin").hide();
                        visit("printJsFormKeno_spin");
                        visit("cancelAndReprintKeno_spin");
    
                    setTimeout(() => {
                        $("#helloMyBrother_spin").show();
                        $("#placeAndClearKeno_spin").show();
                        hidit("printJsFormKeno_spin");
                        hidit("cancelAndReprintKeno_spin");
                        }, 2000);
    
                    } 
                    else {
                        visit("cancelAndReprintKeno_spin");
                    }

                }
            } 
            else {
                $("#kenoTicketLoader_spin").hide();
            $("#kenoTicketLoader_spin_single").hide();
            notify("warning", "INTERNAL ERROR!");
        }
    }).fail(function() {
        $("#kenoTicketLoader_spin_single").hide();
        $("#kenoTicketLoader_spin").hide();
        notify("warning", "ERROR! INTERNET CONNECTION");
    });
}

function spinTicketDisplay(input, typrman = "single") {
    if (typrman== "single") {
        
    if (true) {
        $("#TBSkenoId_spin").html("# " + input.id);
        $("#TBSkenoDate_spin").html(input.on);
        $("#TBSkenoCashier_spin").html(input.by);
        $("#TBSkenoAgent_spin").html(input.agent);
        var asfMain = "";
        for (let index = 0; index < input.user.length; index++) {
            const element = input.user[index];
            var valyval = element.val;

            if(Array.isArray(valyval)){
                valyval = element.val.join("/");
            }
            var asf = ' <div class="ticketWin"><div class="sel">' + valyval + ' x' + element.odd + '</div><div class="odd">Br ' + element.stake + '</div></div>';
            asfMain += asf;
        }

        $("#TBSkenoSelection_spin").html(asfMain + '<br><div class="ticketWin"><div class="sel">Total Stake</div><div class="odd"><b>Br ' + input.TotalStake + '</b></div></div>');
        $("#TBSkenoToWinTotalMin_spin").html("Br " + thousands_separators(input.toWinMin));
        $("#TBSkenoToWinTotalMax_spin").html("Br " + thousands_separators(input.toWinMax));

        var codycode = '*' + input.code + '*';
        JsBarcode("#TBSkenoBarcode_spin", input.code, {
            width: 1.2,
            height: 40,
            fontSize: 9,
            textMargin: 0,
            margin: 0,
            text: codycode.split('').join('')
        });

        $("#TBSkenoCompany_spin").html(input.company + " standard shop terms & condition apply.");
    }
    }
    else{
        $("#TBSkenoId_spin").html("# " + input.id);
        $("#TBSkenoDate_spin").html(input.on);
        $("#TBSkenoCashier_spin").html(input.by);
        $("#TBSkenoAgent_spin").html(input.agent);
        var asfMain = "";
        for (let index = 0; index < input.user.length; index++) {
            const element = input.user[index];
            var valyval = element.val;

            if(Array.isArray(valyval)){
                valyval = element.val.join("/");
            }
            var asf = ' <div class="ticketWin"><div class="sel">' + valyval + ' x' + element.odd + '</div><div class="odd">Br ' + element.stake + '</div></div>';
            asfMain += asf;
        }

        $("#TBSkenoSelection_spin").html(asfMain + '<br><div class="ticketWin"><div class="sel">Total Stake</div><div class="odd"><b>Br ' + input.TotalStake + '</b></div></div>');
        $("#TBSkenoToWinTotalMin_spin").html("Br " + thousands_separators(input.toWinMin));
        $("#TBSkenoToWinTotalMax_spin").html("Br " + thousands_separators(input.toWinMax));

        var codycode = '*' + input.code + '*';
        JsBarcode("#TBSkenoBarcode_spin", input.code, {
            width: 1.2,
            height: 40,
            fontSize: 9,
            textMargin: 0,
            margin: 0,
            text: codycode.split('').join('')
        });

        $("#TBSkenoCompany_spin").html(input.company + " standard shop terms & condition apply.");
    }
}

function spin_cancel() {
    let text = "እርግጠኛ ነዎት ይህን ቲኬት መሰረዝ ይፈልጋሉ?";
    if (confirm(text) == true) {
        $.get(requestSite("spin")+'type=cancel&timeunix='+new Date().getTime() + '&code='+lastTicketFullData_spin.code, function(data){
            if(data.err=="false"){
                notify("info", "ቲኬቱ በተሳካ ሁኔታ ተሰርዟል!")
            }
            else{
                tricket = 0;
                $("#cancelAndReprintKeno").hide();
                $("#placeAndClearKeno").hide();
                zeroTicketDispy();
                notify("warning", data.errText);
            }
        }).fail(function() {
            notify("error", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
        });
    } else {
      text = "You canceled!";
    }
}

function keno_cancel() {
    let text = "እርግጠኛ ነዎት ይህን ቲኬት መሰረዝ ይፈልጋሉ?";
    if (confirm(text) == true) {
        cancelTicket("keno");
    } else {
      text = "You canceled!";
    }
}