Ext.define('ScopeChange', {
    extend: 'Rally.app.App',
    layout: { type: 'vbox', align: 'stretch' },
    appName:'ScopeChanges',
    componentCls: 'app',

    launch:function () {
//        var messageBus = Rally.environment.getContext().getMessageBus();
        var messageBus = Rally.environment.getMessageBus();
        messageBus.addEvents('scopechanged');
        Rally.data.ModelFactory.getModel({
            type: 'UserStory',
            success: this.installComponents,
            scope: this
        });
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
                    id:'rangeEndInput',
                    xtype:'datepicker'
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

    installComponents: function(model) {
        this.grid = this.add({
            xtype: 'rallygrid',
            model: model,
            columnCfgs: [
                'FormattedID',
                'Name',
                'Owner'
            ],
            listeners: {
                load:Ext.bind(this.initialFilter, this)
            }
        });
    },

    initialFilter:function () {
        this.applyFilter(function() {
            return false;
        });
    },

    update:function () {
        var content = this.down('#content');
        var release = content.down('#releaseInput').getValue();
        var start = content.down('#rangeStartInput').getValue();
        var end = content.down('#rangeEndInput').getValue();
        var messageBus = Rally.environment.getMessageBus();
        messageBus.fireEvent('scopechanged', {
            release:release,
            start:start,
            end:end
        });
    },

    scopeChangeHandler:function (event) {
       var start = event.start;
       this.findArtifactsOpenAtTime(start, this.processSnapshots);
       //install callback to create a filter function from results
       // apply function to grid contents

    },

    findArtifactsOpenAtTime: function(startDate, processorFunction){
        this.transformStore = Ext.create('Rally.data.lookback.SnapshotStore', {
            context: {
                workspace: this.context.getWorkspace(),
                project: this.context.getProject(),
                projectScopeUp: false,
                projectScopeDown: true
            },
            filters:[
                {property:"__At",
                value: startDate},
                {property:"_ProjectHierarchy",
                value: this.context.getProject().ObjectID},
                {property:"_TypeHierarchy",
                operator:'in',
                value:[-51038]},
                {property:"ScheduleState",
                operator:'<',
                value:"Accepted"}
            ],
            autoLoad: true,
            listeners: {
                scope: this,
                load: processorFunction
            }
        });
    },

    processSnapshots: function() {
        var oidArray = [];
        this.transformStore.each(Ext.bind(function(record){
                oidArray = Ext.Array.push(oidArray, record.get("ObjectID"));
            }, this));
        this.applyFilter(function(record) {
            return Ext.Array.contains(oidArray, record.get("ObjectID"));
        });
    },

    applyFilter: function(filterFunction) {
        this.grid.getStore().filterBy(filterFunction, this);
    }

});
