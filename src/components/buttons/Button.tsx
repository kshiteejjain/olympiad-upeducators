import './Button.css';
type Props = {
    title?: string;
    onClick?: () => void;
    type?: string;
    isSecondary?: boolean;
    isDangerous?: boolean;
    isSocial?: boolean;
    isGoBack?: boolean;
    isImage?: boolean;
    imagePath?: string
    isDisabled?: boolean
}
const Button = ({ title, onClick, isSecondary, isDisabled }: Props) => {

    return (
        <button className={isSecondary ? 'isSecondary' : 'button'} onClick={onClick} disabled={isDisabled}>
            {title}
        </button>
    )
};

export default Button;