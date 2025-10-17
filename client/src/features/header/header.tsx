import { useContext } from 'react';
import './header.scss';
import { Context } from '../../main';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import accountIconSrc from '../../assets/account.svg';
import logoutIconSrc from '../../assets/logout.svg';

export const Header = observer(() => {
    const { user } = useContext(Context)

    return (
        <header className='header'>
            <div className="container header__container">
                <Link to='/' className='header__logo'>Spendings APP</Link>
                <nav>
                    <ul>
                        {user.isAuth

                            ? <>
                                <Link to='/' className='link'><li>Главная</li></Link>
                                <Link to='#' className='link'><li>Feedback</li></Link>
                                <Link to='/Spendings' className='link'><li>Траты</li></Link>
                                <Link to='/Account' className=''><li><img src={accountIconSrc} alt="Личный кабинет" height={30} /></li></Link>
                                <Link to='/Account' className=''><li><img src={logoutIconSrc} alt="Личный кабинет" height={30} width={30} /></li></Link>
                            </>
                            : <>
                                <Link to='/' className='button-link'><li>Главная</li></Link>
                                <Link to='#' className='button-link'><li>Feedback</li></Link>
                                <Link to='/Account' className=''><li><img src={accountIconSrc} alt="Личный кабинет" height={30} /></li></Link>
                            </>
                        }
                    </ul>
                </nav>
            </div>
        </header>
    )
})