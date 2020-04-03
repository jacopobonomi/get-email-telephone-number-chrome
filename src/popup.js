const regexsTelphoneNumber = [
  "^tel:"
]

const regexsEmail = [
  "^mailto:"
]

//Inizialization of variable string in browser. Check for many calls
chrome.tabs.executeScript(null, {
  code: "if(typeof string !== undefined){let string=''} "
}, null);

function printResults(printable,hiddenType) {
  let liList;
  (printable.length > 0) ? (printable.forEach(printableItem => {
    liList = "<p style='font-weight:bold'>-" + printableItem + "</p>" + (liList ? liList : "");
  })) : "";
  (printable.length > 0) ?
    document.querySelector("#result").innerHTML = "<p>Result:" + liList + "</p>"
    : document.querySelector("#result").innerHTML = "<p>I <b style='color:#57aae7'>haven't</b> found anything. Try another page! 🧐</p>";
    document.querySelector("#result").classList="div-result";
    document.querySelector("#button-copy").classList="";
    (hiddenType==1)?document.querySelector("#button-telephone").classList="hidden":document.querySelector("#button-email").classList="hidden";

  return;
}

//Test numbers with regex for telephone number. 
function showNumbers(results) {
  if (!results) { return; }
  const hrefs = results.toString().split(",");
  let telephoneNumbers = [];
  let regexTelTag = new RegExp(regexsTelphoneNumber[0]);
  hrefs.forEach(href => {
    if (regexTelTag.test(href)) {
      if (!telephoneNumbers.includes(href.substring(4))) {
        telephoneNumbers.push(href.substring(4));
      }
    }
  });
  printResults(telephoneNumbers,1);
  return;
}

//Test numbers with regex for telephone number. 
function showEmails(results) {
  if (!results) { return; }
  const hrefs = results.toString().split(",");
  let telephoneNumbers = [];
  let regexTelTag = new RegExp(regexsEmail[0]);
  hrefs.forEach(href => {
    if (regexTelTag.test(href)) {
      if (!telephoneNumbers.includes(href.substring(7))) {
        telephoneNumbers.push(href.substring(7));
      }
    }
  });
  printResults(telephoneNumbers,0);
  return;
}

//Execute code in tab to get all tag <a> and get href.
function getHrefs(type) {
  chrome.tabs.executeScript(null, {
    code: "string=''; var urls = document.getElementsByTagName('a');for(let i=0;i<urls.length;i++){string=string+urls[i].href+','}; string"
  },
    function (results) {
      (type!=1)?document.querySelector("#button-telephone").classList="":document.querySelector("#button-email").classList="";
      ((type == 1) ? showNumbers(results) : showEmails(results));
    });
}

//Copy to Clipboard
function copyToClipboard() {
  let inp = document.createElement('input');
  document.body.appendChild(inp);
  let value =document.querySelector("#result").innerText;
  inp.value = value.split("-");
  inp.select();
  document.execCommand('copy', false);
  inp.remove();
}

//Event Listener
document.getElementById("button-telephone").addEventListener("click", function () {
  getHrefs(1);
})

document.getElementById("button-email").addEventListener("click", function () {
  getHrefs(0);
})

document.getElementById("button-copy").addEventListener("click", function () {
  copyToClipboard();
})

