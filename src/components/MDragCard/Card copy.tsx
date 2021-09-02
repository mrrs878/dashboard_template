/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-02 17:29:57
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-02 21:32:21
 * @FilePath: \dashboard_template\src\components\MDragCard\Card.tsx
 */
import { useContext, useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DragContext } from './Container';
import style from './card.module.less';

interface IProps {
  id: string;
  size: 'small' | 'medium' | 'large';
  children: any;
}

export const MDragCard = (props: IProps) => {
  const { moveCard, editable, order } = useContext(DragContext);
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = order.findIndex((c) => c === props.id);
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
    item: () => ({ id: props.id, index: order.findIndex((item) => item === props.id) }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = useMemo(() => (isDragging ? 0 : 1), [isDragging]);

  drag(drop(ref));

  return (
    <div
      key={props.id}
      ref={ref}
      className={`${style[`card-${props.size}`]} ${style.card} ${editable ? 'edit' : ''}`}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      {
        props.children
      }
    </div>
  );
};
