/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-02 17:29:57
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-02 21:53:00
 * @FilePath: \dashboard_template\src\components\MDragCard\Card.tsx
 */
import { useRef, useMemo, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import style from './card.module.less';

export const Card = ({
  id, Node, index, moveCard, size, editable,
}: any) => {
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
  const opacity = useMemo(() => (isDragging ? 0 : 1), [isDragging]);

  useEffect(() => {
    if (editable) drag(drop(ref));
  }, [drag, drop, editable]);

  return (
    <div
      className={`${style[`card-${size}`]} ${style.card} ${editable ? 'edit' : ''}`}
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <Node />
    </div>
  );
};
