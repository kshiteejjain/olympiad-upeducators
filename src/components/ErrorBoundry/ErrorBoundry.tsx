import './ErrorBoundry.css';

type Props = {
    message: string | number
}

const ErrorBoundry = ({message}: Props) => {
    return(
        <p className='errorMessage'>{message}</p>
    )
};

export default ErrorBoundry