import React from 'react';
import { useForm } from 'react-hook-form';

const LoginPage = () => {
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        // Add your login logic here
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Email:</label>
                    <input type="email" {...register('email', { required: true })} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" {...register('password', { required: true })} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;