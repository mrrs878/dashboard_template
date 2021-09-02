/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-02 17:37:07
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-02 22:03:12
 * @FilePath: \dashboard_template\src\components\MDragCard\Container.tsx
 */
import {
  useCallback, createContext, useMemo,
} from 'react';
import { DndProvider } from 'react-dnd';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import style from './container.module.less';
import { Card } from './Card';

type Order = Array<string>;
export type CardEle = { element: any, key: string, size: 'small' | 'medium' | 'large' };

interface IProps {
  editable: boolean;
  order: Order;
  onDragEnd: (newOrder: Order) => void;
  cards: Array<CardEle>;
}

interface IContext {
  moveCard: (dragKey: number, hoverKey: number) => void;
  order: Order;
  editable: boolean;
}

export const DragContext = createContext<IContext>({
  moveCard: () => ({}),
  order: [],
  editable: false,
});

export const MDragContainer = ({
  order, editable, onDragEnd, cards,
}: IProps) => {
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      console.log(dragIndex, hoverIndex);
      const dragCard = order[dragIndex];
      console.log(dragCard);
      const newOrder = update(order, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      });
      console.log(newOrder);
      onDragEnd(newOrder);
    },
    [onDragEnd, order],
  );
  const renderCard = (card: CardEle, index: number) => (
    <Card
      key={card.key}
      index={index}
      id={card.key}
      Node={card.element}
      size={card.size}
      moveCard={editable ? moveCard : () => {}}
      editable={editable}
    />
  );
  const cardsTmp = useMemo(
    () => order.map((item) => cards.find(({ key }) => key === item)),
    [cards, order],
  );
  return (
    <DragContext.Provider value={{ moveCard, editable, order }}>
      <div className={style.container}>
        <DndProvider backend={HTML5Backend}>
          {
            cardsTmp.map((card, index) => renderCard(card as CardEle, index))
          }
        </DndProvider>
      </div>
    </DragContext.Provider>
  );
};
