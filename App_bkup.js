Ext.define('ScopeChange', {
    extend: 'Rally.app.App',
    layout: { type: 'vbox', align: 'stretch' },
    appName:'ScopeChanges',
    componentCls: 'app',

    launch: function() {
        var me = this;
        Rally.data.ModelFactory.getModel({
                type: 'UserStory',
                success: me.installComponents,
                scope: this
            })
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
                load:Ext.bind(this.doSearch, this)
            }
        });
    },

    doSearch: function(){
        console.log(this.context.getProject());
        this.transformStore = Ext.create('Rally.data.lookback.SnapshotStore', {
            context: {
                workspace: this.context.getWorkspace(),
                project: this.context.getProject(),
                projectScopeUp: false,
                projectScopeDown: true
            },
            filters:[
                {property:"__At",
                value: "2012-08-16"},
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
                load: this.processSnapshots
            }
        });
    },

    processSnapshots: function() {
        this.oidArray = [];
        this.transformStore.each(Ext.bind(function(record){
                console.log("Processing record: " + record.get("ObjectID"));
                this.oidArray = Ext.Array.push(this.oidArray, record.get("ObjectID"));
            }, this));
        console.log(this.oidArray);
        this.grid.getStore().filterBy(this.filterFunction, this);
    },

    filterFunction: function(record) {
        console.log(record.get("ObjectID"));
        return Ext.Array.contains(this.oidArray, record.get("ObjectID"));
    }

});
