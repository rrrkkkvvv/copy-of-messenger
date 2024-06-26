'use client';

import Input from '@/app/components/inputs folder/Input';
import Button from '@/app/components/Button';
import AuthSocialButton from './AuthSocialButton';
import { useCallback, useEffect, useState } from 'react'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter()
    const session = useSession();

    useEffect(() => {
        if (session?.status === 'authenticated') {
            console.log(session);
            router.push('/users');

        }
    }, [session?.status, router]);



    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);


    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        if (variant === 'REGISTER') {

            axios.post('/api/register', data)
                .then(() => signIn('credentials', data))
                .then(() => console.log(data))
                .catch(() => toast.error('Somenthing went wrong'))
                .finally(() => {
                    setIsLoading(false);
                });
        }
        if (variant === 'LOGIN') {
            signIn('credentials', {
                ...data,
                redirect: false,

            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error('Invalid credentials');
                    }
                    if (callback?.ok && !callback?.error) {
                        toast.success('Logged in!')
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                })

        }
    }

    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action)
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials');
                }
                if (callback?.ok && !callback?.error) {
                    toast.success('Logged in!');
                    router.push('/users');

                }
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    return (
        <div
            className="
            mt-8
            sm:mx-auto
            sm:w-full
            sm:max-w-md
        ">
            <div
                className="
                bg-white
                px-4
                py-8
                shadow
                sm:rounded-lg
                sm:px-10
            ">
                <form
                    className='space-y-6'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {variant === "REGISTER" && (
                        <Input
                            id='name'
                            disabled={isLoading}
                            label='Name'
                            register={register}
                            errors={errors}
                        />
                    )}
                    <Input
                        id='email'
                        disabled={isLoading}
                        label='Email address'
                        type='email'
                        register={register}
                        errors={errors}
                    />
                    <Input
                        id='password'
                        disabled={isLoading}
                        label='Password'
                        type='password'
                        register={register}
                        errors={errors}
                    />
                    <div>
                        <Button
                            disabled={isLoading}
                            fullWidth={true}
                            secondary={false}
                            type='submit'
                        >
                            {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                        </Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div
                            className="
                            absolute
                            inset-0
                            flex
                            items-center
                         "
                        >
                            <div
                                className="
                             w-full 
                             border-t
                              border-gray-300"
                            />
                        </div>
                        <div className="
                        relative
                         flex 
                         justify-center
                          text-sm">
                            <span className='
                            bg-white
                             px-2
                            text-gray-500'>
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex  gap-2">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction('github')}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialAction('google')}
                        />
                    </div>
                </div>

                <div className="
                flex
                gap-2
                justify-center
                text-sm
                mt-6
                px-2
                text-gray-500
                ">

                    <div >
                        {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
                    </div>
                    <button className="underline " type='button' onClick={toggleVariant}>
                        {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                    </button>

                </div>

            </div>
        </div>
    );
}
export default AuthForm