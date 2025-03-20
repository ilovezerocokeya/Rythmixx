import AuthForm from '@/components/auth/AuthForm';

const AuthPage = () => {
  return (
    <div className="flex flex-col justify-center items-center mx-auto w-[320px] h-[568px] bg-black">
      <p className="mb-8 text-center text-white">Rhythmix 에서 나에게 딱 맞는 노래를 모아 Mix 하세요!</p>
      <AuthForm />
    </div>
  );
};

export default AuthPage;
