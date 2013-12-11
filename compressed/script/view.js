define(["backbone","jade"],function(e,t){return e.View.extend({WORD_CONTAINER_TAG_FORMAT:"div.text-center",CLEARED_WORD_TAG_FORMAT:"span.cleared",WORD_TAG_FORMAT:"span",INPUT_WORD_TAG_FORMAT:'input(type="text", maxlength=1)#inputword.text-center',HEADER_TAG_FORMAT:"h1.text-container.text-center #{text}",CONTAINER_TAG_FORMAT:"div.container",el:"body",clearedWordTag:null,wordTag:null,inputWordTag:null,getHeaderText:function(){return this.model.get("HEADER_TEXT")},OnKeyPress:function(e){var t=null,n=0;e.preventDefault();if(e.ctrlKey||e.charCode<32)return;this.model.guessChar(String.fromCharCode(e.charCode).toLowerCase())&&(n=this.model.get("currentLetterId"),t=this.model.getCurrentWord(),this.clearedWordTag.text(t.substr(0,n)),this.wordTag.text(t.substr(n)))},onChangeWord:function(){this.clearedWordTag.text(""),this.wordTag.text(this.model.getCurrentWord())},events:{"keypress input#inputword":"OnKeyPress"},initialize:function(){this.listenTo(this.model,"change:wordId",this.onChangeWord),_.bind(this.OnKeyPress,this),this.model.getWordList()},render:function(){var e=null,n=null,r=null,i=null,s=null,o=null,u=null,a=null;document.title=this.getHeaderText(),e=t.compile(this.CONTAINER_TAG_FORMAT),n=t.compile(this.HEADER_TAG_FORMAT),r=t.compile(this.WORD_CONTAINER_TAG_FORMAT),i=t.compile(this.CLEARED_WORD_TAG_FORMAT),s=t.compile(this.WORD_TAG_FORMAT),o=t.compile(this.INPUT_WORD_TAG_FORMAT),u=$(e()),a=$(r()),this.clearedWordTag=$(i()),this.wordTag=$(s()),this.inputWordTag=$(o()),u.append(n({text:this.getHeaderText()})),a.append(this.clearedWordTag),a.append(this.wordTag),u.append(a),u.append(this.inputWordTag),this.$el.append(u)}})});