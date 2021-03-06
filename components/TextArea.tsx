import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const TextArea = () => {
    const placeHolderCode = `ここにペースト\n`;
    const [bakedCode, setBakedCode] = useState<string>('');
    const [convertedCode, setConvertedCode] = useState<string>('');
    const textAreaRef = useRef<any>();
    const reservedWords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'DELETE', 'INSERT'];

    // 前後処理
    const convertBakedCodeToBeEasy = (code: string) => {
        // 改行数をカウント、行ごとに配列の要素にいれる
        const sqlLogLines: Array<string> = code.split(/\n/g);
        if (sqlLogLines.length <= 0) {
            console.log('1行以上入力してください')
        }
        
        /**
         * sqlLogLinesWithoutUnnecessaryString は結果
         */
        let sqlLogLinesWithoutUnnecessaryString: string = '';
        // let result = '';
        let parents: number[][] = [];
        // Queryまでをカット。
        sqlLogLines.forEach((sqlLogLine) => {
            // 'Query+空白'以前を切り捨てる。あと末尾に`;`をつける
            let tmpSqlLog = sqlLogLine.split(/Query+\s+/g)[1];
            let numbers: number[] = [];
            reservedWords.forEach(reservedWord => {
                if (tmpSqlLog.indexOf(`${reservedWord} `) !== -1) {
                    numbers.push(tmpSqlLog.indexOf(`${reservedWord} `));   
                }
            })
            parents.push(numbers);
            // 加工後、sqlLogLinesWithoutUnnecessaryString の末尾に追加していく
            sqlLogLinesWithoutUnnecessaryString += tmpSqlLog + ';';
        });
        // 最終変換
        sqlLogLinesWithoutUnnecessaryString = converting(sqlLogLinesWithoutUnnecessaryString, parents);
        // ループを抜けたら set する
        setConvertedCode(sqlLogLinesWithoutUnnecessaryString);
    }

    // core
    const converting = (oneLineSQL: string, model: number[][]): string => {
        let result = '';
        // 生成し直す
        const newSQLLines = oneLineSQL.split(';').filter((n, index) => {
            if (index !== model.length) {
                return n;
            }
        })
        newSQLLines.forEach((sql, index) => {
            model[index].forEach((m, i) => {
                let choppedSql: string = `${sql.substr(m, !isNaN(model[index][i+1]-1) ? model[index][i+1]-1-m : sql.length-1-m)}${i === model[index].length-1 ? ';\n' : ''}\n`;
                let wordLength = 0;
                let tmpStr: string = '';
                reservedWords.forEach((word) => {
                    if (choppedSql.indexOf(word) !== -1) {
                        wordLength = word.length;
                    }
                })
                // SELECT などを入れる
                tmpStr += `${choppedSql.substr(0, wordLength)}\n`;
                // 残りを`,`で区切っていれる
                let afterStr: string | string[] = choppedSql.substr(wordLength + 1, choppedSql.length).split(',');
                // 配列の場合
                if (typeof afterStr !== 'string') {
                    afterStr.forEach((as, i) => {
                        tmpStr += `\t${as}${i !== afterStr.length-1 ? ',\n' : ''}`;
                    })
                } else {
                    tmpStr += `\t${choppedSql.substr(wordLength + 1, choppedSql.length)}\n`;
                }
                result += tmpStr;
            })
        })
        return result;
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
        setConvertedCode('');
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