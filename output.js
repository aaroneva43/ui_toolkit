



Ext.define('access_control_policy.view.Access_control_policys', {
    extend: 'hscore.widgets.grid.Panel',
    requires: ['hscore.utils.Utils'],
    xtype: 'adc_access_control_policys',
    forceFit: true,
    border: false,
    header: false,
    config: {
        showTbar: true
    },
    
    initComponent: function () {
        var me = this,
            utils = hscore.utils.Utils;;


        
        Ext.apply(me, {
            tbar: {
                xtype: 'toolbar',
                itemId: 'ssRuleTbar',
                border: false,
                width: '100%',
                items: [{
                    iconCls: 'btn-add',
                    text: getLangStr('common_button_new'),
                    action: 'add'
                }, {
                    iconCls: 'btn-edit',
                    text: getLangStr('common_button_edit'),
                    action: 'edit',
                    disabled: true
                }, {
                    iconCls: 'btn-del',
                    text: getLangStr('common_button_delete'),
                    action: 'del',
                    disabled: true
                }],
                listeners: {
                    render: function(self) {
                        var grid = self.up('grid');

                        grid.selModel.on('selectionchange', function (self, selected, eOpts) {
                            utils.setActionBtnStatus(grid.query('toolbar[dock=top] button'), selected);
                        });
                    }
                }
            },
            store: Ext.create('Ext.data.Store', {
                model: 'access_control_policy.model.Access_control_policy'
            }),
            displayCheckboxColumn: true,
            columns: [
                            
                {
                    dataIndex: 'id',
                    text: getLangStr('id')
                                         
                }, 
                
                                
                {
                    dataIndex: 'name',
                    text: getLangStr('name')
                                        
                }, 
                
                                
                {
                    dataIndex: 'description',
                    text: getLangStr('description')
                                        
                }, 
                
                                
                {
                    dataIndex: 'action',
                    text: getLangStr('action')
                                        
                }, 
                
                                
                {
                    dataIndex: 'status_code',
                    text: getLangStr('status_code')
                                         
                }, 
                
                                
                {
                    dataIndex: 'block_src_ip',
                    text: getLangStr('block_src_ip')
                                         
                }, 
                
                                
                {
                    dataIndex: 'redirect_url',
                    text: getLangStr('redirect_url')
                                        
                }, 
                
                                
                {
                    dataIndex: 'capture_pkt',
                    text: getLangStr('capture_pkt')
                                         
                }, 
                
                                
                {
                    dataIndex: 'log',
                    text: getLangStr('log')
                                         
                }
                
                                
        });

        this.callParent();
    }
});

    




Ext.define('http_method.view.Http_methods', {
    extend: 'hscore.widgets.grid.Panel',
    requires: ['hscore.utils.Utils'],
    xtype: 'adc_http_methods',
    forceFit: true,
    border: false,
    header: false,
    config: {
        showTbar: true
    },
    
    initComponent: function () {
        var me = this,
            utils = hscore.utils.Utils;;


        
        Ext.apply(me, {
            tbar: {
                xtype: 'toolbar',
                itemId: 'ssRuleTbar',
                border: false,
                width: '100%',
                items: [{
                    iconCls: 'btn-add',
                    text: getLangStr('common_button_new'),
                    action: 'add'
                }, {
                    iconCls: 'btn-edit',
                    text: getLangStr('common_button_edit'),
                    action: 'edit',
                    disabled: true
                }, {
                    iconCls: 'btn-del',
                    text: getLangStr('common_button_delete'),
                    action: 'del',
                    disabled: true
                }],
                listeners: {
                    render: function(self) {
                        var grid = self.up('grid');

                        grid.selModel.on('selectionchange', function (self, selected, eOpts) {
                            utils.setActionBtnStatus(grid.query('toolbar[dock=top] button'), selected);
                        });
                    }
                }
            },
            store: Ext.create('Ext.data.Store', {
                model: 'http_method.model.Http_method'
            }),
            displayCheckboxColumn: true,
            columns: [
                            
                {
                    dataIndex: 'enable',
                    text: getLangStr('enable')
                                         
                }, 
                
                                
                {
                    dataIndex: 'operator',
                    text: getLangStr('operator')
                                        
                }, 
                
                                
                {
                    dataIndex: 'is_negative',
                    text: getLangStr('is_negative')
                                         
                }, 
                
                                
                {
                    dataIndex: 'pattern',
                    text: getLangStr('pattern')
                                        
                }
                
                                
        });

        this.callParent();
    }
});

    




Ext.define('http_content_type.view.Http_content_types', {
    extend: 'hscore.widgets.grid.Panel',
    requires: ['hscore.utils.Utils'],
    xtype: 'adc_http_content_types',
    forceFit: true,
    border: false,
    header: false,
    config: {
        showTbar: true
    },
    
    initComponent: function () {
        var me = this,
            utils = hscore.utils.Utils;;


        
        Ext.apply(me, {
            tbar: {
                xtype: 'toolbar',
                itemId: 'ssRuleTbar',
                border: false,
                width: '100%',
                items: [{
                    iconCls: 'btn-add',
                    text: getLangStr('common_button_new'),
                    action: 'add'
                }, {
                    iconCls: 'btn-edit',
                    text: getLangStr('common_button_edit'),
                    action: 'edit',
                    disabled: true
                }, {
                    iconCls: 'btn-del',
                    text: getLangStr('common_button_delete'),
                    action: 'del',
                    disabled: true
                }],
                listeners: {
                    render: function(self) {
                        var grid = self.up('grid');

                        grid.selModel.on('selectionchange', function (self, selected, eOpts) {
                            utils.setActionBtnStatus(grid.query('toolbar[dock=top] button'), selected);
                        });
                    }
                }
            },
            store: Ext.create('Ext.data.Store', {
                model: 'http_content_type.model.Http_content_type'
            }),
            displayCheckboxColumn: true,
            columns: [
                            
                {
                    dataIndex: 'enable',
                    text: getLangStr('enable')
                                         
                }, 
                
                                
                {
                    dataIndex: 'operator',
                    text: getLangStr('operator')
                                        
                }, 
                
                                
                {
                    dataIndex: 'is_negative',
                    text: getLangStr('is_negative')
                                         
                }, 
                
                                
                {
                    dataIndex: 'pattern',
                    text: getLangStr('pattern')
                                        
                }
                
                                
        });

        this.callParent();
    }
});

    




Ext.define('http_request_header_names.view.Http_request_header_namess', {
    extend: 'hscore.widgets.grid.Panel',
    requires: ['hscore.utils.Utils'],
    xtype: 'adc_http_request_header_namess',
    forceFit: true,
    border: false,
    header: false,
    config: {
        showTbar: true
    },
    
    initComponent: function () {
        var me = this,
            utils = hscore.utils.Utils;;


        
        Ext.apply(me, {
            tbar: {
                xtype: 'toolbar',
                itemId: 'ssRuleTbar',
                border: false,
                width: '100%',
                items: [{
                    iconCls: 'btn-add',
                    text: getLangStr('common_button_new'),
                    action: 'add'
                }, {
                    iconCls: 'btn-edit',
                    text: getLangStr('common_button_edit'),
                    action: 'edit',
                    disabled: true
                }, {
                    iconCls: 'btn-del',
                    text: getLangStr('common_button_delete'),
                    action: 'del',
                    disabled: true
                }],
                listeners: {
                    render: function(self) {
                        var grid = self.up('grid');

                        grid.selModel.on('selectionchange', function (self, selected, eOpts) {
                            utils.setActionBtnStatus(grid.query('toolbar[dock=top] button'), selected);
                        });
                    }
                }
            },
            store: Ext.create('Ext.data.Store', {
                model: 'http_request_header_names.model.Http_request_header_names'
            }),
            displayCheckboxColumn: true,
            columns: [
                            
                {
                    dataIndex: 'enable',
                    text: getLangStr('enable')
                                         
                }, 
                
                                
                {
                    dataIndex: 'operator',
                    text: getLangStr('operator')
                                        
                }, 
                
                                
                {
                    dataIndex: 'is_negative',
                    text: getLangStr('is_negative')
                                         
                }, 
                
                                
                {
                    dataIndex: 'pattern',
                    text: getLangStr('pattern')
                                        
                }
                
                                
        });

        this.callParent();
    }
});

    




Ext.define('http_version.view.Http_versions', {
    extend: 'hscore.widgets.grid.Panel',
    requires: ['hscore.utils.Utils'],
    xtype: 'adc_http_versions',
    forceFit: true,
    border: false,
    header: false,
    config: {
        showTbar: true
    },
    
    initComponent: function () {
        var me = this,
            utils = hscore.utils.Utils;;


        
        Ext.apply(me, {
            tbar: {
                xtype: 'toolbar',
                itemId: 'ssRuleTbar',
                border: false,
                width: '100%',
                items: [{
                    iconCls: 'btn-add',
                    text: getLangStr('common_button_new'),
                    action: 'add'
                }, {
                    iconCls: 'btn-edit',
                    text: getLangStr('common_button_edit'),
                    action: 'edit',
                    disabled: true
                }, {
                    iconCls: 'btn-del',
                    text: getLangStr('common_button_delete'),
                    action: 'del',
                    disabled: true
                }],
                listeners: {
                    render: function(self) {
                        var grid = self.up('grid');

                        grid.selModel.on('selectionchange', function (self, selected, eOpts) {
                            utils.setActionBtnStatus(grid.query('toolbar[dock=top] button'), selected);
                        });
                    }
                }
            },
            store: Ext.create('Ext.data.Store', {
                model: 'http_version.model.Http_version'
            }),
            displayCheckboxColumn: true,
            columns: [
                            
                {
                    dataIndex: 'enable',
                    text: getLangStr('enable')
                                         
                }, 
                
                                
                {
                    dataIndex: 'operator',
                    text: getLangStr('operator')
                                        
                }, 
                
                                
                {
                    dataIndex: 'is_negative',
                    text: getLangStr('is_negative')
                                         
                }, 
                
                                
                {
                    dataIndex: 'pattern',
                    text: getLangStr('pattern')
                                        
                }
                
                                
        });

        this.callParent();
    }
});

    




Ext.define('uri_path_list.view.Uri_path_lists', {
    extend: 'hscore.widgets.grid.Panel',
    requires: ['hscore.utils.Utils'],
    xtype: 'adc_uri_path_lists',
    forceFit: true,
    border: false,
    header: false,
    config: {
        showTbar: true
    },
    
    initComponent: function () {
        var me = this,
            utils = hscore.utils.Utils;;


        
        Ext.apply(me, {
            tbar: {
                xtype: 'toolbar',
                itemId: 'ssRuleTbar',
                border: false,
                width: '100%',
                items: [{
                    iconCls: 'btn-add',
                    text: getLangStr('common_button_new'),
                    action: 'add'
                }, {
                    iconCls: 'btn-edit',
                    text: getLangStr('common_button_edit'),
                    action: 'edit',
                    disabled: true
                }, {
                    iconCls: 'btn-del',
                    text: getLangStr('common_button_delete'),
                    action: 'del',
                    disabled: true
                }],
                listeners: {
                    render: function(self) {
                        var grid = self.up('grid');

                        grid.selModel.on('selectionchange', function (self, selected, eOpts) {
                            utils.setActionBtnStatus(grid.query('toolbar[dock=top] button'), selected);
                        });
                    }
                }
            },
            store: Ext.create('Ext.data.Store', {
                model: 'uri_path_list.model.Uri_path_list'
            }),
            displayCheckboxColumn: true,
            columns: [
                            
                {
                    dataIndex: '',
                    text: getLangStr('')
                                        
                }, 
                
                                
                {
                    dataIndex: '',
                    text: getLangStr('')
                                        
                }, 
                
                                
                {
                    dataIndex: '',
                    text: getLangStr('')
                                        
                }, 
                
                                
        });

        this.callParent();
    }
});

    




Ext.define('client_ip_list.view.Client_ip_lists', {
    extend: 'hscore.widgets.grid.Panel',
    requires: ['hscore.utils.Utils'],
    xtype: 'adc_client_ip_lists',
    forceFit: true,
    border: false,
    header: false,
    config: {
        showTbar: true
    },
    
    initComponent: function () {
        var me = this,
            utils = hscore.utils.Utils;;


        
        Ext.apply(me, {
            tbar: {
                xtype: 'toolbar',
                itemId: 'ssRuleTbar',
                border: false,
                width: '100%',
                items: [{
                    iconCls: 'btn-add',
                    text: getLangStr('common_button_new'),
                    action: 'add'
                }, {
                    iconCls: 'btn-edit',
                    text: getLangStr('common_button_edit'),
                    action: 'edit',
                    disabled: true
                }, {
                    iconCls: 'btn-del',
                    text: getLangStr('common_button_delete'),
                    action: 'del',
                    disabled: true
                }],
                listeners: {
                    render: function(self) {
                        var grid = self.up('grid');

                        grid.selModel.on('selectionchange', function (self, selected, eOpts) {
                            utils.setActionBtnStatus(grid.query('toolbar[dock=top] button'), selected);
                        });
                    }
                }
            },
            store: Ext.create('Ext.data.Store', {
                model: 'client_ip_list.model.Client_ip_list'
            }),
            displayCheckboxColumn: true,
            columns: [
                            
                {
                    dataIndex: '',
                    text: getLangStr('')
                                        
                }, 
                
                                
                {
                    dataIndex: '',
                    text: getLangStr('')
                                        
                }, 
                
                                
                {
                    dataIndex: '',
                    text: getLangStr('')
                                        
                }, 
                
                                
        });

        this.callParent();
    }
});

    


