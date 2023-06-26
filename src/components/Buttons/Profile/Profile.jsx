import React, { useState, useEffect } from 'react';
import { query, collection, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { IoSettingsSharp, IoLogOut } from 'react-icons/io5';
import { BsChevronRight } from 'react-icons/bs';
import { BsFillQuestionCircleFill, BsFillMoonFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import './Profile.scss';
import images from '../../../constants/images';
import { auth, db } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';



const Profile = () => {
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        fetchUserInfo();
    }, [user]);
    
    const fetchUserInfo = () => {
        const q = query(collection(db, 'users'), where('userId', '==', user.uid));
        getDocs(q)
            .then(data => {
                data.forEach(d => {
                    setUserInfo({ ...d.data() })
                })
            })
            .catch(err => console.error(err));
    };

    const handleUserLogOut = () => {
        signOut(auth)
            .then(() => {
                deleteDoc(doc(db, "users", user.uid))
                    .then(() => console.log('Log out successfully'))
                    .catch((error) => console.log('Error while deleting from firestore', error));
            })
            .catch((error) => console.log('Error while signing out', error));
    };

    return (
        <div className='profile-container'>
            <div className='profiles'>
                <Link to={ `/users/${ userInfo.userLink }` } className='header'>
                    <img 
                        className='image'
                        src={ userInfo.userProfile ? userInfo.userProfile : images.user_1 } 
                        alt=''
                        loading='lazy'
                        referrerPolicy="no-referrer"
                        style={{ background: 'var(--gray_color)' }}
                        draggable='false'
                    />
                    <p>{ userInfo.userName ? userInfo.userName : 'User' }</p>
                </Link>
                <div className='line' />
                <button>Voir tous les profiles</button>
            </div>
            
            <div className='parameters'>
                <div className='param'>
                    <div className='icon'>
                        <IoSettingsSharp size={ 20 } />
                    </div>
                    <p>Paramètres et confidentialité</p>
                    <BsChevronRight className='chevron' size={ 22 } />
                </div>
                <div className='param'>
                    <div className='icon'>
                        <BsFillQuestionCircleFill size={ 18 } />
                    </div>
                    <p>Aide et assistance</p>
                    <BsChevronRight className='chevron' size={ 22 } />
                </div>
                <div className='param'>
                    <div className='icon'>
                        <BsFillMoonFill size={ 20 } />
                    </div>
                    <p>Affichage et accessibilité</p>
                    <BsChevronRight className='chevron' size={ 22 } />
                </div>
                <div 
                    className='param logout'
                    onClick={ handleUserLogOut }
                >
                    <div className='icon'>
                        <IoLogOut size={ 22 } />
                    </div>
                    <p>Se déconnecter</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;