/**
 * Created by lakshya on 5/19/18.
 */
const array = new Array();
var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
function addList() {


    var url = document.getElementById("url").value;
    var http = /^https?:\/\//i;
    if (!http.test(url)) {
        url = 'http://' + url;
    }
    console.log(url);
    if(pattern.test(url)) {
        if(!array.includes(url)) {
            array.push(url);
            var list = document.getElementById("url-list");
            list.innerHTML += "<li>" + url + "</li>";
            document.getElementById("url").value="";
        }
        else{
            showError("URL ALREADY IN THE LIST!");
            setTimeout(hideError, 2000);
        }
    }
    else{
        console.log("Invalid url");
        showError("Invalid URL");
        setTimeout(hideError, 2000);
    }
}


function showError(error) {
    var notification = document.getElementById("notification ");
    notification.innerHTML=error;
    notification.style.visibility = "visible";
}
function hideError() {
    var notification = document.getElementById("notification ");
    notification.style.visibility = "hidden";
}
function sendUrls() {
    var url = document.getElementById("url").value;
    document.getElementById("url").value="";
    var list = document.getElementById("url-list").innerHTML = "";


    var http = /^https?:\/\//i;
    if (!http.test(url)) {
        url = 'http://' + url;
    }
    console.log(url);
    if(pattern.test(url)) {
        if (!array.includes(url)) {
            array.push(url);
            //Send the array

        }
    }
    if(!array.isEmpty){
        $.post("/shorten",
            {
                urls:JSON.stringify(array)
            },
            function(data, status){
                location.reload();
                alert("Data: " + data + "\nStatus: " + status);
            });
    }

}