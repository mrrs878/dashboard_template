/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-02 17:37:07
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-06 16:33:46
 * @FilePath: \dashboard_template\src\components\MDragCard\Container.tsx
 */
import {
  useCallback, FunctionComponent,
} from 'react';
import { DndProvider } from 'react-dnd';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  ifElse, map, isEmpty, keys,
} from 'ramda';
import style from './container.module.less';
import { Card, CardSize } from './Card';

type Order = Array<string>;

export type CardEle = {
  element: FunctionComponent,
  size: CardSize
};

interface IProps {
  editable: boolean;
  order: Order;
  onDragEnd: (newOrder: Order) => void;
  cards: Record<string, CardEle>;
}

export const MDragContainer = ({
  order, editable, onDragEnd, cards,
}: IProps) => {
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const preOrder = isEmpty(order) ? keys(cards) : order;
      const dragCard = preOrder[dragIndex];
      const newOrder = update(preOrder, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      });
      onDragEnd(newOrder);
    },
    [cards, onDragEnd, order],
  );

  const cardsTmp: Array<any> = ifElse(
    isEmpty,
    () => map((key) => ({ card: cards[key], key }), keys(cards)),
    map((key: string) => ({ card: cards[key], key })),
  )(order);

  return (
    <div className={style.container}>
      <DndProvider backend={HTML5Backend}>
        {
          cardsTmp.map(({ card, key }, index) => (
            <Card
              key={key}
              index={index}
              id={key}
              Element={card.element}
              size={card.size}
              moveCard={moveCard}
              editable={editable}
            />
          ))
        }
      </DndProvider>
    </div>
  );
};
