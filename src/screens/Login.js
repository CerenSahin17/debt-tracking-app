import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/auth/authSlice';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalIcon, setModalIcon] = useState('');

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        console.log('çalıştı')
        e.preventDefault();
        dispatch(login({ email, password }))
            .unwrap()
            .then(() => {
                navigate('/dashboard');
            })
            .catch(() => {
                handleOpenModal();
                setModalContent('Geçersiz e-posta veya şifre');
                setModalIcon(faTimes);
                setTimeout(handleCloseModal, 2000);
            });
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <section className="h-screen flex flex-col justify-center space-y-10 md:space-y-0 md:space-x-16 items-center" style={{ backgroundImage: "url('https://kobikanal.com/_next/static/media/auth-bg.85faf382.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="md:w-1/3 max-w-sm bg-blue-300 bg-opacity-90 p-10 rounded-lg">
                <div>
                    <img
                        src="https://lojiper.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fkobikanallogo.36977425.png&w=3840&q=7"
                        alt="Sample image"
                        className="mb-12" />
                </div>
                <div className="flex justify-center text-center md:text-left p-2">
                    <label className="mr-1 text-white">Şununla giriş yap</label>
                    <button
                        type="button"
                        className="mx-1 h-9 w-9 rounded-full bg-blue-700 hover:bg-blue-800 text-white shadow-[0_4px_9px_-4px_#3b71ca]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-3.5 w-3.5"
                            fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="inlne-block mx-1 h-9 w-9 rounded-full bg-blue-700 hover:bg-blue-800 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-3.5 w-3.5"
                            fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                    </button>
                </div>
                <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                    <p className="mx-4 mb-0 text-center font-semibold text-white">Veya</p>
                </div>
                <input className="text-sm w-full px-4 py-2.5 border border-solid border-gray-300 rounded mb-2" type="text" placeholder="E-posta" onChange={(e) => setEmail(e.target.value)} />
                <input className="text-sm w-full px-4 py-2.5 border border-solid border-gray-300 rounded mt-4" type="password" placeholder="Şifre" onChange={(e) => setPassword(e.target.value)} />
                <div className="mt-4 flex justify-between font-semibold text-sm mb-12">
                    <label className="flex text-white cursor-pointer">
                        <input className="mr-1" type="checkbox" />
                        <span className="hover:underline">Beni Hatırla</span>
                    </label>
                    <a className="hover:underline" style={{ color: 'rgb(18, 26, 77)' }} href='#'>Parolanızı mı unuttunuz?</a>
                </div>
                <div className="text-center md:text-left flex justify-center">
                    <button className="mt-6 bg-blue-700 hover:bg-blue-800 px-4 py-2 text-white uppercase rounded text-xs tracking-wider" style={{ backgroundColor: 'rgb(18, 26, 77)' }} type="submit" onClick={handleSubmit}>Giriş Yap</button>
                </div>
                <div className="mt-4 flex justify-center font-semibold text-sm text-white text-center">
                    Hesabın yok mu? <a className="text-transparent">a</a> <a className="text-red-600 hover:underline hover:underline-offset-4" href="register">Üye ol</a>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    icon={modalIcon}
                    text={modalContent} />
            </div>
        </section>
    );
};
export default Login;
