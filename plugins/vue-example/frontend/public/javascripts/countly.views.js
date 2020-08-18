/*global app, countlyVue, countlyVueExample, countlyGlobal, countlyCommon */

var TableView = countlyVue.views.BaseView.extend({
    template: '#vue-example-table-template',
    computed: {
        tableRows: function() {
            return this.$store.getters["vueExample/pairs"];
        }
    },
    data: function() {
        var self = this;
        return {
            targetName: "John Doe",
            targetValue: 0,
            tableKeyFn: function(row) {
                return row._id;
            },
            tableColumns: [
                {
                    type: "checkbox",
                    fieldKey: "status",
                    onChange: function(newValue, row) {
                        self.$store.commit("vueExample/setStatus", {_id: row._id, value: newValue});
                    },
                    options: {
                        title: "Status"
                    },
                    dt: {
                        "sWidth": "10%"
                    }
                },
                {
                    type: "field",
                    fieldKey: "_id",
                    options: {
                        title: "ID"
                    },
                    dt: {
                        "sWidth": "3%"
                    },
                },
                {
                    type: "field",
                    fieldKey: "name",
                    options: {
                        dataType: "string",
                        title: "Name"
                    },
                    dt: {
                        "sWidth": "20%"
                    },
                },
                {
                    type: "field",
                    fieldKey: "value",
                    options: {
                        dataType: "numeric",
                        title: "Value"
                    },
                },
                {
                    type: "options",
                    items: [
                        {
                            icon: "fa fa-trash",
                            label: "Delete",
                            action: {"event": "delete-record"},
                        },
                        {
                            icon: "fa fa-trash",
                            label: "Delete (with undo)",
                            action: {
                                "event": "try-delete-record",
                                "undo": {
                                    "commit": "delete-record",
                                    "message": "You deleted a record."
                                }
                            },
                            disabled: !(countlyGlobal.member.global_admin || countlyGlobal.admin_apps[countlyCommon.ACTIVE_APP_ID])
                        }
                    ],
                    dt: {
                        "sWidth": "3%"
                    }
                }
            ],
            selectedRadio: 2,
            availableRadio: [
                {text: "Type 1", value: 1},
                {text: "Type 2", value: 2},
                {text: "Type 3", value: 3, description: "Some description..."},
            ]
        };
    },
    methods: {
        add: function() {
            this.$store.commit("vueExample/addPair", {name: this.targetName, value: this.targetValue});
            this.targetName = "";
            this.targetValue += 1;
        },
        onTryDelete: function(row, callback) {
            callback(true);
        },
        onDelete: function(row) {
            this.$store.commit("vueExample/deletePairById", row._id);
        },
        onShow: function(/*row, key*/) {
        }
    }
});

var TimeGraphView = countlyVue.views.BaseView.extend({
    template: '#vue-example-tg-template',
    mixins: [
        countlyVue.mixins.refreshOnParentActive
    ],
    computed: {
        randomNumbers: function() {
            return this.$store.getters["vueExample/randomNumbers"];
        }
    },
    methods: {
        refresh: function() {
            if (this.isParentActive) {
                this.$store.dispatch("vueExample/updateRandomArray");
            }
        }
    },
    mounted: function() {
        this.refresh();
    }
});

var MainView = countlyVue.views.BaseView.extend({
    template: '#vue-example-main-template',
    components: {
        "table-view": TableView,
        "tg-view": TimeGraphView
    }
});

var vuex = [{
    clyModel: countlyVueExample
}];

var exampleView = new countlyVue.views.BackboneWrapper({
    component: MainView,
    vuex: vuex,
    templates: {
        namespace: 'vue-example',
        mapping: {
            'table-template': '/vue-example/templates/table.html',
            'tg-template': '/vue-example/templates/tg.html',
            'main-template': '/vue-example/templates/main.html'
        }
    }
});

app.vueExampleView = exampleView;

app.route("/vue/example", 'vue-example', function() {
    this.renderWhenReady(this.vueExampleView);
});