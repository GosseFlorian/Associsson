import type { ReactNode } from 'react';
import '../style/components/Button.css'

type ButtonComponent = {
  text: ReactNode;
  action: () => void;
  active: boolean;
}

export function Button({ text, action, active = false }: ButtonComponent) {
  return (
    <button className={active ? "button active" : "button"} onClick={action}>{text}</button>
  )
}
