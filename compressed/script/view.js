define(["backbone","jade"],function(e,t){return e.View.extend({WORD_CONTAINER_TAG_FORMAT:"div.text-center",CLEARED_WORD_TAG_FORMAT:"span.cleared",WORD_TAG_FORMAT:"span",INPUT_WORD_TAG_FORMAT:'input(type="text", maxlength=1).text-center',HEADER_TAG_FORMAT:"h1.text-container.text-center #{text}",CONTAINER_TAG_FORMAT:"div.container",el:"body",clearedWordTag:null,wordTag:null,inputWordTag:null,getHeaderText:function(){return this.model.get("HEADER_TEXT")},keyPress:function(){var e=this,t=null,n=0;return function(r){r.preventDefault();if(r.ctrlKey||r.charCode<32)return;e.model.guessChar(String.fromCharCode(r.charCode).toLowerCase())&&(n=e.model.get("currentLetterId"),t=e.model.getCurrentWord(),e.clearedWordTag.text(t.substr(0,n)),e.wordTag.text(t.substr(n)))}},onChangeWord:function(){var e=this;return function(){e.clearedWordTag.text(""),e.wordTag.text(e.model.getCurrentWord())}},events:{bacon:"change"},initialize:function(){var e=null,n=null,r=null,i=null,s=null,o=null,u=null,a=null;e=t.compile(this.CONTAINER_TAG_FORMAT),n=t.compile(this.HEADER_TAG_FORMAT),r=t.compile(this.WORD_CONTAINER_TAG_FORMAT),i=t.compile(this.CLEARED_WORD_TAG_FORMAT),s=t.compile(this.WORD_TAG_FORMAT),o=t.compile(this.INPUT_WORD_TAG_FORMAT),this.model.on("change:wordId",this.onChangeWord()),u=$(e()),a=$(r()),this.clearedWordTag=$(i()),this.wordTag=$(s()),this.inputWordTag=$(o()),u.append(n({text:this.getHeaderText()})),a.append(this.clearedWordTag),a.append(this.wordTag),u.append(a),u.append(this.inputWordTag),$(this.el).append(u),$(this.inputWordTag).keypress(this.keyPress()),this.model.getWordList()},render:function(){}})});