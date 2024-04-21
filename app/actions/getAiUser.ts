import prisma from '@/app/libs/prismadb';

const getAiUser = async () => {
    try {

        const aiUser = await prisma.user.findUnique({
            where: {
                id:process.env.GPT_ACCOUNT_ID
            }
        });
        if (!aiUser) {
            return null;
        }
        return aiUser;
    } catch (error: any) {
        return null;
    };
};
export default getAiUser