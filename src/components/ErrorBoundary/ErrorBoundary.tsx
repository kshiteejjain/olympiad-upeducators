import './ErrorBoundary.css';

type Props = {
    message: string | number
}

const ErrorBoundary = ({message}: Props) => {
    return(
        <p className='errorMessage'>{message}</p>
    )
};

export default ErrorBoundary