import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextArea from '../components/TextArea';

const IndexPage = () => {
  return <React.Fragment>
    <h1>MySQLログを整形するやつ</h1>
    <ToastContainer /> 
    <TextArea />
    現在想定されている予約語→SELECT、FROM、WHERE句(大文字飲み)<br />
    あと色々とガバガバすぎです…
  </React.Fragment>
}

export default IndexPage
