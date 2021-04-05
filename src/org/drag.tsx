// export const a = 1
import { useDrag } from "react-use-gesture";
import { useSprings, animated, to } from "react-spring";
import { FC, useEffect, useRef } from "react";
import { clazz } from "../util";

export function clamp(x: number, min: number, max: number) {
    return Math.max(min, Math.min(max, x));
}

export function swap<T>(array: T[], from: number, to: number) {
    const result = array.slice();
    const val = result.splice(from, 1)[0];
    result.splice(to, 0, val);

    return result;
}

const BOX_HEIGHT = 100;

// WHEN dragging, this function will be fed with all arguments.
// OTHERWISE, only the list order is relevant.
const fn = (order: number[], force: boolean, down?: boolean, originalIndex?: number, curIndex?: number, y?: number) => (index: number) =>
  ((down && index === originalIndex) || force)
    ? /*
      No need to transition the following properties:
      - z-index, the elevation of the item related to the root of the view; it should pop straight up to 1, from 0.
      - y, the translated distance from the top; it's already being updated dinamically, smoothly, from react-gesture.
      Thus immediate returns `true` for both.
    */
      { y: (curIndex ?? order.indexOf(index)) * BOX_HEIGHT + (y ?? 0), scale: down ? 1.1 : 1, zIndex: down ? '1' : '0', shadow: down ? 15 : 1, immediate: (n: string) => n === 'y' || n === 'zIndex' }
    : { y: order.indexOf(index) * BOX_HEIGHT, scale: 1, zIndex: '0', shadow: 1, immediate: false }

export const DraggableList: FC<{
    items: any[]
    depends?: any
    onReorder(items: any[]): void
    onChange(items: any[]): void
    getLabel(item: any): React.ReactElement
    getInfo(item: any, index: number): React.ReactElement
    getClasses(item: any): string
}> = ({ items, onReorder, onChange, getLabel, getInfo, getClasses }) => {
  const order = useRef<number[]>([]) // Store indices as a local ref, this represents the item order

  /*
    Curries the default order for the initial, "rested" list state.
    Only the order array is relevant when the items aren't being dragged, thus
    the other arguments from fn don't need to be supplied initially.
  */
  const [springs, setSprings] = useSprings(items.length, fn(order.current, true));
  useEffect(() => { 
    order.current = items.map((_, index) => index);
    setSprings.start(fn(order.current, true));
  }, [setSprings, items, items.length])
//   const bind = useDrag(({ args: [originalIndex], down, delta: [, y] }) => {
//     const curIndex = order.current.indexOf(originalIndex);
//     const curRow = clamp(Math.round((curIndex * BOX_HEIGHT + y) / BOX_HEIGHT), 0, items.length - 1);
//     const newOrder = swap(order.current, curIndex, curRow);
//     /*
//       Curry all variables needed for the truthy clause of the ternary expression from fn,
//       so that new objects are fed to the springs without triggering a re-render.
//     */
//     const val = fn(newOrder, down, originalIndex, curIndex, y);
//     setSprings.current[0].start(val as any);
//     // Settles the new order on the end of the drag gesture (when down is false)
//     if (!down) order.current = newOrder;
//   })
    const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
        const curIndex = order.current.indexOf(originalIndex);
        const curRow = clamp(Math.round((curIndex * BOX_HEIGHT + y) / BOX_HEIGHT), 0, items.length - 1);
        const newOrder = swap(order.current, curIndex, curRow);

        setSprings.start(fn(newOrder, false, active, originalIndex, curIndex, y));
        if (!active) {
            order.current = newOrder;
            onReorder(order.current.map(x => items[x]));
        }
    })

    const onDelete = (index: number) => {
        const fromIndex = order.current.indexOf(index);
        console.log(index, fromIndex, order.current);
        const prev = order.current.map(x => items[x]);
        order.current.splice(fromIndex, 1);
        prev.splice(fromIndex, 1);
        onChange(prev);
    }

    const bindDelete = useDrag(({ event }) => {
        event.stopPropagation();
    })

    return (
        <div className="content mt-3 px-3">
        <div style={{ height: items.length * BOX_HEIGHT }}>
            {springs.map(({ zIndex, shadow, y, scale }, i) => (
                <animated.div
                className="child"
                key={i}
                style={{
                    zIndex: zIndex as any,
                    boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
                    transform: to([y, scale], (y, s) => `translate3d(0,${y}px,0) scale(${s})`)
                }}
                >
                    <div className={clazz("bevel-default", "px-2", getClasses(items[i]))} {...bind(i)}>
                        {getLabel(items[i])}

                        <div className="delete" {...bindDelete(i)} onClick={() => onDelete(i)}>
                            <strong>x</strong>
                        </div>
                    </div>
                    <div className="details">
                        {getInfo(items[i], order.current[i] ?? i)}
                    </div>
                </animated.div>
            ))}
        </div>
        </div>
    )
}
