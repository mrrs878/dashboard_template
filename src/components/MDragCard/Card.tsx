/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-02 17:29:57
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-27 15:47:53
 * @FilePath: \dashboard_template\src\components\MDragCard\Card.tsx
 */
import {
  useRef, useEffect, FunctionComponent,
} from 'react';
import { useDrop, useDrag } from 'react-dnd';
import style from './card.module.less';

export type CardSize = 'small' | 'medium' | 'large';
export type MoveCard = (dragIndex: number, hoverIndex: number) => void;
interface IProps {
  id: string;
  size: CardSize;
  moveCard: MoveCard;
  index: number;
  Element: FunctionComponent;
}

interface IDropItem {
  id: string;
  index: number;
}

export const Card = ({
  id, Element, index, moveCard, size,
}: IProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<IDropItem, any, any>({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;

  useEffect(() => {
    drag(drop(ref));
  }, [drag, drop]);

  return (
    <div
      className={`${style[`card-${size}`]} ${style.card}`}
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <Element />
    </div>
  );
};
