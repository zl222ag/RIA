define(["backbone","script/app/gameview.js","script/app/gamemodel.js"],function(e,t,n){return e.Router.extend({gameView:null,gameModel:null,routes:{"":"index","play/:text":"play","*invalid":"invalid"},index:function(){this.gameView.render(),this.gameModel.getWordList()},play:function(e){this.gameModel.set("mode",e,{validate:!0}),this.gameView.render(),this.gameModel.getWordList()},invalid:function(){this.navigate("/",{trigger:!0})},initialize:function(){this.gameModel=new n({router:this}),this.gameView=new t({model:this.gameModel}),this.listenTo(this.gameModel,"invalid",function(){alert("error")}),e.history.start()}})});