import React, { useState, useEffect, useRef } from "react";
import { cx, css, block, pickFontColor } from "style";
import { useInteractions } from "util/mobile";

const bss = block("text");

const Text = ({
  className,
  defaultValue,
  onChange,
  onClick,
  onLongPress,
  editable,
  children,
}) => {
  const [editing, setEditing] = useState();
  const [value, setValue] = useState(defaultValue);
  const el_input = useRef();
  const { events } = useInteractions({
    onLongPress,
  });

  useEffect(() => {
    if (editing && el_input.current) el_input.current.focus();
  }, [el_input, editing]);

  return !editable ? (
    <p
      ref={el_input}
      className={cx(bss(), className)}
      onClick={onClick}
      {...events}
    >
      {value || children}
    </p>
  ) : (
    <input
      ref={el_input}
      className={cx(bss(), className)}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type="text"
      onClick={onClick}
      {...events}
    />
  );
};

export default Text;
