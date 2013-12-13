define(["backbone","jade"],function(e,t){return e.View.extend({WORD_CONTAINER_TAG_FORMAT:"div.text-center",CLEARED_WORD_TAG_FORMAT:"span.cleared",WORD_TAG_FORMAT:"span",INPUT_WORD_TAG_FORMAT:'input(type="text", maxlength=1)#inputword.text-center',HEADER_TAG_FORMAT:"h1.text-container.text-center #{text}",CONTAINER_TAG_FORMAT:"div.container",SCORE_TAG_FORMAT:"p.score 0",el:"body",clearedWordTag:null,wordTag:null,inputWordTag:null,scoreTag:null,getHeaderText:function(){return this.model.get("HEADER_TEXT")},onKeyPress:function(e){var t=null,n=0;e.preventDefault();if(e.ctrlKey||e.charCode<32)return;this.model.guessChar(String.fromCharCode(e.charCode).toLowerCase())&&(n=this.model.get("currentLetterId"),t=this.model.getCurrentWord(),this.clearedWordTag.text(t.substr(0,n)),this.wordTag.text(t.substr(n)))},onChangeWord:function(){this.clearedWordTag.text(""),this.wordTag.text(this.model.getCurrentWord())},events:{"keypress input#inputword":"onKeyPress"},initialize:function(){this.listenTo(this.model,"change:wordId",this.onChangeWord),_.bind(this.onKeyPress,this)},render:function(){var e=null,n=null,r=null,i=null,s=null,o=null,u=null,a=null,f=null;document.title=this.getHeaderText(),e=t.compile(this.CONTAINER_TAG_FORMAT),n=t.compile(this.HEADER_TAG_FORMAT),r=t.compile(this.WORD_CONTAINER_TAG_FORMAT),i=t.compile(this.CLEARED_WORD_TAG_FORMAT),s=t.compile(this.WORD_TAG_FORMAT),o=t.compile(this.INPUT_WORD_TAG_FORMAT),u=t.compile(this.SCORE_TAG_FORMAT),a=$(e()),f=$(r()),this.clearedWordTag=$(i()),this.wordTag=$(s()),this.inputWordTag=$(o()),this.scoreTag=$(u()),a.append(n({text:this.getHeaderText()})),f.append(this.clearedWordTag),f.append(this.wordTag),a.append(f),a.append(this.inputWordTag),a.append(this.scoreTag),this.$el.append(a)}})});