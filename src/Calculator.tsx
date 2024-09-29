import { useEffect, useReducer, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

// TODO: バックスペース機能の実装
// TODO2: 小数点を考慮した計算の実装

const Calculator = () => {
  interface DisplayDataType {
    text: string;
    operation: string;
    done?: true; // 計算が終わってる時（つまり＝が押された時 true になる）
  }

  const initDisplayData: DisplayDataType = { text: '', operation: '' };
  const initDisplayDataList: DisplayDataType[] = [];
  const [displayDataListState, setDisplayDataListState] =
    useState<DisplayDataType[]>(initDisplayDataList);
  const [historyState, setHistoryState] = useState<string>('');

  const getHistory = (): string => {
    return displayDataListState.reduce((accumulator, current) => {
      return accumulator + current.text + current.operation;
    }, ''); // 初期値は空の文字列
  };

  // 過去の入力内容を表示するための useEffect
  // displayDataListState (今までの入力内容) が更新されたタイミング呼び出し。 
  useEffect(() => {
    setHistoryState(getHistory());
    console.log('set history.');
  }, [displayDataListState]);

  // 二個の値を受け取って演算子に応じた計算を行う。
  const operateTwoFactors = (
    operation: string,
    factor1: number,
    factor2: number
  ): number => {
    let retCalcResult = 0;
    if (operation === '＋') retCalcResult = factor1 + factor2;
    else if (operation === '－') retCalcResult = factor1 - factor2;
    else if (operation === '×') retCalcResult = factor1 * factor2;
    else if (operation === '÷') retCalcResult = factor1 / factor2;
    return retCalcResult;
  };

  // ネスト深すぎ
  // こういうクソコードを書くと少し変更を加えた際にバグが生じるのでテストコードを書くべき。
  const calcResult = (
    currDisplayData: DisplayDataType,
    newDisplayData: DisplayDataType,
    action: string
  ) => {
    if (!newDisplayData.done) {
      if (currDisplayData.text) {
        let calcResult: number = 0;
        if (0 < displayDataListState.length) {
          // console.log('displayDataList:', displayDataList);
          for (
            let index: number = 0;
            index < displayDataListState.length;
            index++
          ) {
            // if (index < displayDataList.length - 1)
            const displayData = displayDataListState[index];
            if (index === 0) {
              // return Number(accumulator) + Number(current.text);
              calcResult = Number(displayData.text);
              console.log('calcResult:', calcResult);
            } else {
              // console.log('before calcResult:', calcResult);
              const operation: string =
                displayDataListState[index - 1].operation;
              calcResult = operateTwoFactors(
                operation,
                calcResult,
                Number(displayData.text)
              );
            }
          }
          if (newDisplayData.text !== '') {
            // console.log('before calcResult:', calcResult);
            const operation: string =
              displayDataListState[displayDataListState.length - 1].operation;
            calcResult = operateTwoFactors(
              operation,
              calcResult,
              Number(newDisplayData.text)
            );
          }
          console.log('calcResult:', calcResult);
          // console.log(calcResult);
          newDisplayData = {
            text: newDisplayData.text,
            operation: action + String(calcResult),
          };
          setDisplayDataListState([...displayDataListState, newDisplayData]);
          newDisplayData = {
            text: '',
            operation: '',
          };
        }
      } else {
        // 59－968× などとヒストリーに表示されており、かつ今の入力表示には
        // 文字がないときも計算する。
        if (0 < displayDataListState.length) {
          let calcResult: number = 0;
          for (
            let index: number = 0;
            index < displayDataListState.length;
            index++
          ) {
            const displayData = displayDataListState[index];
            if (index === 0) {
              calcResult = Number(displayData.text);
              console.log('calcResult:', calcResult);
            } else {
              const operation: string =
                displayDataListState[index - 1].operation;
              calcResult = operateTwoFactors(
                operation,
                calcResult,
                Number(displayData.text)
              );
            }
          }
          console.log('calcResult:', calcResult);
          setDisplayDataListState((prevDisplayDataList) => {
            const lastHistroyDisplayData =
              prevDisplayDataList[prevDisplayDataList.length - 1];
            console.log('lastHistroyDisplayData:', lastHistroyDisplayData);

            // 演算子を消したものを作る。
            const notHasOperationData: DisplayDataType = {
              text: lastHistroyDisplayData.text,
              operation: '',
            };

            // 再代入
            newDisplayData = {
              text: newDisplayData.text,
              operation: action + String(calcResult),
            };
            let newDisplayDataList = prevDisplayDataList;
            newDisplayDataList[newDisplayDataList.length - 1] =
              notHasOperationData;
            return [...newDisplayDataList, newDisplayData];
          });
        }
      }
    }
  };

  const reducer = (currDisplayData: DisplayDataType, action: string) => {
    let newDisplayData: DisplayDataType = currDisplayData;

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
        if (newDisplayData.done) {
          setDisplayDataListState(initDisplayDataList);
        }

        newDisplayData = {
          text: newDisplayData.text + action,
          operation: '',
        };
        console.log('Add:', newDisplayData);
        return newDisplayData;

      case '＋':
      case '－':
      case '×':
      case '÷':
        // messy code
        // 最後に入力されたデータ
        if (newDisplayData.text !== '') {
          newDisplayData = {
            text: newDisplayData.text,
            operation: action,
          };
          setDisplayDataListState([...displayDataListState, newDisplayData]);

          // set したら空にする。
          newDisplayData = {
            text: '',
            operation: '',
          };
          console.log('Add:', action);
          console.log(displayDataListState);
        } else if (newDisplayData.text === '') {
          let lastHistoryDisplayData = undefined;

          if (0 < displayDataListState.length) {
            lastHistoryDisplayData =
              displayDataListState[displayDataListState.length - 1];
          }
          if (lastHistoryDisplayData !== undefined) {
            // 最後に入力されたデータ
            // 演算子を消したものを作る。
            const updatedOperationData: DisplayDataType = {
              text: lastHistoryDisplayData.text,
              operation: action,
            };

            // 下記で渡すと参照渡しをしてしまう。直接状態を書き換えようとすることはできない。
            // let newDisplayDataList = displayDataListState; 
            let newDisplayDataList = [...displayDataListState];
            newDisplayDataList[newDisplayDataList.length - 1] =
              updatedOperationData;
            setDisplayDataListState(newDisplayDataList);

            // set したら空にする。
            newDisplayData = {
              text: '',
              operation: '',
            };
            console.log('Update:', action);
            console.log('displayDataListState:', displayDataListState);
          }
        }
        return newDisplayData;

      case '=':
        console.log(
          'displayDataListState:',
          displayDataListState,
          ', newDisplayData:',
          newDisplayData
        );
        calcResult(currDisplayData, newDisplayData, action);

        newDisplayData = {
          text: '',
          operation: action,
          done: true,
        };
        console.log('newDisplayData:', newDisplayData);
        return newDisplayData;

      case 'CE':
        // 全消し
        newDisplayData = {
          text: '',
          operation: '',
        };
        setDisplayDataListState([]);
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

  const [currDisplayDataState, dispatch] = useReducer(reducer, initDisplayData);

  return (
    <div>
      <Box
        sx={{
          marginBottom: '10px',
          minHeight: '20px',
        }}
      >
        <Typography sx={{ fontSize: 15 }}>{historyState}</Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
          border: '1px solid gray',
          minHeight: '40px',
          borderRadius: '5px',
        }}
      >
        <Typography sx={{ fontSize: 25 }}>
          {currDisplayDataState.text}
        </Typography>
      </Box>

      {/* ボタンのグリッドレイアウト */}
      <Grid container spacing={1}>
        {/* 1行目 */}
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('CE');
            }}
          >
            CE
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('C');
            }}
          >
            C
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" fullWidth>
            ⇚
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('÷');
            }}
          >
            ÷
          </Button>
        </Grid>

        {/* 2行目 */}
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('7');
            }}
          >
            7
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('8');
            }}
          >
            8
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('9');
            }}
          >
            9
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('＋');
            }}
          >
            ＋
          </Button>
        </Grid>

        {/* 3行目 */}
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('4');
            }}
          >
            4
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('5');
            }}
          >
            5
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('6');
            }}
          >
            6
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('－');
            }}
          >
            －
          </Button>
        </Grid>

        {/* 4行目 */}
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('1');
            }}
          >
            1
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('2');
            }}
          >
            2
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('3');
            }}
          >
            3
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('×');
            }}
          >
            ×
          </Button>
        </Grid>
        {/* 修正後の5行目 */}
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch('0');
            }}
          >
            0
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" fullWidth>
            .
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="warning"
            sx={{ margin: '1px' }}
            fullWidth
            onClick={() => {
              dispatch('=');
            }}
          >
            ＝
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Calculator;
