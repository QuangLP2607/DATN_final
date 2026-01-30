import { memo, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import { Icon } from "@iconify/react";
import type { MenuItem, DropdownConfig } from "../../index";
import { TooltipPortal } from "@/components/ui/Tooltip";
import styles from "./SidebarItem.module.scss";

const cx = classNames.bind(styles);

interface ItemProps {
  data: MenuItem;
  lvl?: number;
  collapsed: boolean;
  path: string;
  onExpand?: () => void;
}

function Dropdown<T>({
  dropdown,
  onClose,
}: {
  dropdown: DropdownConfig<T>;
  onClose: () => void;
}) {
  return (
    <>
      {dropdown.options.map((opt, idx) => (
        <li className={cx("dropdown__item")} key={idx}>
          <button
            type="button"
            className={cx({ active: idx === dropdown.selectedIndex })}
            onClick={() => {
              dropdown.onSelect(idx);
              onClose();
            }}
          >
            {dropdown.getLabel(opt)}
          </button>
        </li>
      ))}
    </>
  );
}

const Item = memo(function Item({
  data,
  lvl = 0,
  collapsed,
  path,
  onExpand,
}: ItemProps) {
  const [manualOpen, setManualOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  if (collapsed && !data.icon) return null;

  const hasSub = Boolean(data.items?.length);
  const hasDrop = Boolean(data.dropdown);
  const active = Boolean(data.to && path.startsWith(data.to));
  const subOpen = hasSub && (manualOpen || active);

  const renderButtonContent = () => (
    <>
      {data.icon && <Icon icon={data.icon} className={cx("item__icon")} />}
      {!collapsed && <span className={cx("item__content")}>{data.label}</span>}
    </>
  );

  const ButtonWithTooltip = collapsed ? (
    <TooltipPortal text={data.label} position="right">
      <button
        type="button"
        className={cx("item")}
        onClick={() => {
          if (hasSub) {
            onExpand?.();
            setManualOpen((v) => !v);
          }
        }}
      >
        {renderButtonContent()}
      </button>
    </TooltipPortal>
  ) : (
    <button
      type="button"
      className={cx("item")}
      onClick={() => {
        if (hasSub) setManualOpen((v) => !v);
      }}
    >
      {renderButtonContent()}
    </button>
  );

  const LinkWithTooltip = collapsed ? (
    <TooltipPortal text={data.label} position="right">
      <Link to={data.to!} className={cx("item", { active })}>
        {renderButtonContent()}
      </Link>
    </TooltipPortal>
  ) : (
    <Link to={data.to!} className={cx("item", { active })}>
      {renderButtonContent()}
    </Link>
  );

  return (
    <li
      className={cx("menu__item", { collapsed, hasDrop })}
      style={
        !collapsed ? ({ "--level": lvl } as React.CSSProperties) : undefined
      }
    >
      <div className={cx("menu__item-wrapper", { active })}>
        {data.to ? LinkWithTooltip : ButtonWithTooltip}

        {/* Dropdown */}
        {hasDrop && !collapsed && (
          <div className={cx("dropdown")}>
            <button
              className={cx("dropdown__toggle")}
              type="button"
              onClick={() => setDropOpen((v) => !v)}
            >
              <Icon
                icon="tabler:chevron-down"
                className={cx("dropdown__icon", { open: dropOpen })}
              />
            </button>

            {dropOpen && (
              <ul className={cx("dropdown__menu")}>
                <Dropdown
                  dropdown={data.dropdown!}
                  onClose={() => setDropOpen(false)}
                />
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Sub menu */}
      {subOpen && (
        <ul className={cx("menu__sub")}>
          {data.items!.map((child, idx) => (
            <Item
              key={idx}
              data={child}
              lvl={lvl + 1}
              collapsed={collapsed}
              path={path}
              onExpand={onExpand}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

export default Item;
