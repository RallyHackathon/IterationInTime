Ext.define('ScopeChange', {
    extend: 'Rally.app.App',
    layout: { type: 'vbox', align: 'stretch' },
    appName:'ScopeChanges',
    componentCls: 'app',

    launch:function () {
        var messageBus = Rally.environment.getMessageBus();
        messageBus.addEvents('scopechanged');
        this.add(Ext.create('Ext.Container', {
            id:'content',
            items:[
                {
                    id:'releaseInput',
                    xtype:'rallyreleasecombobox'
                },
                {
                    id:'rangeStartInput',
                    xtype:'datepicker'
                },
                {
                    id:'iterationInput',
                    xtype:'rallyiterationcombobox'
                },
                {
                    xtype:'rallybutton',
                    text:'update',
                    handler:this.update,
                    scope:this
                }
            ]
        }));
        messageBus.addListener('scopechanged', this.scopeChangeHandler, this);
    },

//    installComponents: function(model) {
//        this.model = model;
//        this.grid = this.add({
//            xtype: 'rallygrid',
//            model: this.model,
//            columnCfgs: [
//                'FormattedID',
//                'Name',
//                'Owner',
//                'ScheduleState'
//            ]
//        });
//    },

    update:function () {
        var content = this.down('#content');
        var release = content.down('#releaseInput').getValue();
        var start = content.down('#rangeStartInput').getValue();
        var iteration = content.down('#iterationInput').getValue();
        var messageBus = Rally.environment.getMessageBus();
        console.log(iteration);
        console.log(release);
        messageBus.fireEvent('scopechanged', {
            release:release,
            start:start,
            iteration:iteration
        });
    },

    scopeChangeHandler:function (event) {
       var start = event.start;
       var iteration = event.iteration;
       this.findArtifactsOpenAtTime(start);
       //install callback to create a filter function from results
       // apply function to grid contents

    },

    findArtifactsOpenAtTime: function(startDate){
        console.log("creating store");
        this.AAAAAA = "temp";
        console.log(this);
        this.transformStore = Ext.create('Rally.data.lookback.SnapshotStore', {
            context: {
                workspace: this.context.getWorkspace(),
                project: this.context.getProject(),
                projectScopeUp: false,
                projectScopeDown: true
            },
            filters:[
                {
                    property:"__At",
                    value: startDate
                },
//                {property:"Iteration",
//                //operator: 'contains',
//                value: "209" },
                {property:"_ProjectHierarchy",
                value: this.context.getProject().ObjectID},
                {property:"_TypeHierarchy",
                operator:'in',
                value:[-51038]},
                {property:"ScheduleState",
                operator:'<',
                value:"Accepted"}
            ],
            fetch:['ObjectID','Name'],
            listeners:{
                load:this.reloadGrid,
                scope:this
            },            
            autoLoad:true
        }); 
        console.log(this.transformStore);
    },
    
    reloadGrid: function(store, records) {
        if (this.grid) {
            this.grid.destroy();
        }
        console.log("Store is loaded");
        this.grid = this.add({
            xtype: 'rallygrid',
//            model: this.model,
            store: this.transformStore,
            columnCfgs: [
                {text:'ObjectID',
                dataIndex:'ObjectID'
                },
                {text:'Name',
                dataIndex:'Name'    
                    }
            ]
        });  
    }

});