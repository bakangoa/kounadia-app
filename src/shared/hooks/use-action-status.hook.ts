import { useAppSelector } from "@/src/store";


export function useActionStatus(key: string) {
    const isLoading = useAppSelector((state) => state.status[key]?.status === 'loading');
    const isError = useAppSelector((state) => state.status[key]?.status === 'error');
    const isSuccess = useAppSelector((state) => state.status[key]?.status === 'success');

    return {
        isLoading,
        isError,
        isSuccess
    };
}