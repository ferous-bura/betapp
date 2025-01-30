JsBarcode("#TBSkenoBarcode", "123456789", {
                width: 1.5,
                height:40,
                fontSize:13,
                textMargin:1,
                margin:0,
                text: "123456789".split('').join(' ')
            });
JsBarcode("#TBSkenoBarcode_spin", "123456789", {
      width: 1.5,
      height:40,
      fontSize:13,
      textMargin:1,
      margin:0,
      text: "123456789".split('').join(' ')
  });
var switchButton = document.querySelector(".switch-button");
var switchBtnRight = document.querySelector(".switch-button-case.right");
var switchBtnLeft = document.querySelector(".switch-button-case.left");
var activeSwitch = document.querySelector(".active");

function switchLeft() {
switchBtnRight.classList.remove("active-case");
switchBtnLeft.classList.add("active-case");
activeSwitch.style.left = "0%";
}

function switchRight() {
switchBtnRight.classList.add("active-case");
switchBtnLeft.classList.remove("active-case");
activeSwitch.style.left = "50%";
}

switchBtnLeft.addEventListener(
"click",
function () {
  switchLeft();
},
false
);

switchBtnRight.addEventListener(
"click",
function () {
  switchRight();
},
false
);

function notify(type, content) {
  $("#notify_" + type + "_text").html(content);
  $("#notify_" + type).show();
  setTimeout(() => {
      $("#notify_" + type).hide();
  }, 4000);
}


function handleBarcodehelperv1(scanned_barcode) {
  if(Number.isInteger(parseInt(scanned_barcode))==true && scanned_barcode.length >= 5){
      handleBarcodev1(scanned_barcode);
  }

  else{
      document.getElementById("kkiop12332").style.backgroundColor = "red";
      setTimeout(() => {
          document.getElementById("kkiop12332").style.backgroundColor = "white";
      }, 200);
      $("#kkiop12332").val("");

  }
}


function handleBarcodev1(scanned_barcode) {
  $("#pleaseScanBarCode").hide();
  $("#pleaseScanBarCodeSpinner").show();
  var requestData = {
    csrfmiddlewaretoken: '{{ csrf_token }}',
    action: 'scanned_barcode',
    game_id: "game_id",
    time: "time",
    cashier_name: "cashier_name"
};

  $.ajax({
      url: "{% url 'cashierapp:cashier_url' %}",
      method: 'POST',
      data: JSON.stringify(requestData),
      contentType: 'application/json',
      success: function(data) {
          if (data.err === "true") {
            console.log('------barcode init4');
              if (data.errText === "logout") {
                  location.replace("./?logout=true");
                  console.log("Please logout and sign in again.");
              }
              notify("warning", data.errText);
          } else {
              if (data.status === "active") {  
                console.log('------barcode init5');

                  payInfo = data;

                  $("#pleaseScanTickeDiv").hide();

                  $("#scanedTicketStatus").removeClass("modal-titli").addClass("modal-title");
                  $("#scanedTicketStatus").html("ACTIVE TICKET");
                  $("#scanedCodeStake").html(payInfo.user.stake);

                  $("#scanedCodeCancelDeem").removeClass("btn-successi").addClass("btn-danger");
                  $("#scanedCodeCancelDeem").html(" <span id='spinner-border-sm-redeem-cancel' style='display:none' class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Cancel ticket");
                  $("#scanedCodePrintLater").html("Re-print");
                  $("#endalebeqaId").show();

              } else if (data.status === "redeem") {
                  payInfo = data;
                  $("#pleaseScanTickeDiv").hide();

                  $("#scanedTicketStatus").removeClass("modal-title").addClass("modal-titli");
                  $("#scanedTicketStatus").html("WON " + thousands_separators(data.won) + "Br");
                  $("#scanedCodeStake").html(payInfo.user.stake);

                  $("#scanedCodeCancelDeem").removeClass("btn-danger").addClass("btn-successi");
                  $("#scanedCodeCancelDeem").html(" <span id='spinner-border-sm-redeem-cancel' style='display:none' class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Redeem ticket");
                  $("#scanedCodePrintLater").html("Pay-later");
                  $("#endalebeqaId").show();

              } else if (data.status === "redeemed") {
                  $('#myModalTicket').hide();
                  var message = data.type === "now" ? "በዚህ የቲኬት ቁጥር " + thousands_separators(data.amount) + "ብር በቀን " + data.on + " በ " + data.by + " ተቀናሽ ተደርግዋል።." : "በዚህ የቲኬት ቁጥር " + thousands_separators(data.amount) + "ብር በቀን " + data.on + " በ " + data.by + " ተቀናሽ ተደርግዋል።.";
                  notify(data.type === "now" ? "success" : "warning", message);

              } else if (data.status === "canceled") {
                  $('#myModalTicket').hide();
                  notify("warning", "ቲኬቱ በተሳካ ሁኔታ ተሰርዝዋል።");

              } else if (data.status === "unknown") {
                  $('#myModalTicket').hide();
                  notify("warning", "ያልታወቀ የቲኬት ቁጥር። እባክዎ ቲኬቱን እንደገና scan ያድርጉ።");
              }
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          $('#myModalTicket').hide();
          notify("error", "በኔቶርክ መቆራረጥ ምክኒያት መረጃውን ማግኘት አልተቻለም።");
          console.error(textStatus, errorThrown);
      },
      complete: function() {
        // This will be executed regardless of success or error
        $("#pleaseScanBarCode").show();
        $("#pleaseScanBarCodeSpinner").hide();
    }
  });
}


{/* <button id="cancelTicketButton" 
        data-game-id="123" 
        data-cashier-name="John Doe">Cancel Ticket</button> */}

  $(document).ready(function() {
      $('#cancelTicketButton').click(function() {
          var game_id = $(this).data('game-id');
          var time = new Date().getTime();
          var cashier_name = $(this).data('cashier-name');

          var requestData = {
              csrfmiddlewaretoken: '{{ csrf_token }}',
              action: 'cancel_ticket',
              game_id: game_id,
              time: time,
              cashier_name: cashier_name
          };

          $.ajax({
              url: "{% url 'cashierapp:cashier_url' %}",
              method: 'POST',
              data: JSON.stringify(requestData),
              contentType: 'application/json',
              success: function(data) {
                  console.log("Ticket canceled successfully");
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  console.error("Error canceling ticket:", errorThrown);
              }
          });
      });
  });
