import { FC, useRef, useState } from 'react';
import { TwoPane } from "./org/layout";
import './App.scss';
import { ClearTypes, Labels } from './consts';
import { clazz } from './util';
import { processPlacement } from './scoring';
import { DraggableList } from "./org/drag"

const AttackBtn: FC<{
  onClick?: () => void
  className?: string
  label: string
}> = (props) => {
  return (
    <div onClick={props.onClick} className={"atk bevel-default " + props.className ?? ""}>
      {props.label}
    </div>
  );
}

function getTypeColor(lines: number, spin: string | null) {
  return clazz(
    spin && "color-pink",
    lines === 0 && "color-gray",
    spin && lines === 4 && "color-blue",
    lines === 4 && "color-bright"
  )
}

const AttackList: FC<{
  onAttack: (typ: string, lines: number, spin: null | "normal" | "mini") => void
}> = (props) => {
  return (
    <div className="list">
      {ClearTypes.map(([typ, lines, spin]) => 
        <AttackBtn key={typ} label={Labels[typ]}
          onClick={() => props.onAttack(typ, lines, spin)}
          className={getTypeColor(lines, spin)}/>)}
    </div>
  );
}

function getColor(lines: number) {
  if (lines <= 4) return "";
  else if (lines <= 8) return "c-1";
  else if (lines < 20) return "c-2";
  else if (lines < 40) return "c-3";
  else return "c-4";
}

const Button: FC<{
  onClick: () => void
}> = (props) => {
  return (
    <div className="bevel-default atk color-gray" onClick={props.onClick}>
      {props.children}
    </div>
  )
}

function ComboCalculator() {
  // const [state, setState] = useState(() => ({
  //   totalScore: 0,
  //   totalGarbageSent: 0,

  //   b2b: 0,
  //   combo: 0,
  //   currentcombopower: 0,
  //   currentbtbchainpower: 0,
  //   options: {
  //       b2bchaining: true,
  //       garbagemultiplier: 1
  //   }
  // }));

  const [results, setResults] = useState<any>(() => new Map());

  const [list, setList] = useState<any[]>(() => [])
  const ordering = useRef(list);

  const recompute = () => {
    const state = {
      totalScore: 0,
      totalGarbageSent: 0,
  
      b2b: 0,
      combo: 0,
      currentcombopower: 0,
      currentbtbchainpower: 0,
      options: {
          b2bchaining: true,
          garbagemultiplier: 1
      }
    };

    const result = new Map();
    for (const item of ordering.current) {
      const [score, garbage] = processPlacement(state, item.lines, item.spin);
      result.set(item, {score, garbage, b2b: state.b2b, b2bLevel: state.currentbtbchainpower});
    }

    result.set("final", state.totalGarbageSent);

    setResults(result);
  }

  return (
    <TwoPane>
        <div>
          <h1 className="t-center">Combo Calculator</h1>
          <AttackList onAttack={(typ, lines, spin) => {
            setList(ordering.current = ordering.current.concat([{typ, lines, spin}]));
            recompute();
          }}/>
        </div>
        <div className="mh-100">
          {/* Lines: { state.totalGarbageSent } */}
          <DraggableList
            items={list}
            depends={results}
            onReorder={o => { ordering.current = o; recompute() }}
            onChange={o => { setList(ordering.current = o); recompute() }}
            getClasses={x => getTypeColor(x.lines, x.spin)}
            getLabel={x => (Labels as any)[x.typ]}
            getInfo={x => {
              const obj = results.get(x);
              return <>
                {obj.garbage > 0 && <span>Sends <strong className={getColor(obj.garbage)}>{obj.garbage}</strong> {obj.garbage === 1 ? "line" : "lines"}</span>}
                {obj.b2b > 1 && <span style={{ float: "right" }}>
                  <strong>{obj.b2b - 1}x</strong>B2B (L{obj.b2bLevel})
                </span>}
              </>
            }}
          />

          {list.length === 0 && <div className="box px-3 t-center" style={{ width: 300 }}>
            <div className="mt-5 pt-3">
              Add some items to see their attack power!
            </div>
          </div>}

          {list.length > 0 && <div className="t-center mt-5">
            For a total of
            <div className="result">
              <strong className={getColor(results.get("final") ?? 0)}>{results.get("final") ?? 0}</strong> lines
            </div>
            <div className="controls">
              <Button onClick={() => {
                setList(ordering.current = []);
                recompute();
              }}>Reset</Button>
            </div>
          </div>}
        </div>
    </TwoPane>
  );
}

function App() {
  return (
    <div className="app">
      <ComboCalculator />
    </div>
  );
}

export default App;
