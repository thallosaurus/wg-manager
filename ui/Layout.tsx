import { Children, FC, PropsWithChildren, ReactElement } from "hono/jsx";

interface LayoutProps {
}

export const Layout = (props: PropsWithChildren<LayoutProps>) => {
  return (
    <html>
        {props.children}
    </html>
  )
}