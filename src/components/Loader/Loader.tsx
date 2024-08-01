import './Loader.css';

type Props = {
    title: string | number
}

const Loader = ({ title }: Props) => {
    return (
        <div className='loading'>
            <span className="loader"></span>
            <p>{title}</p>
        </div>
    )
};

export default Loader