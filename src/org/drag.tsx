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

const fn = (order: number[], force: boolean, down?: boolean, originalIndex?: number, curIndex?: number, y?: number) => (index: number) =>
    ((down && index === originalIndex) || force)
        ?
        { y: (curIndex ?? order.indexOf(index)) * BOX_HEIGHT + (y ?? 0), scale: down ? 1.1 : 1, zIndex: down ? '1' : '0', shadow: down ? 15 : 1, immediate: (n: string) => n === 'y' || n === 'zIndex' }
        : { y: order.indexOf(index) * BOX_HEIGHT, scale: 1, zIndex: '0', shadow: 1, immediate: false }

function isFuckingStupid(item: any) {
    return item.lines === 0 || (item.spin != null && item.lines !== 4 && item.lines !== 2)
}

export const DraggableList: FC<{
    items: any[]
    depends?: any
    onSuperficialChange(items: any[]): void
    onChange(items: any[]): void
    getLabel(item: any): React.ReactElement
    getInfo(item: any, index: number): React.ReactElement
    getClasses(item: any): string
}> = ({ items, onSuperficialChange, onChange, getLabel, getInfo, getClasses }) => {
    const order = useRef<number[]>([])

    const [springs, setSprings] = useSprings(items.length, fn(order.current, true));
    useEffect(() => {
        order.current = items.map((_, index) => index);
        setSprings.start(fn(order.current, true));
    }, [setSprings, items, items.length])
    const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
        const curIndex = order.current.indexOf(originalIndex);
        const curRow = clamp(Math.round((curIndex * BOX_HEIGHT + y) / BOX_HEIGHT), 0, items.length - 1);
        const newOrder = swap(order.current, curIndex, curRow);

        setSprings.start(fn(newOrder, false, active, originalIndex, curIndex, y));
        if (!active) {
            order.current = newOrder;
            onSuperficialChange(order.current.map(x => items[x]));
        }
    })

    const onDelete = (index: number) => {
        const fromIndex = order.current.indexOf(index);
        const prev = order.current.map(x => items[x]);
        order.current.splice(fromIndex, 1);
        prev.splice(fromIndex, 1);
        onChange(prev);
    }


    const onTogglePC = (index: number) => {
        const fromIndex = order.current.indexOf(index);
        const prev = order.current.map(x => items[x]);
        prev[fromIndex].pc = !prev[fromIndex].pc;

        onSuperficialChange(prev);
    }

    const bindButton = useDrag(({ event }) => {
        event.stopPropagation();
    })

    return (
        <div className="content mt-3 px-3">
            <div style={{ height: items.length * BOX_HEIGHT }}>
                {springs.map(({ zIndex, shadow, y, scale }, i) => (
                    <animated.div
                        className="child"
                        key={items[i].key}
                        style={{
                            zIndex: zIndex as any,
                            boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
                            transform: to([y, scale], (y, s) => `translate3d(0,${y}px,0) scale(${s})`)
                        }}
                    >
                        <div className={clazz("bevel-default", "px-2", getClasses(items[i]))} {...bind(i)}>
                            {getLabel(items[i])}

                            <div className="delete" {...bindButton(i)} onClick={() => onDelete(i)}>
                                <strong>x</strong>
                            </div>

                            <div className={clazz("delete", "d-flex", "items-center", "mr-3", items[i].pc && ["active", "c-2"])} {...bindButton(i)} onClick={() => onTogglePC(i)}>
                                { items[i].pc && isFuckingStupid(items[i]) &&
                                    <img className="mr-1" src="/boom.jpg" style={{height: "26px"}} alt="Impossible" title="It is impossible to perform a PC using this action under normal rules." />
                                }
                                <strong>PC</strong>
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
