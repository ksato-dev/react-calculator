import React, { useReducer } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';

// TODO1: 計算後（式構築後にイコールを押した後）、
// 再度数字を入力して演算子を入力すると過去の計算結果の後にそれらの文字列が追記されてしまう。
// TODO2: 応用演算やバックスペース機能の実装

const Calculator = () => {
  interface DisplayDataType {
    text: string;
    operation: string;
  }

  const initDisplayData: DisplayDataType = { text: '', operation: '' };
  // const [currDisplayData, setCurrDisplayData] = useState<DisplayDataType>(initDisplayData);
  const [displayDataList, setDisplayDataList] = useState<DisplayDataType[]>([]);

  const getHistory = (): string => {
    return displayDataList.reduce((accumulator, current) => {
      return accumulator + current.text + current.operation;
    }, ''); // 初期値は空の文字列
  };

  const operateTwoFactors = (
    prevIndex: number,
    calcInput: number,
    displayData: DisplayDataType
  ): number => {
    let retCalcResult = 0;
    const prevOperation: string = displayDataList[prevIndex].operation;
    // console.log(calcInput, prevOperation, Number(displayData.text));
    if (prevOperation === '＋')
      retCalcResult = calcInput + Number(displayData.text);
    else if (prevOperation === '－')
      retCalcResult = calcInput - Number(displayData.text);
    else if (prevOperation === '×')
      retCalcResult = calcInput * Number(displayData.text);
    else if (prevOperation === '÷')
      retCalcResult = calcInput / Number(displayData.text);
    return retCalcResult;
  };

  const reducer = (currDisplayData: DisplayDataType, action: string) => {
    let newDisplayData: DisplayDataType = currDisplayData;

    // console.log(currDisplayData)

    // 冗長すぎて泣きそう。
    switch (action) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        newDisplayData = {
          text: newDisplayData.text + action,
          operation: '',
        };
        console.log('Add ${action}.');
        return newDisplayData;

      case '＋':
      case '－':
      case '×':
      case '÷':
        if (newDisplayData.text !== '' && newDisplayData.operation === '') {
          newDisplayData = {
            text: newDisplayData.text,
            operation: action,
          };
          setDisplayDataList([...displayDataList, newDisplayData]);

          // set したら空にする。
          newDisplayData = {
            text: '',
            operation: '',
          };
          console.log('Add ${action}.');
          console.log(displayDataList);
          return newDisplayData;
        } else {
          return newDisplayData;
        }

      case '=':
        if (currDisplayData.text) {
          if (0 < displayDataList.length) {
            console.log('displayDataList:', displayDataList);
            let calcResult: number = 0;
            for (
              let index: number = 0;
              index < displayDataList.length;
              index++
            ) {
              // if (index < displayDataList.length - 1)
              const displayData = displayDataList[index];
              if (index === 0) {
                // return Number(accumulator) + Number(current.text);
                calcResult = Number(displayData.text);
                console.log('calcResult:', calcResult);
              } else {
                // console.log('before calcResult:', calcResult);
                calcResult = operateTwoFactors(
                  index - 1,
                  calcResult,
                  displayData
                );
              }
            }
            if (currDisplayData.text !== '') {
              // console.log('before calcResult:', calcResult);
              calcResult = operateTwoFactors(
                displayDataList.length - 1,
                calcResult,
                currDisplayData
              );
            }
            console.log('calcResult:', calcResult);
            // console.log(calcResult);
            newDisplayData = {
              text: newDisplayData.text,
              operation: action + String(calcResult),
            };
            setDisplayDataList([...displayDataList, newDisplayData]);
            // set したら空にする。
            newDisplayData = {
              text: '',
              operation: '',
            };
          }
        }

        newDisplayData = { text: newDisplayData.text, operation: action };
        return newDisplayData;

      case 'CE':
        // 全消し
        newDisplayData = {
          text: '',
          operation: '',
        };
        setDisplayDataList([]);
        console.log('All Clear');
        return newDisplayData;
      case 'C':
        newDisplayData = {
          text: '',
          operation: '',
        };
        console.log('Clear');
        return newDisplayData;
      default:
        return newDisplayData;
    }
  };

  const [currDisplayData, dispatch] = useReducer(reducer, initDisplayData);

  return (
    <div>
      <Box
        sx={{
          marginBottom: '10px',
          // border: '1px solid gray',
          minHeight: '20px',
          // borderRadius: '5px',
        }}
      >
        <Typography sx={{ fontSize: 15 }}>{getHistory()}</Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
          border: '1px solid gray',
          minHeight: '40px',
          borderRadius: '5px',
        }}
      >
        <Typography sx={{ fontSize: 25 }}>{currDisplayData.text}</Typography>
      </Box>
      <Box>
        <Button variant="contained" sx={{ margin: '1px' }}>
          %
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('CE');
          }}
        >
          CE
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('C');
          }}
        >
          C
        </Button>
        {/* <Button variant='contained' sx={{margin: "1px"}}>🅇</Button> */}
        <Button variant="contained" sx={{ margin: '1px' }}>
          ⇚
        </Button>
      </Box>

      {/* 上付き下付き文字が表示できない */}
      <Box>
        <Button variant="contained" sx={{ margin: '1px' }}>
          1/x
        </Button>
        {/* <Button variant='contained' sx={{margin: "1px"}}><sup>1</sup><sub>x</sub></Button> */}
        <Button variant="contained" sx={{ margin: '1px' }}>
          x*x
        </Button>
        <Button variant="contained" sx={{ margin: '1px' }}>
          √x
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('÷');
          }}
        >
          ÷
        </Button>
      </Box>
      <Box>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('7');
          }}
        >
          7
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('8');
          }}
        >
          8
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('9');
          }}
        >
          9
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('＋');
          }}
        >
          ＋
        </Button>
      </Box>
      <Box>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('4');
          }}
        >
          4
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('5');
          }}
        >
          5
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('6');
          }}
        >
          6
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('－');
          }}
        >
          －
        </Button>
      </Box>
      <Box>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('1');
          }}
        >
          1
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('2');
          }}
        >
          2
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('3');
          }}
        >
          3
        </Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('×');
          }}
        >
          ×
        </Button>
      </Box>
      <Box>
        <Button sx={{ margin: '1px' }}></Button>
        <Button
          variant="contained"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('0');
          }}
        >
          0
        </Button>
        <Button variant="contained" sx={{ margin: '1px' }}>
          .
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ margin: '1px' }}
          onClick={() => {
            dispatch('=');
          }}
        >
          =
        </Button>
      </Box>
    </div>
  );
};

export default Calculator;
