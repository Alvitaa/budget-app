import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>;

export default function Card ({children, className = "", ...props}: CardProps) {
    return(
        <div className={`card ${className}`}>
            {children}
        </div>
    );
}