Ext.define('ScopeChange', {
    extend: 'Rally.app.App',
    layout: { type: 'vbox', align: 'stretch' },
    appName:'ScopeChanges',
    componentCls: 'app',
    launch: function() {
        Rally.data.ModelFactory.getModel({
            type: 'UserStory',
            success: function(model) {
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
//                    ,
//                    storeConfig: {
//                        filters: [
//                            {
//                                property: 'ScheduleState',
//                                operator: '=',
//                                value: 'Defined'
//                            }
//                        ]
//                    }

                });

            },
            scope: this
    })},

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
//        record.data.ObjectID
        return Ext.Array.contains(this.oidArray, record.get("ObjectID"));
    }

//    _filters:undefined,
//    _types:['User Story', 'Defect'],

//     items:[
//        {
//            xtype: 'panel',
//            layout: 'anchor',
//            border: true,
//            fieldDefaults: {
//                labelWidth: 40
//            },
//            defaultType: 'textfield',
//            bodyPadding: 5,
//            items: [
//                {
//                    fieldLabel: 'Query',
//                    itemId: 'queryField',
//                    anchor:'100%',
//                    width: 700,
//                    height: 100,
//                    xtype: 'textarea',
//                    value: '{\n'+
//                            ' "ObjectID": {$gt:0},\n'+
//                            ' "__At": "current"\n'+
//                            '}'
//                },
//                {
//                    fieldLabel: 'Fields',
//                    itemId: 'fieldsField',
//                    anchor: '100%',
//                    width: 700,
//                    value: "ObjectID, _ValidFrom, _UnformattedID, Name"
//                },
//                {
//                    fieldLabel: 'Sort',
//                    itemId: 'sortField',
//                    anchor: '100%',
//                    width: 700,
//                    value: "{'ObjectID' : -1, '_ValidFrom': 1}"
//                },
//                {
//                    fieldLabel: 'Page Size',
//                    itemId: 'pageSizeField',
//                    anchor: '100%',
//                    width: 700,
//                    value: '10'
//                }
//            ],
//
//            buttons: [
//                {
//                    xtype: 'rallybutton',
//                    text: 'Search',
//                    itemId: 'searchButton'
//                }
//            ]
//        },
//        {
//            xtype: 'panel',
//            itemId: 'gridHolder',
//            layout: 'fit',
//            height: 400
//        }
//    ],
//
//    launch: function() {
//        var button = this.down('#searchButton');
//        button.on('click', this.searchClicked, this);
//    },
//
//    searchClicked: function(){
//        var queryField = this.down('#queryField');
//        var query = queryField.getValue();
//        var selectedFields = this.down('#fieldsField').getValue();
//        if(selectedFields){
//            if(selectedFields === 'true'){
//                selectedFields = true;
//            }
//            else{
//                selectedFields = selectedFields.split(', ');
//            }
//        }
//
//        var sort = this.down('#sortField').getValue();
//
//        var pageSize = this.down('#pageSizeField').getValue();
//        var parsedPageSize = parseInt(pageSize, 10);
//        // don't allow empty or 0 pagesize
//        pageSize = (parsedPageSize) ? parsedPageSize : 10;
//
//        var callback = Ext.bind(this.processSnapshots, this);
//        this.doSearch(query, selectedFields, sort, pageSize, callback);
//    },
//
//    createSortMap: function(csvFields){
//        var fields = csvFields.split(', ');
//        var sortMap = {};
//        for(var field in fields){
//            if(fields.hasOwnProperty(field)){
//                sortMap[field] = 1;
//            }
//        }
//
//        return sortMap;
//    },
//
//    doSearch: function(query, fields, sort, pageSize, callback){
//        var transformStore = Ext.create('Rally.data.lookback.SnapshotStore', {
//            context: {
//                workspace: this.context.getWorkspace(),
//                project: this.context.getProject()
//            },
//            fetch: fields,
//            rawFind: query,
//            autoLoad: true,
//            listeners: {
//                scope: this,
//                load: this.processSnapshots
//            }
//        });
//    },
//
//    processSnapshots: function(store, records){
//        var snapshotGrid = Ext.create('Rally.ui.grid.Grid', {
//            title: 'Snapshots',
//            store: store,
//            columnCfgs: [
//                {
//                    text: 'ObjectID',
//                    dataIndex: 'ObjectID'
//                },
//                {
//                    text: 'Name',
//                    dataIndex: 'Name'
//                },
//                {
//                    text: 'Project',
//                    dataIndex: 'Project'
//                },
//                {
//                    text: '_ValidFrom',
//                    dataIndex: '_ValidFrom'
//                },
//                {
//                    text: '_ValidTo',
//                    dataIndex: '_ValidTo'
//                }
//            ],
//            height: 400
//        });
//
//        var gridHolder = this.down('#gridHolder');
//        gridHolder.removeAll(true);
//        gridHolder.add(snapshotGrid);
//    }
});
