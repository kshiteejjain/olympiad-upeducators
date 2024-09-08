import { ReactNode } from 'react';
import Button from '../Buttons/Button';

import './Card.css';

type Props = {
    title?: string,
    amount?: ReactNode,
    currency?: string,
    bgWhite?: boolean,
    isButton?: boolean
}

const Card = ({ title, amount, currency, bgWhite, isButton }: Props) => {
    return (
        <div className={bgWhite ? 'card' : 'card gradient'}>
            <div className='inner'>
                <h1>{title}</h1>
                <h2>{currency}{amount}</h2>
            </div>
            {isButton && <Button title='Withdraw' type='button' isArrow />}
        </div>
    )
};

export default Card;