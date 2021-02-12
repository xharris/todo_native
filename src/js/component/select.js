import React, { useState, useEffect, useRef } from "react"
import { cx, css, block, pickFontColor } from "style"

const bss = block("select")

const Select = ({ className, values, ...props }) => (
  <select className={cx(bss(), className)} {...props}>
    {Object.entries(values).map(([k, v]) => (
      <option value={k} key={k}>
        {v}
      </option>
    ))}
  </select>
)

export default Select
