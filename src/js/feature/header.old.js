import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { cx, css, block, pickFontColor } from "style"

const bss = block("header")
const Header = () => (
  <form
    className="header"
    onChange={(e) => console.log(e.target.name, e.target.value)}
  >
    {["task", "pick"].map((t) => (
      <Link key={t} className={bss("tab")} to={`/${t}`}>
        {t}
      </Link>
    ))}
  </form>
)

export default Header
