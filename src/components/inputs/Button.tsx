import "./Inputs.css";

type ButtonProps = {
    text: string;
    className?: string;
    onClick(data:any): void;
}

export default function Button ({text, className, onClick}: ButtonProps) {
    return(
        <button className={`button ${className}`} onClick={() => onClick}>
            {text}
        </button>
    );
}