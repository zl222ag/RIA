define(["backbone"],function(e){return e.Model.extend({text:"The Insert Text Game!",words:null,keyPress:function(e){return function(t){!t.ctrlKey&&/^[A-Z']$/i.test(String.fromCharCode(t.charCode))&&e(String.fromCharCode(t.charCode).toLowerCase())}},getWordList:function(e){var t=this;$.ajax({url:"wordlist."+(typeof e!="string"?"en":e)+".txt",dataType:"text",contentType:"text/plain; charset=utf-8",success:function(e){t.words=e.trimLeft().trimRight().split(/\n+/)},error:function(){e===null?alert("Couldn't load the wordlist =(."):t.getWordList()}})},initialize:function(){var e=navigator.language||navigator.userLanguage,t=e.indexOf("-");t>0&&(e=e.substr(0,t)),this.getWordList(e)}})});