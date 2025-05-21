import React, { useEffect, useState, useRef, useCallback, Children, isValidElement } from 'react';
import style from './ContextMenu.module.css';

interface ContextMenuItemProps {
  text: string;
  icon: React.ElementType<{ size: number}>;
  onClick?: () => void;
}
export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ text, icon, onClick}) => {

    return (
        <li onClick={onClick} className={style.menuItem}>
            <div style={{ marginRight: "5px"}}>{React.createElement(icon, { size: 20})}</div>
            { text }
        </li>
    )
};

interface ContextMenuProps {
  children: React.ReactNode;
  area?: React.RefObject<HTMLElement | null>;
}
const ContextMenu: React.FC<ContextMenuProps> = ({children, area}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const blockRef = useRef<HTMLDivElement | null>(null);

  const contextMenuShow = useCallback((event: MouseEvent) => {
    event.preventDefault();
    const el = event.target as HTMLElement;
    const rect = el.getBoundingClientRect();
    const clickY = event.clientY;
    const menuHeight = blockRef.current?.offsetHeight ?? 0; // Если undefined, возьмём 0
    let topY: number;

    if (rect.top < 0 || rect.bottom > window.innerHeight || clickY < window.innerHeight / 2) {
      topY = clickY + 10;
    } else {
      topY = clickY - menuHeight - 10;
    }

    // if (clickY < windowHeight / 2) {
    //   top = clickY + 10;
    // } else {
    //   if(menuHeight) { top = clickY - menuHeight - 10; }
    // }
  
    setPosition({ x: event.clientX, y: topY });
    setVisible(true);
  }, []);

  const contextMenuHide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    const element = area && area.current ? area.current : document;

    const hasContextMenuItem = Children.toArray(children).some(child => {
        return isValidElement(child) && child.type === ContextMenuItem;
     });
    if(!hasContextMenuItem) {
        throw new Error ("Компонент ContextMenu ничего не может принимать кроме ContextMenuItem");
    }

    element.addEventListener("contextmenu", contextMenuShow as EventListener);
    document.addEventListener('click', contextMenuHide);

    return () => {
      element.removeEventListener("contextmenu", contextMenuShow as EventListener);
      document.removeEventListener('click', contextMenuHide);
    };
  }, [contextMenuShow, contextMenuHide, area, children]);

  return (
    <>
      {visible && (
        <div
          className={style.contextMenu}
          style={{ top: position.y, left: position.x }}
          onClick={(e) => { e.stopPropagation(); }}
          ref={blockRef}
        >
          <ul className={style.menu}>
            { children }
          </ul>
        </div>
      )}
    </>
  );
};

export default ContextMenu;
