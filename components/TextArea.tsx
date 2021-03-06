import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const TextArea = () => {
    const placeHolderCode = `ここにペースト\n例:\n2021-03-04T08:59:22.248461Z	 1318 Query	SELECT Payments.user_id AS Payments__user_id FROM payments Payments WHERE Payments.coupon_id = 2463\n\n2021-03-04T08:59:22.261667Z	 1318 Query	SELECT Payments.id AS Payments__id, Payments.belong_id AS Payments__belong_id FROM payments Payments WHERE Payments.coupon_id = 2462\n2021-03-04T08:59:22.269026Z	 1318 Query	SELECT Payments.user_id AS Payments__user_id FROM payments Payments WHERE Payments.coupon_id = 2462\n\n2021-03-04T08:59:22.283015Z	 1318 Query	SELECT Payments.id AS Payments__id, Payments.belong_id AS Payments__belong_id FROM payments Payments WHERE Payments.coupon_id = 2461`
    const [bakedCode, setBakedCode] = useState<string>('');
    const [convertedCode, setConvertedCode] = useState<string>('');
    const textAreaRef = useRef<any>();
    const reservedWords = ['SELECT', 'FROM', 'WHERE', 'JOIN'];

    // 変換処理
    const convertBakedCodeToBeEasy = (code: string) => {
        // 改行数をカウント、行ごとに配列の要素にいれる
        const sqlLogLines: Array<string> = code.split(/\n/g);
        console.log(sqlLogLines);
        if (sqlLogLines.length <= 0) {
            console.log('1行以上入力してください')
        }
        let sqlLogLinesWithoutUnnecessaryString: string = '';
        // Queryまでをカット。
        sqlLogLines.forEach((sqlLogLine, index) => {
            // 'Query+空白'以前を切り捨てる。あと末尾に`;`をつける
            let tmpSqlLog = sqlLogLine.split(/Query+\s+/g)[1] + ';\n';
            sqlLogLinesWithoutUnnecessaryString += tmpSqlLog;
        });
        console.log(sqlLogLinesWithoutUnnecessaryString);
        // 
        // const firstConvertedCode = code.split(/Query+\s+/g);
        // console.log(code.split(/Query+\s+/g));
        // const result = firstConvertedCode.replace(/;+/g, ';\n');
        setConvertedCode(sqlLogLinesWithoutUnnecessaryString);
    }

    function copyToClipboard(e: any) {
        if (textAreaRef.current) {
            textAreaRef.current!.select();
            document.execCommand('copy');
            e.target.focus();
            toastForCopy();
        }
    }

    const reset = () => {
        setBakedCode('');
        setConvertedCode([]);
    }

    const toastForCopy = () => {
        toast('コピーしました');
    }
    return <React.Fragment>
        <div>
            <textarea cols={230} rows={15} value={bakedCode} placeholder={placeHolderCode} onChange={(e) => { setBakedCode(e.target.value) } }></textarea>
        </div>
        <div className="text-center">
            <button onClick={() => convertBakedCodeToBeEasy(bakedCode)}>
            変換する
            </button>
            <button onClick={() => reset()}>リセット</button>
            <button onClick={copyToClipboard}>
            コピー
            </button>
        </div>
        <div>
            <textarea id="copy" ref={textAreaRef} cols={230} rows={15} value={convertedCode} ></textarea>
        </div>
    </React.Fragment>
}

export default TextArea;