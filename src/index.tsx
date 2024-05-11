/**
 * @file entry of this example.
 */
import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/v4-shims.css';
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import 'amis-editor-core/lib/style.css';
import './scss/style.scss';
import {setDefaultTheme} from 'amis';
import {setThemeConfig} from 'amis-editor-core';
import themeConfig from 'amis-theme-editor-helper/lib/systemTheme/cxd';

setDefaultTheme('cxd');
setThemeConfig(themeConfig);

var axios = require('axios');
var data = JSON.stringify({
    "appKey": "6cfda5a1f0f8593b",
    "sign": "ZmUyMjM3OTlhYjRkNDhmMzlhMWU2ZWQ0M2Y0NjliYTA5NGExOWY0MDQ0YjM3NmEwODlkYjBiMmY5MWQ5ZmU1ZQ==",
    "worksheetId": "dmym",
    "rowId": "7442ad51-61fc-4914-891e-b28e29ee38bf"
});

var config = {
    method: 'post',
    url: 'https://api.mingdao.com/v2/open/worksheet/getRowByIdPost',
    headers: {
        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Host': 'api.mingdao.com',
        'Connection': 'keep-alive'
    },
    data : data
};

axios(config)
    .then(function (response:any) {
        console.log("mingdao",response.data.data.json);
        window.localStorage.setItem('store', response.data.data.json);

    })
    .catch(function (error:any) {
        console.log(error);
    });



// react < 18
ReactDOM.render(<App />, document.getElementById('root'));
