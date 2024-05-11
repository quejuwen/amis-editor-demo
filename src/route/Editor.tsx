import React from 'react';
import {Editor, ShortcutKey} from 'amis-editor';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router-dom';
import {toast, Select} from 'amis';
import {currentLocale} from 'i18n-runtime';
import {Icon} from '../icons/index';
import {IMainStore} from '../store';
import '../editor/DisabledEditorPlugin'; // 用于隐藏一些不需要的Editor预置组件
import '../renderer/MyRenderer';
import '../editor/MyRenderer';
import axios from "axios";
import {applySnapshot, getSnapshot} from "mobx-state-tree";
import {reaction} from "mobx";

let currentIndex = -1;

let host = `${window.location.protocol}//${window.location.host}`;

// 如果在 gh-pages 里面
if (/^\/amis-editor-demo/.test(window.location.pathname)) {
    host += '/amis-editor';
}

const schemaUrl = `${host}/schema.json`;

const editorLanguages = [
    {
        label: '简体中文',
        value: 'zh-CN'
    },
    {
        label: 'English',
        value: 'en-US'
    }
];

export default inject('store')(
    observer(function ({
                           store,
                           location,
                           history,
                           match
                       }: { store: IMainStore } & RouteComponentProps<{ id: string }>) {
        const index: number = parseInt(match.params.id, 10);
        const curLanguage = currentLocale(); // 获取当前语料类型

        if (index !== currentIndex) {
            currentIndex = index;
            store.updateSchema(store.pages[index].schema);
        }

        function save() {
            store.updatePageSchemaAt(index);
            toast.success('保存成功', '提示');
        }

        function onChange(value: any) {
            store.updateSchema(value);
            store.updatePageSchemaAt(index);
        }

        function changeLocale(value: string) {
            localStorage.setItem('suda-i18n-locale', value);
            window.location.reload();
        }

        function exit() {
            //保存到明道云
            if (typeof window !== 'undefined' && window.localStorage) {
                const storeData = window.localStorage.getItem('store');


                var axios = require('axios');
                var data = JSON.stringify({
                    "appKey": "6cfda5a1f0f8593b",
                    "sign": "ZmUyMjM3OTlhYjRkNDhmMzlhMWU2ZWQ0M2Y0NjliYTA5NGExOWY0MDQ0YjM3NmEwODlkYjBiMmY5MWQ5ZmU1ZQ==",
                    "worksheetId": "dmym",
                    "rowId": "7442ad51-61fc-4914-891e-b28e29ee38bf",
                    "controls": [
                        {
                            "controlId": "json",
                            "value": storeData
                        }
                    ],
                    "triggerWorkflow": false
                });

                var config = {
                    method: 'post',
                    url: 'https://api.mingdao.com/v2/open/worksheet/editRow',
                    headers: {
                        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Host': 'api.mingdao.com',
                        'Connection': 'keep-alive'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response: any) {
                        console.log(JSON.stringify(response.data));
                    })
                    .catch(function (error: any) {
                        console.log(error);
                    });

            }

            history.push(`/${store.pages[index].path}`);
        }

        return (
            <div className="Editor-Demo">
                <div className="Editor-header">
                    <div className="Editor-title">amis 可视化编辑器</div>
                    <div className="Editor-view-mode-group-container">
                        <div className="Editor-view-mode-group">
                            <div
                                className={`Editor-view-mode-btn editor-header-icon ${
                                    !store.isMobile ? 'is-active' : ''
                                }`}
                                onClick={() => {
                                    store.setIsMobile(false);
                                }}
                            >
                                <Icon icon="pc-preview" title="PC模式"/>
                            </div>
                            <div
                                className={`Editor-view-mode-btn editor-header-icon ${
                                    store.isMobile ? 'is-active' : ''
                                }`}
                                onClick={() => {
                                    store.setIsMobile(true);
                                }}
                            >
                                <Icon icon="h5-preview" title="移动模式"/>
                            </div>
                        </div>
                    </div>

                    <div className="Editor-header-actions">
                        <ShortcutKey/>
                        <Select
                            className="margin-left-space"
                            options={editorLanguages}
                            value={curLanguage}
                            clearable={false}
                            onChange={(e: any) => changeLocale(e.value)}
                        />
                        <div
                            className={`header-action-btn m-1 ${
                                store.preview ? 'primary' : ''
                            }`}
                            onClick={() => {
                                store.setPreview(!store.preview);
                            }}
                        >
                            {store.preview ? '编辑' : '预览'}
                        </div>
                        {!store.preview && (
                            <div className={`header-action-btn exit-btn`} onClick={exit}>
                                退出
                            </div>
                        )}
                    </div>
                </div>
                <div className="Editor-inner">
                    <Editor
                        theme={'cxd'}
                        preview={store.preview}
                        isMobile={store.isMobile}
                        value={store.schema}
                        onChange={onChange}
                        onPreview={() => {
                            store.setPreview(true);
                        }}
                        onSave={save}
                        className="is-fixed"
                        $schemaUrl={schemaUrl}
                        showCustomRenderersPanel={true}
                        amisEnv={{
                            fetcher: store.fetcher,
                            notify: store.notify,
                            alert: store.alert,
                            copy: store.copy
                        }}
                    />
                </div>
            </div>
        );
    })
);
