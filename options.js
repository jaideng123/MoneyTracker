// Saves options to chrome.storage
//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 1000;  //time in ms, 5 second for example
var $input = $('#CID');

//on keyup, start the countdown
$input.on('keyup', function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown 
$input.on('keydown', function () {
  clearTimeout(typingTimer);
});
function getUrl(reqURL, callback) {
var xhr = new XMLHttpRequest();
xhr.open("GET", reqURL, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    callback(xhr.responseText);
  }
}
xhr.send();}

//user is "finished typing," do something
function doneTyping () {
  var customerID = document.getElementById('CID').value;
  if(customerID.length == 24){
    var url = 'http://api.reimaginebanking.com/customers/'+customerID+'/accounts?key=aaf37afb12d98c6d8610edfde329b8f0'
      getUrl(url,function(res){
        var accounts = JSON.parse(res)
        fillAccountOptions(accounts)
      })
  }
  else{
    $('#acct-selection').css('display','none')
  }
}
function save_options() {
  var customerID = document.getElementById('CID').value;
  var index = Number($("input[type='radio'][name='accounts']:checked").val())
  var accountID = $('#acct'+index+' .num').html()
  chrome.storage.sync.set({
    CID: customerID,
    AID: accountID,
    i: index
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}
var $radios = $('input:radio');

$radios.change(function () {
    $radios.parent().removeClass('checked');
    $(this).parent().addClass('checked');
});
$(".account").click(function() {
    $radios.parent().removeClass('checked');
    $(this).addClass('checked');
    $(this).find('input:radio').prop('checked', true);
});
function fillAccountOptions(accounts){
  for (var i = 9; i >= 0; i--) {
    $('#acct'+i).css('display','none')
  };
  $('#acct-selection').css('display','block')
  for (var i = accounts.length - 1; i >= 0; i--) {
    $('#acct'+i+' .name').html(accounts[i].nickname)
    $('#acct'+i+' .num').html(accounts[i]._id)
    $('#acct'+i+' .bal').html(accounts[i].balance)
    $('#acct'+i).css('display','block')
  };
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    CID: '',
    AID: '',
    i: '0'
  }, function(items) {
    document.getElementById('CID').value = items.CID;
    $($("input[type='radio'][name='accounts']")[items.i]).prop("checked", true)
    $($("input[type='radio'][name='accounts']")[items.i]).parent().addClass("checked")
    if(items.CID.length == 24){
    var url = 'http://api.reimaginebanking.com/customers/'+items.CID+'/accounts?key=aaf37afb12d98c6d8610edfde329b8f0'
      getUrl(url,function(res){
        var accounts = JSON.parse(res)
        fillAccountOptions(accounts)
      })
  }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);