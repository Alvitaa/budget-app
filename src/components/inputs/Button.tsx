import { ReactNode } from "react";
import "./Inputs.css";

type ButtonProps = {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?(data: any): void;
}

export default function Button({ children, className, type = "button", disabled = false, onClick }: ButtonProps) {
    return (
        <button className={`button ${className}`} type={type} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );

}