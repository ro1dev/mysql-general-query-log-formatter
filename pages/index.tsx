import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextArea from '../components/TextArea';

const IndexPage = () => {
  return <React.Fragment>
    <h1>MySQLログを整形するやつ</h1>
    <ToastContainer /> 
    <TextArea />
    <li>2021/03/07 簡単なSELECT文のみ対応</li>
    <div>
      <a href="https://github.com/rrih/mysql-log-formatter">GitHub</a>
    </div>
  </React.Fragment>
}

export default IndexPage
